// Store current BoxNow value
let box_now;

// Initialize order view and user access on window load
window.onload = function () {
    fetchOrder();
    const super_user = getQueryParameter('user');
    if (super_user !== 'super') {
        disableEdit();
    } else {
        box_now = document.getElementById('box_now').value;
    }
};

let order_info;
let order_items;
let user_address = [];

// Fetch order and product data from the server
function fetchOrder() {
    const order_id = getQueryParameter('order_id');
    document.getElementById('order_title').textContent = 'Order Id: ' + order_id;

    const formData = new FormData();
    formData.append('action', 'fetch');
    formData.append('order_id', order_id);

    fetch('../../../include/orders/orders.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(async orders => {
            order_info = orders[0];
            order_items = Array.isArray(orders[1]) ? orders[1] : [orders[1]];
            await setUserInfo();
            await setItemsInfo();
            await setPaymentInfo();
        })
        .catch(error => console.error('Error fetching product details:', error));
}

// Populate user profile and address fields
async function setUserInfo() {
    const formData = new FormData();
    formData.append('user_id', order_info.user_id);
    formData.append('address_id', order_info.address_id);
    formData.append('action', 'fetch_one');

    user_address = await getUserInfo(formData);

    if (order_info.full_name !== null) user_address[0].full_name = order_info.full_name;
    if (order_info.email !== null) user_address[0].email = order_info.email;
    if (order_info.phone !== null) user_address[0].phone = order_info.phone;

    document.getElementById('full_name').value = user_address[0].full_name;
    document.getElementById('email').value = user_address[0].email;
    document.getElementById('phone').value = user_address[0].phone;

    document.getElementById('address').value = user_address[1].address;
    document.getElementById('zip_code').value = user_address[1].zip_code;
    document.getElementById('city').value = user_address[1].city;
    document.getElementById('country').value = user_address[1].country;
    document.getElementById('box_now').value = order_info.box_now ?? user_address[1].box_now;
}

// Render order item cards using product data
async function setItemsInfo() {
    const productTemplate = await loadHtmlComponent('../../components/built/product/product.html');
    const itemList = document.getElementById('order_products');
    itemList.innerHTML = '';

    for (const item of order_items) {
        const productCard = productTemplate.cloneNode(true);
        const product_info = await getProductInfo(item.product_id);

        productCard.setAttribute('id', item.product_id);
        productCard.querySelector('#product_image').src = product_info.main_image;
        productCard.querySelector('#product_name').textContent = product_info.name;
        productCard.querySelector('#quantity').textContent = item.quantity;
        productCard.querySelector('#product_price').textContent = 'Total: ' + (item.price * item.quantity) + '€';
        productCard.querySelector('#product_price_per_item').textContent = 'Per Item: ' + item.price + '€';

        productCard.querySelector('.decrease_button').style.display = 'none';
        productCard.querySelector('.increase_button').style.display = 'none';

        itemList.append(productCard);
    }
}

// Fetch product info by ID
async function getProductInfo(id) {
    const formData = new FormData();
    formData.append('product_id', id);
    formData.append('action', 'fetch_product');

    return fetch('../../include/shop/shop.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .catch(error => console.error('Error fetching product:', error));
}

// Populate payment and status details
async function setPaymentInfo() {
    document.getElementById('sub_total').textContent = order_info.sub_total + '€';
    document.getElementById('coupon').textContent = order_info.coupon === 'Free Shipping'
        ? order_info.coupon
        : order_info.coupon + '€';
    document.getElementById('shipping').textContent = order_info.shipping + '€';
    document.getElementById('total_price').textContent = 'Total: ' + order_info.total_price + '€';
    document.getElementById('payment_method').textContent = order_info.payment_method;
    document.getElementById('receipt').textContent = order_info.receipt;
    document.getElementById('date').textContent = order_info.order_date;

    document.getElementById('status_image').src = '../../../assets/icons/status/' + order_info.status + '.svg';
    document.getElementById('status_text').textContent = '(' + order_info.status + ')';
}

// Update order status from dropdown
function updateStatus(status = null) {
    document.getElementById('status_image').src = '../../../assets/icons/status/' + status + '.svg';
    document.getElementById('status_text').textContent = '(' + status + ')';
    document.querySelector('.dropdown_items').style.display = 'none';

    const formData = new FormData();
    formData.append('action', 'update_status');
    formData.append('order_id', order_info.id);
    formData.append('status', status);

    fetch('../../../include/orders/orders.php', {
        method: 'POST',
        body: formData
    })
        .then(() => showNotification('Status Changed', 'success'))
        .catch(error => console.error("Error Updating Status:", error));
}

// Show or hide status dropdown
function toggleDropdown(visible = false) {
    document.querySelector('.dropdown_items').style.display = visible ? 'block' : 'none';
}

// Disable edit inputs for non-admin users
function disableEdit() {
    document.getElementById('box_now').disabled = true;
    document.getElementById('apply_button').remove();
}

// Toggle update button availability based on input change
function toggleUpdateButton() {
    document.getElementById('apply_button').disabled =
        box_now === document.getElementById('box_now').value;
}

// Send updated BoxNow value to the server
function updateBoxNow() {
    box_now = document.getElementById('box_now').value;

    const formData = new FormData();
    formData.append('action', 'update_box_now');
    formData.append('order_id', order_info.id);
    formData.append('box_now', box_now);

    fetch('../../../include/orders/orders.php', {
        method: 'POST',
        body: formData
    })
        .then(() => showNotification('Box Now Id Changed!', 'success'))
        .catch(error => console.error("Error Updating BoxNow:", error));

    document.getElementById('apply_button').disabled =
        box_now === document.getElementById('box_now').value;
}
