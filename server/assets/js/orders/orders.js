let orders = []; // Declare a global variable to store orders

// Function to fetch orders
async function fetchOrders() {
    try {
        const response = await fetch('../../include/orders/fetch_orders.php'); // URL to your PHP file
        orders = await response.json(); // Store the orders globally
        await displayOrders(); // Call displayOrders to show all orders
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
        await showNotification("Η κατάσταση ενημερώθηκε","notification");
    } catch (error) {
        await showNotification("Σφάλμα κατά την ενημέρωση της κατάστασης","alert");
    }
}

// Function to display orders
async function displayOrders(display_orders = null) {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = ''; // Clear existing content

    if (display_orders === null) {
        display_orders = orders;
    }

    // Check if there are orders
    if (Object.keys(display_orders).length> 0) {
        const productTemplate = await loadHtmlComponent('../../components/built/card/orders.html');
        console.log(display_orders);
        for (const pos in display_orders) {
            const orderInfo = display_orders[pos];// Order details
            const productCard = productTemplate.cloneNode(true);
            productCard.setAttribute('id', pos);
            //productCard.querySelector('#product_image').src = item.image;
            productCard.querySelector('#order_id').textContent = 'Order Id: ' + orderInfo.id;
            productCard.querySelector('#total_price').textContent = 'Total: ' + orderInfo.total_price + '€';
            productCard.querySelector('#status_image').src = '../../../assets/icons/status/' + orderInfo.status + '.svg';
            productCard.querySelector('#status_text').textContent = orderInfo.status.charAt(0).toUpperCase()+orderInfo.status.slice(1);

            productCard.addEventListener('click', () =>{
                window.location.href = `main.php?page=order_info&order_id=${orderInfo.id}`;
            })
            ordersList.append(productCard);
        }
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
async function searchOrders() {
    const searchValue = document.getElementById('search-bar').value.toLowerCase();
    let filteredOrders = [];
    for (const orderId in orders) {
        if (orders[orderId].id.includes(searchValue)) filteredOrders.push(orders[orderId]);
    }
    await displayOrders(filteredOrders);
}

// Fetch orders on page load
window.onload = fetchOrders;
