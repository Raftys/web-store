document.addEventListener('DOMContentLoaded', function () {
    fetchCartItems();
    const button = document.getElementById('payment-button');
    button.disabled = true; // Disable button
    button.style.opacity = '0.5'; // Set button opacity to 0.5
    get_info().then(()=> {
        if ( document.getElementById('total-price').innerText.replace(/[^0-9.-]+/g, '') > 0 )
            checkInputs();
    });
});
let totalPrice = 0;
function fetchCartItems() {
    fetch('Cart/fetch_cart.php')
        .then(response => response.json())
        .then(data => {
                const cartItemsContainer = document.getElementById('cart-items');

                data.forEach(item => {
                    const row = document.createElement('tr');
                    const totalItemPrice = item.price * item.quantity;
                    totalPrice += totalItemPrice;

                    row.innerHTML = `
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>€${item.price}</td>
                        <td>€${totalItemPrice}</td>
                    `;
                    cartItemsContainer.appendChild(row);
                });
                setPaymentValues(totalPrice);

                document.getElementById('total-price').innerText = `Σύνολο: €${totalPrice.toFixed(2)}`;
        })
        .catch(error => console.error('Error fetching cart items:', error));
}

function reset_cart() {
    const totalOrderText = document.getElementById('total-order');
    totalOrderText.textContent = '0';
    window.location.href='../reset_cart.php'
}