document.addEventListener('DOMContentLoaded', function () {
    fetchCartItems();
    const button = document.getElementById('payment-button');
    button.disabled = true; // Disable button
    button.style.opacity = 0.5; // Set button opacity to 0.5
});

function fetchCartItems() {
    fetch('Cart/fetch_cart.php')
        .then(response => response.json())
        .then(data => {
                const cartItemsContainer = document.getElementById('cart-items');
                let totalPrice = 0;

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

                document.getElementById('total-price').innerText = `Σύνολο: €${totalPrice.toFixed(2)}`;
        })
        .catch(error => console.error('Error fetching cart items:', error));
}

document.getElementById('payment-button').addEventListener('click', function () {
    window.location.href = 'payment.html'; // Change to your payment page URL
});
