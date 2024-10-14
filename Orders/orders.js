let orders = []; // Declare a global variable to store orders

// Function to fetch orders
async function fetchOrders() {
    try {
        const response = await fetch('Orders/fetch_orders.php'); // URL to your PHP file
        orders = await response.json(); // Store the orders globally
        displayOrders(orders); // Call displayOrders to show all orders
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

async function updateStatus(orderId, newStatus) {
    try {
        await fetch('Orders/update_order_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ order_id: orderId, status: newStatus })
        });
        showNotification("Η κατάσταση ενημερώθηκε","notification");
    } catch (error) {
        showNotification("Σφάλμα κατά την ενημέρωση της κατάστασης","alert");
    }
}

// Function to display orders
function displayOrders(ordersToDisplay) {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = ''; // Clear existing content

    // Check if there are orders
    if (ordersToDisplay.length > 0) {
        ordersToDisplay.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
        ordersToDisplay.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.innerHTML = `
                <h2>Αριθμός Παραγγελίας: ${order.order_id}</h2>
                <p><strong>Ονοματεπώνυμο:</strong> ${order.customer_name}</p>
                <p><strong>Προϊόντα:</strong> ${order.items.map(item => `${item.product_name} (${item.quantity})`).join(', ')}</p>
                <p><strong>Διεύθυνση Παράδοσης:</strong> ${order.customer_address} ${order.customer_city} ${order.customer_country} ${order.customer_zip_code}</p>
                <p><strong>Box Now Locker Id:</strong> 
                    <span class="box_now_customer" style="display: ${order.root !== 1 ? 'inline' : 'none'};">${order.box_now}</span>
                    <input type="text" name="box_now" class="box_now_admin" value="${order.box_now}" style="display: ${order.root === 1 ? 'inline' : 'none'};" />
                    ${order.root === 1 ? `<button class="update-box-now" onclick="updateBoxNow(${order.order_id}, ${order.customer_id}, this)">Ενήμερωση</button>` : ''}
                </p>
                <p><strong>Μέθοδος Πληρωμής:</strong> ${order.payment_method}</p>
                <p><strong>Απόδειξη:</strong> ${order.receipt}</p>
                <p><strong>Συνολική Τιμή:</strong> ${order.total_amount}</p>
                <p>
                    <strong>Κατάσταση:</strong>
                    ${order.root ? `
                        <select onchange="updateStatus(${order.order_id}, this.value)">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Αναμένει</option>
                            <option value="processed" ${order.status === 'processed' ? 'selected' : ''}>Επεξεργάζεται</option>
                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Απεσταλμένη</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Παραδοθείσα</option>
                            <option value="canceled" ${order.status === 'canceled' ? 'selected' : ''}>Ακυρωμένη</option>
                        </select>
                    ` : `
                        <span>${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    `}
                </p>
            `;
            ordersList.appendChild(orderCard); // Add order card to the list
        });
    } else {
        ordersList.innerHTML = '<p>No orders found.</p>'; // Message when no orders are present
    }
}

// Function to update Box Now Locker ID
async function updateBoxNow(order_id,customer_id, buttonElement) {
    const inputField = buttonElement.previousElementSibling;
    const newBoxNowId = inputField.value; // Get the new ID from the input field

    try {
        await fetch('Orders/update_box_now.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ order_id: order_id, customer_id: customer_id, box_now: newBoxNowId })
        });
        showNotification("Ενημερώθηκε το Box Now Locker","notification");
    } catch (error) {
        showNotification("Αποτυχία ενημέρωσης του Box Now Locker","alert");
    }
}



// Function to search orders
function searchOrders() {
    const searchValue = document.getElementById('search-bar').value.toLowerCase();
    const filteredOrders = orders.filter(order => order.order_id.toString().includes(searchValue));
    displayOrders(filteredOrders);
}

// Fetch orders on page load
window.onload = fetchOrders;
