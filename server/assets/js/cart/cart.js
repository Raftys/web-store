// Cart pricing variables
let sub_total = 0;
let coupon = 0;
let shipping = 1;

// Initialize cart and coupon logic on page load
document.addEventListener('DOMContentLoaded', function () {
    fetchCartItems();
    setPaymentMoney();
    applyCoupon();
});

// Handle Clear Cart button click
document.getElementById('clear_cart').addEventListener('click', resetCart);

// Fetch and render items in cart
function fetchCartItems() {
    const formData = new FormData();
    formData.append('action', 'fetch');

    fetch('../../include/cart/cart.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(async data => {
            const itemList = document.getElementById('cart_products');
            itemList.innerHTML = '';

            if (data !== 'Error' && data.length > 0) {
                document.getElementById('clear_cart').style.display = 'block';
                const productTemplate = await loadHtmlComponent('../../components/built/card/product.html');

                data.forEach(item => {
                    const card = productTemplate.cloneNode(true);
                    card.setAttribute('id', item.id);
                    card.querySelector('#product_image').src = item.image;
                    card.querySelector('#product_name').textContent = item.name;
                    card.querySelector('#quantity').textContent = item.quantity;
                    card.querySelector('#product_price').textContent = t('total') + (item.price * item.quantity).toFixed(2) + '€';
                    card.querySelector('#product_price_per_item').textContent = t('per_item') + parseFloat(item.price).toFixed(2) + '€';
                    card.querySelector('#add-text').remove();
                    card.querySelector('.product_quantity').style.justifyContent = 'center'

                    // Handle quantity decrease
                    card.querySelector('.decrease_button').addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const btn = card.querySelector('.decrease_button');
                        btn.disabled = true;

                        decrementQuantity(card, item);
                        item.quantity -= 1;
                        const request = structuredClone(item);
                        request.quantity = -1;
                        await addItem(request);

                        sub_total += request.quantity * request.price;
                        setPaymentMoney();

                        if (item.quantity === 0) fetchCartItems();
                        btn.disabled = false;
                    });

                    // Handle quantity increase
                    card.querySelector('.increase_button').addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const btn = card.querySelector('.increase_button');
                        btn.disabled = true;

                        incrementQuantity(card, item);
                        item.quantity += 1;
                        const request = structuredClone(item);
                        request.quantity = 1;
                        await addItem(request);

                        sub_total += request.quantity * request.price;
                        setPaymentMoney();
                        btn.disabled = false;
                    });

                    sub_total += item.price * item.quantity;
                    itemList.appendChild(card);
                });

                setPaymentMoney();
            } else {
                document.getElementById('clear_cart').style.display = 'none';
                itemList.innerHTML = "<p class='big_text' data-i18n='empty_cart'></p>";
            }
        })
        .catch(err => console.error('Error fetching cart items:', err));
}

// Apply a coupon from form
function applyCoupon() {
    customInputCheck('.coupon_form input');

    document.getElementById('coupon_form').addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('coupon_text').value;
        const formData = new FormData();
        formData.append('action', 'apply_coupon');
        formData.append('coupon', code);

        fetch('../../include/cart/cart.php', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(async data => {
                if (data.info === 'no coupon') {
                    await showNotification(t('no_coupon'), 'error');
                    return;
                }

                if (data.info.type === 'money') {
                    coupon = data.info.value;
                } else if (data.info.type === 'percentage') {
                    coupon = (sub_total + shipping) * (data.info.value / 100);
                } else if (data.info.type === 'shipping') {
                    coupon = 'Free Shipping';
                }

                setPaymentMoney();
            })
            .catch(err => {
                console.error('Fetch error:', err);
                document.getElementById('coupon_result').textContent = 'Error applying coupon';
            });
    });
}

// Update totals and payment UI
function setPaymentMoney() {
    toggleButtons();
    document.getElementById('cart_sub_total').innerText = sub_total.toFixed(2) + '€';

    if (coupon === 'Free Shipping') {
        document.getElementById('cart_coupon').innerText = coupon;
        document.getElementById('shipping_fee').innerText = '+ 0€';
        document.getElementById('cart_total_price').innerText = sub_total.toFixed(2) + '€';
    } else {
        const total = Math.max(sub_total - coupon + shipping, 0).toFixed(2);
        document.getElementById('cart_coupon').innerText = `- ${coupon.toFixed(2)}€`;
        document.getElementById('shipping_fee').innerText = `+ ${shipping.toFixed(2)}€`;
        document.getElementById('cart_total_price').innerText = total + '€';
    }
}

// Enable/disable buttons based on form/cart state
function toggleButtons() {
    const cart = document.getElementById('cart_products');
    const full_name = document.getElementById('full_name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    let addressValid;
    const addresses = document.getElementById('addresses');
    if (addresses !== null) {
        addressValid = addresses.children.length > 0;
    } else {
        const fields = ['address', 'zip_code', 'city', 'country'];
        addressValid = fields.every(id => {
            const el = document.getElementById(id);
            return el && el.value.trim() !== '';
        });
    }

    const cartEmpty = cart.children.length === 0 || cart.children[0]?.innerHTML === "Empty Cart";
    const disable = cartEmpty || !addressValid || !full_name || !email || !phone;

    document.getElementById('coupon_apply_button').disabled = cartEmpty;
    document.getElementById('total_price_button').disabled = disable;
}

// Clear cart contents both UI and backend
function resetCart() {
    document.getElementById("cart_products").innerHTML = "<p class='big_text'>Empty Cart</p>";
    document.getElementById('clear_cart').style.display = 'none';
    document.getElementById('cart_label').innerText = `(0)`;

    const formData = new FormData();
    formData.append('action', 'reset');

    fetch('../../include/cart/cart.php', {
        method: 'POST',
        body: formData
    }).then(() => {
        sub_total = 0;
        coupon = 0;
        setPaymentMoney();
    });
}