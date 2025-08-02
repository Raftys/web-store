// Trigger loading payment window on button click
document.getElementById('total_price_button').addEventListener('click', async () => {
    await loadPaymentWindow();
});

// Dynamically load and display payment options
async function loadPaymentWindow() {
    const payment = await loadHtmlComponent('../../components/built/form/payment.html');
    setPaymentMessage(payment, "IRIS", `<strong data-i18n='payment_phone'></strong> ${t('support_phone_1')}`);

    payment.querySelector('#payment_complete').disabled = true;
    payment.querySelector('#payment_total').innerHTML = `<strong data-i18n="total"></strong> ${parseFloat(document.getElementById('cart_total_price').textContent).toFixed(2)}`;

    // Close payment window
    payment.querySelector('.x_button').addEventListener('click', e => {
        e.stopPropagation();
        document.getElementById('payment_window').remove();
    });

    // Tab event listeners
    payment.querySelector('#tab1').addEventListener('click', e => {
        e.stopPropagation();
        setPaymentMessage(payment, "IRIS", `<strong data-i18n='payment_phone'></strong> ${t('support_phone_1')}`);
    });

    payment.querySelector('#tab2').addEventListener('click', e => {
        e.stopPropagation();
        setPaymentMessage(payment, "IBAN", `<strong data-i18n='bank_name'></strong> ${t('iban')}`);
    });

    payment.querySelector('#tab3').addEventListener('click', e => {
        e.stopPropagation();
        setPaymentMessage(payment, "VISA", "<strong data-i18n='coming_soon'</strong>");
    });

    // Enable submit only if receipt input is not empty
    payment.querySelector('#receipt').addEventListener('input', e => {
        e.stopPropagation();
        payment.querySelector('#payment_complete').disabled = e.target.value.trim() === '';
    });

    // Submit order
    payment.querySelector('#payment_complete').addEventListener('click', e => {
        e.stopPropagation();
        completeOrder();
    });

    document.body.append(payment);
}

// Update payment content based on tab selected
function setPaymentMessage(payment, title, message) {
    const isVisa = title === 'VISA';
    payment.querySelector('#payment_message').className = isVisa ? 'title' : 'text';
    payment.querySelector('.flex_input').style.display = isVisa ? 'none' : 'flex';
    payment.querySelector('#payment_total').style.display = isVisa ? 'none' : 'block';
    payment.querySelector('#payment_title').innerHTML = title;
    payment.querySelector('#payment_message').innerHTML = message;
}

// Submit order with form data and show notification
async function completeOrder() {
    const order_info = new FormData();

    // User info
    order_info.append('full_name', document.getElementById('full_name').value);
    order_info.append('email', document.getElementById('email').value);
    order_info.append('phone', document.getElementById('phone').value);

    // Address info
    const address_info = getSelectedAddress();
    if (document.getElementById('addresses')) {
        order_info.append('address_id', address_info);
    } else {
        order_info.append('address', address_info.address);
        order_info.append('zip_code', address_info.zip_code);
        order_info.append('city', address_info.city);
        order_info.append('country', address_info.country);
        order_info.append('box_now', address_info.box_now);
    }

    // Price info
    const extractNumber = id => document.getElementById(id).innerText.replace(/[^\d.,-]/g, '').trim();
    order_info.append('sub_total', extractNumber('cart_sub_total'));
    order_info.append('coupon', document.getElementById('cart_coupon').innerText.trim() === "Free Shipping"
        ? "Free Shipping"
        : extractNumber('cart_coupon'));
    order_info.append('shipping', extractNumber('shipping_fee'));
    order_info.append('total_price', extractNumber('cart_total_price'));

    // Payment info
    order_info.append('payment_method', getPaymentMethod());
    order_info.append('receipt', document.getElementById('receipt').value);

    // Send order to server
    fetch('include/orders/create_order.php', {
        method: 'POST',
        body: order_info
    })
        .then(response =>  response.json())
        .then (data => {
            resetCart();
            document.getElementById('payment_window').remove();
            window.location.href = `../../main.php?page=order_info&order_id=${data}&new=1`;
    })
        .catch(error => {
            alert("Error: " + error);
            console.error('Order submission failed:', error);
        });

    await showNotification(t('payment_complete'), "notification");
}

// Return selected payment method from tab
function getPaymentMethod() {
    const selectedTab = document.querySelector('.tab-container input[name="tab"]:checked');
    if (!selectedTab) return 'IRIS';
    switch (selectedTab.id) {
        case 'tab1': return 'IRIS';
        case 'tab2': return 'IBAN';
        case 'tab3': return 'VISA';
        default: return 'IRIS';
    }
}

// Get selected address (from dropdown or manual input)
function getSelectedAddress() {
    if (document.getElementById('addresses')) {
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
