document.addEventListener('DOMContentLoaded', function () {
    fetchCartItems();
    const button = document.getElementById('payment-button');
    button.disabled = true; // Disable button
    button.style.opacity = 0.5; // Set button opacity to 0.5
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

                document.getElementById('total-price').innerText = `Σύνολο: €${totalPrice.toFixed(2)}`;
        })
        .catch(error => console.error('Error fetching cart items:', error));
}

document.getElementById('payment-button').addEventListener('click', function () {
    //window.location.href = 'payment.html'; // Change to your payment page URL
    const order_data = new FormData();
    let price = document.getElementById('total-price').value;
    order_data.append('total',totalPrice);
    fetch('Cart/create_order.php', { // Make sure the path is correct relative to product.html
        method: 'POST',
        body: order_data // No need to set Content-Type; FormData takes care of that
    })
        .then(response => {
            // Check if the response i  s OK
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Assuming your PHP script returns JSON
        })
        .then(data => {
            alert(data['id']);
        })
        .catch(error => {
            alert("Error"+error);
            console.error('Error fetching cart items:', error)
        });
});
