document.getElementById('payment-button').addEventListener('click', function () {
    openModal(getSelectedPaymentMethod());
    const receiptInput = document.getElementById("receipt");
    if(receiptInput)
        receiptInput.addEventListener('input', checkReceiptInput);
});


function completePayment() {
    const order_data = new FormData();
    const finalAmount = document.getElementById('final-amount').innerText.replace(/[^0-9.-]+/g, '');
    order_data.append('total',finalAmount);
    const full_name = document.getElementById('full_name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const zip_code = document.getElementById('zip_code').value;
    const country = document.getElementById('country').value;
    order_data.append('full_name',full_name);
    order_data.append('email',email);
    order_data.append('phone',phone);
    order_data.append('address',address);
    order_data.append('city',city);
    order_data.append('zip_code',zip_code);
    order_data.append('country',country);

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
        .then(() => {
        })
        .catch(error => {
            alert("Error"+error);
            console.error('Error fetching cart items:', error)
        });
    const receipt = document.getElementById("receipt").value;
    if (receipt) {
        modal.style.display = "none";  // Close the modal
        showNotification("Η παραγγελία υποβλήθηκε!");
        setTimeout(() => {
            //window.location.href = '../reset_cart.php';
        }, 4010);
    } else {
        alert("Please enter a payment receipt number.");
    }
}