let orders = []; // Global array to store fetched orders
let super_user = 'null'; // Flag for user access level

// Fetch orders from the server
async function fetchOrders() {
    try {
        const formData = new FormData();
        formData.append('action', 'fetch');
        if (super_user === 'super') formData.append('user', 'super');

        const response = await fetch('../../include/orders/orders.php', {
            method: 'POST',
            body: formData
        });

        orders = await response.json();

        // Normalize to 2D array structure
        if (typeof orders[0] === 'undefined') {
            orders = [orders];
        }

        await displayOrders();
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Render all orders to the DOM
async function displayOrders(display_orders = null) {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';

    display_orders = display_orders || orders;

    if (Object.keys(display_orders).length > 0) {
        const productTemplate = await loadHtmlComponent('../../components/built/card/orders.html');

        for (const pos in display_orders) {
            const orderInfo = display_orders[pos];
            const productCard = productTemplate.cloneNode(true);

            productCard.setAttribute('id', pos);
            productCard.querySelector('#order_id').textContent = 'Order Id: ' + orderInfo.id;
            productCard.querySelector('#total_price').textContent = 'Total: ' + orderInfo.total_price + '€';
            productCard.querySelector('#date').textContent = 'Date: ' + orderInfo.order_date;
            productCard.querySelector('#status_image').src = '../../../assets/icons/status/' + orderInfo.status + '.svg';
            productCard.querySelector('#status_text').textContent = orderInfo.status.charAt(0).toUpperCase() + orderInfo.status.slice(1);

            productCard.addEventListener('click', () => {
                window.location.href = `main.php?page=order_info${super_user === 'super' ? `&user=super` : ''}&order_id=${orderInfo.id}`;
            });

            ordersList.append(productCard);
        }
    } else {
        ordersList.innerHTML = '<p>No orders found.</p>';
    }
}

// Filter and display orders by search input
async function searchOrders() {
    const searchValue = document.getElementById('search-bar').value.toLowerCase();
    const filteredOrders = orders.filter(order => order.id.includes(searchValue));
    await displayOrders(filteredOrders);
}

// Initialize and fetch orders on page load
window.onload = async function () {
    super_user = getQueryParameter('user');
    await fetchOrders();
};
