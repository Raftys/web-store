document.addEventListener('DOMContentLoaded', function () {
    fetchCartItems();
});

function fetchCartItems() {
    fetch('cart.php')
        .then(response => response.json())
        .then(data => {
            if (data && data.items) {
                const cartItemsContainer = document.getElementById('cart-items');
                let totalPrice = 0;

                data.items.forEach(item => {
                    const row = document.createElement('tr');
                    const totalItemPrice = item.price * item.quantity;
                    totalPrice += totalItemPrice;

                    row.innerHTML = `
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>€${item.price.toFixed(2)}</td>
                        <td>€${totalItemPrice.toFixed(2)}</td>
                    `;
                    cartItemsContainer.appendChild(row);
                });

                document.getElementById('total-price').innerText = `Total Price: €${totalPrice.toFixed(2)}`;
            }
        })
        .catch(error => console.error('Error fetching cart items:', error));
}

document.getElementById('payment-button').addEventListener('click', function () {
    window.location.href = 'payment.html'; // Change to your payment page URL
});
