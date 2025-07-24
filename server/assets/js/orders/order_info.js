window.onload = fetchOrder;
let order_info;
let order_items;
let user_address = [];

function fetchOrder() {
    const order_id = getQueryParameter('order_id');
    document.getElementById('order_title').textContent = 'Order Id: ' + order_id;

    fetch('../../../include/orders/fetch_orders.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ 'order_id': order_id })
    })
        .then(response => response.json())
        .then(async orders => {
            order_info = orders[0];
            if (Array.isArray(orders[1])) {
                order_items = orders[1];
            } else {
                order_items = [orders[1]];
            }
            await setUserInfo();
            await setItemsInfo();
            await setPaymentInfo();
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
}

async function setUserInfo() {
    user_address = await getUserInfo();
    if (order_info.full_name !== null) {
        user_address[0].full_name = order_info.full_name;
    }
    if (order_info.email !== null) {
        user_address[0].email = order_info.email;
    }
    if (order_info.phone !== null) {
        user_address[0].phone = order_info.phone;
    }
    document.getElementById('full_name').value = user_address[0].full_name;
    document.getElementById('email').value = user_address[0].email;
    document.getElementById('phone').value = user_address[0].phone;

    document.getElementById('address').value = user_address[1].address;
    document.getElementById('zip_code').value = user_address[1].zip_code;
    document.getElementById('city').value = user_address[1].city;
    document.getElementById('country').value = user_address[1].country;
    document.getElementById('box_now').value = user_address[1].box_now;
}

async function getUserInfo() {
    const formData = new FormData();
    formData.append('user_id', order_info.user_id);
    formData.append('address_id', order_info.address_id);

    return fetch('../../include/orders/fetch_user_address.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data && Object.keys(data).length > 0) {
                return data;
            }
            return '';
        })
        .catch(error => console.error('Error fetching data:', error));
}

async function setItemsInfo() {
    const productTemplate = await loadHtmlComponent('../../components/built/product/product.html');
    const itemList = document.getElementById('order_products');
    // Clear existing cart items
    itemList.innerHTML = '';

    for (const item of order_items) {
        const productCard = productTemplate.cloneNode(true);
        const product_info = await getProductInfo(item.product_id);
        // Set unique ID for the card
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

async function getProductInfo(id) {
    const formData = new FormData();
    formData.append('product_id',id);

    return fetch('../../include/shop/product_preview.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.error('Error fetching data:', error));
}

async function setPaymentInfo() {
    console.log(order_info)
    document.getElementById('sub_total').textContent = order_info.sub_total + '€';
    document.getElementById('coupon').textContent = order_info.coupon === 'Free Shipping' ? order_info.coupon: order_info.coupon + '€';
    document.getElementById('shipping').textContent = order_info.shipping + '€';
    document.getElementById('total_price').textContent = 'Total: ' + order_info.total_price + '€';
    document.getElementById('payment_method').textContent = order_info.payment_method;
    document.getElementById('receipt').textContent = order_info.receipt;
    document.getElementById('date').textContent = order_info.order_date;

    document.getElementById('status_image').src = '../../../assets/icons/status/' + order_info.status + '.svg';
    document.getElementById('status_text').textContent = '(' + order_info.status + ')';

}