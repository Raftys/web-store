// Run after the page fully loads
document.addEventListener('DOMContentLoaded', () => {
    fetchCartItems();
});

let sub_total = 0 ;
let coupon = 0 ;
let shipping = 1;

// Clear Cart Button Handler
document.getElementById('clear_cart').addEventListener('click', () => {
    resetCart();
});

// Fetch and Render Cart Items
function fetchCartItems() {
    fetch('../../include/cart/fetch_cart.php')
        .then(response => response.json())
        .then(async data => {
            // If cart has items
            if (data !== 'Error' && data.length > 0) {
                // Show the "Clear Cart" button
                document.getElementById('clear_cart').style.display = 'block';

                // Load the reusable product card template
                const productTemplate = await loadHtmlComponent('../../components/built/product/product.html');
                const itemList = document.getElementById('cart_products');

                // Clear existing cart items
                itemList.innerHTML = '';

                // Add each item to the cart
                data.forEach(item => {
                    const productCard = productTemplate.cloneNode(true);

                    // Set unique ID for the card
                    productCard.setAttribute('id', item.id);

                    // Populate product details
                    productCard.querySelector('#product_image').src = item.image;
                    productCard.querySelector('#product_name').textContent = item.name;
                    productCard.querySelector('#quantity').textContent = item.quantity;
                    productCard.querySelector('#product_price').textContent = 'Total: ' + (item.price * item.quantity) + '€';
                    productCard.querySelector('#product_price_per_item').textContent = 'Per Item: ' + item.price + '€';

                    // Handle quantity decrease
                    productCard.querySelector('.decrease_button').addEventListener('click', async (event) => {
                        event.stopPropagation();
                        productCard.querySelector('.decrease_button').disabled = true;
                        decrementQuantity(productCard, item);
                        item.quantity -= 1;
                        let request_item = structuredClone(item);
                        request_item.quantity = -1;
                        await addItem(request_item);
                        sub_total += request_item.quantity * request_item.price;
                        setPaymentMoney();
                        if (item.quantity === 0) {
                            fetchCartItems();
                        }
                        productCard.querySelector('.decrease_button').disabled = false;
                    });

                    // Handle quantity increase
                    productCard.querySelector('.increase_button').addEventListener('click', async (event) => {
                        event.stopPropagation();
                        productCard.querySelector('.increase_button').disabled = true;
                        incrementQuantity(productCard, item);
                        item.quantity += 1;
                        let request_item = structuredClone(item);
                        request_item.quantity = +1;
                        await addItem(request_item);
                        sub_total += request_item.quantity * request_item.price;
                        setPaymentMoney();
                        productCard.querySelector('.increase_button').disabled = false;
                    });

                    sub_total+= item.price * item.quantity;

                    // Add the card to the DOM
                    itemList.appendChild(productCard);
                });
                setPaymentMoney();

            } else {
                // If no items, show "Empty Cart" message
                document.getElementById('clear_cart').style.display = 'none';
                document.getElementById("cart_products").innerHTML = "<p class='big_text'>Empty Cart</p>";
            }
        })
        .catch(error => console.error('Error fetching cart items:', error));
}

function applyCoupon() {
    customInputCheck('.coupon_form input');

    document.getElementById('coupon_form').addEventListener('submit', (event) => {
        event.preventDefault();

        const coupon_value = document.getElementById('coupon_text').value;

        const formData = new FormData();
        formData.append('coupon', coupon_value);

        fetch('../../include/cart/apply_coupon.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())  // <-- parse the JSON
            .then(async data => {
                if (data.info === 'no coupon') {
                    await showNotification('No coupon Found', 'error')
                    return;
                }  else if (data.info.type === 'money') {
                    coupon = data.info.value;
                } else if (data.info.type === 'percentage') {
                    coupon = (sub_total + shipping) * (data.info.value / 100);
                } else if (data.info.type === 'shipping') {
                    coupon = 'Free Shipping';
                }
                setPaymentMoney();

            })
            .catch(error => {
                console.error('Fetch error:', error);
                document.getElementById('coupon_result').textContent =
                    'Error applying coupon';
            });
    });
}

function setPaymentMoney() {
    let sum;
    toggleButtons();

    document.getElementById('cart_sub_total').innerText = parseFloat(sub_total).toFixed(2) + '€';
    if (coupon === 'Free Shipping') {
        document.getElementById('cart_coupon').innerText = coupon;
        document.getElementById('shipping_fee').innerText = '+ ' + 0 + '€';
        sum = parseFloat(sub_total).toFixed(2);
    } else {
        document.getElementById('cart_coupon').innerText = '- ' + parseFloat(coupon).toFixed(2) + '€';
        document.getElementById('shipping_fee').innerText = '+ ' + parseFloat(shipping).toFixed(2) + '€';
        sum = (parseFloat(sub_total) - parseFloat(coupon) + parseFloat(shipping)).toFixed(2);
    }
    sum = sum > 0 ? sum : 0;
    document.getElementById('cart_total_price').innerText = sum  + '€';
}

function toggleButtons() {
    const cart = document.getElementById('cart_products');

    const full_name = document.getElementById('full_name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    let address;
    if (document.getElementById('addresses') !== null) {
        address = document.getElementById('addresses');
        address = address.children.length <= 0;
    } else {
        let counter = 0;
        const fields = ['address', 'zip_code', 'city', 'country'];
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.value.trim() !== '') {
                counter++;
            }
        });
        address = counter <= 3;
    }


    const cart_empty = cart.children.length <= 0 || cart.children[0] === undefined || cart.children[0].innerHTML === "Empty Cart";

    document.getElementById('coupon_apply_button').disabled = cart_empty;
    document.getElementById('total_price_button').disabled = cart_empty || address|| full_name === '' || email === '' || phone === '';
}

function resetCart() {
    // Empty the cart display
    document.getElementById("cart_products").innerHTML = "<p class='big_text'>Empty Cart</p>";

    // Hide the clear button and reset the label count
    document.getElementById('clear_cart').style.display = 'none';
    document.getElementById('cart_label').innerText = `(0)`;

    // Call server endpoint to reset the cart
    fetch('../../include/cart/reset_cart.php', {
        method: 'GET',
    }).then(response => {
        sub_total = 0;
        coupon = 0;
        setPaymentMoney();
    });
}

setPaymentMoney();
applyCoupon();