document.getElementById('total_price_button').addEventListener('click', () => {
    loadPaymentWindow().then(r => console.log("Opened"));
})


async function loadPaymentWindow() {
    const payment = await loadHtmlComponent('../../components/built/form/payment.html');

    setPaymentMessage(payment,"IRIS", "<strong>Τηλέφωνο:</strong> 6945793397");

    payment.querySelector('#payment_complete').disabled = true;

    payment.querySelector('#payment_total').innerHTML = '<strong>Total Price:</strong> ' + parseFloat(document.getElementById('cart_total_price').textContent).toFixed(2) + '€';

    payment.querySelector('.x_button').addEventListener('click', () => {
        event.stopPropagation();
        document.getElementById('payment_window').remove();
    })

    payment.querySelector('#tab1').addEventListener('click', () => {
        event.stopPropagation();
        setPaymentMessage(payment,"IRIS", "<strong>Τηλέφωνο:</strong> 6945793397");
    })

    payment.querySelector('#tab2').addEventListener('click', () => {
        event.stopPropagation();
        setPaymentMessage(payment,"IBAN", "<strong>Τράπεζα Πειραιώς:</strong> GR 290172 2490 0052 4909 3136868");
    })

    payment.querySelector('#tab3').addEventListener('click', () => {
        event.stopPropagation();
        setPaymentMessage(payment,"VISA", "<strong> Coming soon!</strong> ");
    })

    payment.querySelector('#receipt').addEventListener('input', () => {
        event.stopPropagation();
        payment.querySelector('#payment_complete').disabled = payment.querySelector('#receipt').value.trim() === '';
    })

    payment.querySelector('#payment_complete').addEventListener('click', () => {
        event.stopPropagation();
        completeOrder()
    })

    document.body.append(payment)
}

function setPaymentMessage(payment, title, message) {
    if (title === 'VISA') {
        payment.querySelector('#payment_message').className='title';
        payment.querySelector('.flex_input').style.display = 'none';
        payment.querySelector('#payment_total').style.display = 'none';
    } else {
        payment.querySelector('#payment_message').className='text';
        payment.querySelector('.flex_input').style.display = 'flex';
        payment.querySelector('#payment_total').style.display = 'block';
    }
    payment.querySelector('#payment_title').innerHTML = title;
    payment.querySelector('#payment_message').innerHTML = message;
}

async function completeOrder() {
    const order_info = new FormData();
    // User info
    order_info.append('full_name', document.getElementById('full_name').value);
    order_info.append('email', document.getElementById('email').value);
    order_info.append('phone', document.getElementById('phone').value);

    // Address info
    const address_info = getSelectedAddress();
    console.log(address_info);
    if (document.getElementById('addresses') !== null) {
        order_info.append('address_id', address_info);
    } else {
        order_info.append('address', address_info.address);
        order_info.append('zip_code', address_info.zip_code);
        order_info.append('city', address_info.city);
        order_info.append('country', address_info.country);
        order_info.append('box_now', address_info.box_now);
    }

    // Price info
    order_info.append('sub_total', document.getElementById('cart_sub_total').innerText.replace(/[^\d.,-]/g, '').trim());
    order_info.append('coupon', document.getElementById('cart_coupon').innerText.replace(/[^\d.,-]/g, '').trim());
    order_info.append('shipping', document.getElementById('shipping_fee').innerText.replace(/[^\d.,-]/g, '').trim());
    order_info.append('total_price', document.getElementById('cart_total_price').innerText.replace(/[^\d.,-]/g, '').trim());
    coupon = document.getElementById('cart_coupon').innerText.trim();
    order_info.append('coupon', coupon === "Free Shipping" ? "Free Shipping" : coupon.replace(/[^\d.,-]/g, ''));
    // Payment Info
    order_info.append('payment_method', getPaymentMethod());
    order_info.append('receipt', document.getElementById('receipt').value);

    fetch('include/orders/create_order.php', { // Make sure the path is correct relative to product.html
        method: 'POST',
        body: order_info // No need to set Content-Type; FormData takes care of that
    })
        .then(response => {
            // Check if the response i  s OK
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            if(response.ok) {
                //resetCart();
                //document.getElementById('payment_window').remove();
                //window.location.href = '../../main.php';
                console.log("HelloWorld");
            }
        })
        .catch(error => {
            alert("Error" + error);
            console.error('Error fetching cart items:', error)
        });
    await showNotification("Η παραγγελία υποβλήθηκε!", "notification");

}

// Find the checked radio input
function getPaymentMethod() {
    const selectedTab = document.querySelector('.tab-container input[name="tab"]:checked');

    if (selectedTab) {

        // Optional: act on the selected tab
        switch (selectedTab.id) {
            case 'tab1':
                return 'IRIS'
            case 'tab2':
                return 'IBAN';
            case 'tab3':
                return 'VISA';
        }
    }
    return 'IRIS';
}

function getSelectedAddress() {
    if (document.getElementById('addresses') !== null) {
        return addresses[address.replace(/\D/g, '')].id;
    }
    return {
        address: document.getElementById('address')?.value.trim() || '',
        zip_code: document.getElementById('zip_code')?.value.trim() || '',
        city: document.getElementById('city')?.value.trim() || '',
        country: document.getElementById('country')?.value.trim() || '',
        box_now: document.getElementById('box_now')?.value.trim() || '',
    };
}
