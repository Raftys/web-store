const nameInput = document.getElementById('full-name');

const submitButton = document.getElementById('payment-button');

// Function to check if all inputs are filled
function checkInputs() {
    // Check if all input fields have values
    if (nameInput.value) {
        submitButton.disabled = false; // Enable button
        submitButton.style.opacity = 1; // Set button opacity to 1
    } else {
        submitButton.disabled = true; // Disable button
        submitButton.style.opacity = 0.5; // Set button opacity to 0.5
    }
}

// Event listeners to check inputs on keyup
nameInput.addEventListener('keyup', checkInputs);