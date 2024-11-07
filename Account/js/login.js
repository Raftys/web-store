// login.js

// Simulated Google Login
document.getElementById('google-login').addEventListener('click', function() {
    // You would implement Google Login integration here
    alert('Google Login functionality not implemented.');
});

// Handle "Forgot Password?"
/*document.getElementById('forgot-password').addEventListener('click', function() {
    const email = prompt('Please enter your email to receive a password reset link:');
    if (email) {
        alert('Password reset link sent to ' + email);
        // Implement the logic to send the email with a 6-digit code
    }
});*/

document.getElementById('login-form').addEventListener('submit', function(event) {
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
                setLogged_in(1);
                window.location.href = '/main.php'; // Redirect on success
            }
        })
        .catch(error => console.error('Error:', error));
});