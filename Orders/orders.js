let orders = []; // Declare a global variable to store orders

// Function to fetch orders
async function fetchOrders() {
    try {
        const response = await fetch('Orders/fetch_orders.php'); // URL to your PHP file
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        orders = await response.json(); // Store the orders globally
        displayOrders(orders); // Call displayOrders to show all orders
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

async function updateStatus(orderId, newStatus) {
    try {
        const response = await fetch('Orders/update_order_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ order_id: orderId, status: newStatus })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Status updated:', result);
    } catch (error) {
        console.error('Error updating status:', error);
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
                <h2>Order ID: ${order.order_id}</h2>
                <p><strong>Customer Name:</strong> ${order.customer_name}</p>
                <p><strong>Products:</strong> ${order.items.map(item => `${item.product_name} (${item.quantity})`).join(', ')}</p>
                <p><strong>Delivery Address:</strong> ${order.customer_address}</p>
                <p><strong>Box Now Locker Id:</strong> ${order.box_now}</p>
                <p><strong>Payment Method:</strong> ${order.payment_method}</p>
                <p><strong>Receipt:</strong> ${order.receipt}</p>
                <p><strong>Συνολική Τιμή:</strong> ${order.total_amount}</p>
                <p>
                    <strong>Status:</strong>
                    ${order.root ? `
                        <select onchange="updateStatus(${order.order_id}, this.value)">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="processed" ${order.status === 'processed' ? 'selected' : ''}>Processed</option>
                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="canceled" ${order.status === 'canceled' ? 'selected' : ''}>Canceled</option>
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

// Function to search orders
function searchOrders() {
    const searchValue = document.getElementById('search-bar').value.toLowerCase();
    const filteredOrders = orders.filter(order => order.order_id.toString().includes(searchValue));
    displayOrders(filteredOrders);
}

// Fetch orders on page load
window.onload = fetchOrders;
