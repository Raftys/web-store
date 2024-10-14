// signup.js

// Simulated Google Login

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(this);

    // Use fetch to send a POST request
    fetch(this.action, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            if (data.status === 'error') {
                // Show alert if there's an error
                showNotification(data.message,"alert");
            } else {
                // Handle successful login if needed
                window.location.href = '/main.php'; // Redirect on success
            }
        })
        .catch(error => console.error('Error:', error));
});

// Get form elements
const form = document.getElementById('signup-form');
const inputs = form.querySelectorAll('input[required]');
const boxNowInput = form.querySelector('input[name="box_now"]');
const registerButton = form.querySelector('button[type="submit"]');

// Function to check if all required inputs (except Box Now) are filled
function checkFormValidity() {
    let allValid = true;

    inputs.forEach(input => {
        if (input !== boxNowInput && input.value.trim() === '') {
            allValid = false;
        }
    });

    // Enable or disable the button based on input values
    registerButton.disabled = !allValid;
}

// Add event listeners to all required inputs (except Box Now)
inputs.forEach(input => {
    input.addEventListener('input', checkFormValidity);
});

// Disable the register button initially
registerButton.disabled = true;

// Simulated form submission
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(this);

    // Use fetch to send a POST request
    fetch(this.action, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            if (data.status === 'error') {
                // Show alert if there's an error
                showNotification(data.message, "alert");
            } else {
                // Handle successful account creation
                window.location.href = '/main.php'; // Redirect on success
            }
        })
        .catch(error => console.error('Error:', error));
});
