// signup.js

document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    // Gather input values
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const zipCode = document.getElementById('zip-code').value;
    const country = document.getElementById('country').value;
    const password = document.getElementById('password').value;

    // For demonstration purposes, log the values (you can replace this with an API call)
    console.log('Account Created:', { fullName, email, phone, address, city, zipCode, country, password });

    // Clear form after submission
    document.getElementById('signup-form').reset();
});

// Simulated Google Login
document.getElementById('google-login').addEventListener('click', function() {
    // You would implement Google Login integration here
    alert('Google Login functionality not implemented.');
});

// Handle "Forgot Password?"
document.getElementById('forgot-password').addEventListener('click', function() {
    const email = prompt('Please enter your email to receive a password reset link:');
    if (email) {
        alert('Password reset link sent to ' + email);
        // Implement the logic to send the email with a 6-digit code
    }
});
