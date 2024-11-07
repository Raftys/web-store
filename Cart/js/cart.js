document.addEventListener('DOMContentLoaded', function () {
    fetchCartItems();
    const button = document.getElementById('payment-button');
    button.disabled = true; // Disable button
    button.style.opacity = '0.5'; // Set button opacity to 0.5
    if(logged_in)
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
            if (data !== 'Error') {
                const cartItemsContainer = document.getElementById('cart-items');

                data.forEach(item => {
                    const row = document.createElement('tr');
                    const totalItemPrice = item.price * item.quantity;
                    totalPrice += totalItemPrice;
                    row.innerHTML = `
                        <td style="display: flex; align-items: center;">
                            <img src="${item.image}" alt="${item.name}" style="width:50px; height:auto; margin-right: 8px;">
                            <span style="color: ${item.offer !== 'null' ? 'red' : 'initial'}">${item.name}</span>
                        </td>
                        <td>${item.quantity}</td>
                        <td>€${item.price}</td>
                        <td>€${totalItemPrice}</td>
                    `;
                    cartItemsContainer.appendChild(row);
                });
                setPaymentValues(totalPrice);

                document.getElementById('total-price').innerText = `Σύνολο: €${totalPrice.toFixed(2)}`;
            }
        })
        .catch(error => console.error('Error fetching cart items:', error));
}

document.getElementById('clear_cart').addEventListener('click', function() {
    const totalOrderText = document.getElementById('total-order');
    totalOrderText.textContent = '0';
    window.location.href='../reset_cart.php'
});
