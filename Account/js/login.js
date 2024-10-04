// login.js

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    // Gather input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // For demonstration purposes, log the values (you can replace this with an API call)
    console.log('Login Attempt:', { email, password });

    // Clear form after submission
    document.getElementById('login-form').reset();
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
