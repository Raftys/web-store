
function setPaymentValues(totalPrice) {
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const selectedMethodText = document.getElementById('selected-method');
    const totalOrderText = document.getElementById('total-order');
    const deliveryFeeText = document.getElementById('delivery-fee');
    const paymentFeeText = document.getElementById('payment-fee');
    const finalAmountText = document.getElementById('final-amount');

    // Assuming a default delivery fee
    const deliveryFee = 5.00; // Example delivery fee

    // Fetch order total and handle it asynchronously
    const orderTotal = totalPrice// Await the result from totalAmount()

    // Payment method fees
    const paymentFees = {
        bank: 0.00,       // No fee for bank deposit
        iris: 1.00,       // Example fee for IRIS
        'credit-card': 2.50 // Example fee for credit card
    };

    // Function to update payment details
    function updatePaymentDetails(method) {
        selectedMethodText.textContent = method === 'bank' ? 'Κατάθεση σε Τράπεζα' :
            method === 'iris' ? 'IRIS' : 'Πιστωτική Κάρτα';

        const paymentFee = paymentFees[method];
        const finalAmount = orderTotal + deliveryFee + paymentFee;

        totalOrderText.textContent = `€${orderTotal.toFixed(2)}`;
        deliveryFeeText.textContent = `€${deliveryFee.toFixed(2)}`;
        paymentFeeText.textContent = `€${paymentFee.toFixed(2)}`;
        finalAmountText.textContent = `€${finalAmount.toFixed(2)}`;
    }

    // Initialize with the default payment method (bank deposit)
    updatePaymentDetails('bank');

    // Add event listeners to the radio buttons
    paymentMethods.forEach((method) => {
        method.addEventListener('change', (event) => {
            updatePaymentDetails(event.target.value);
        });
    });

}

function getSelectedPaymentMethod() {
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    let selectedMethod = null;
    paymentMethods.forEach(radio => {
        if (radio.checked) {
            selectedMethod = radio.value;
        }
    });
    return selectedMethod;
}