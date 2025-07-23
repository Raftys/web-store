// ================================================================================================ //
// auth.js
// ================================================================================================ //
customInputCheck('.flex_container.column input');


// ================================================================================================ //
// Form Submit Handler
// ================================================================================================ //
document.getElementById('form_auth').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    const auth = new FormData(this);

    // If form has more than 2 entries, assume Signup process
    if (Array.from(auth.entries()).length > 2) {
        auth.append('action', 'signup');

        // Check if password and repeat password match
        if (auth.get('Password') !== auth.get('Repeat_Password')) {
            await showNotification("Passwords Must Match", "error");
            return; // Stop submission
        }

    } else {
        // Otherwise, assume Login process
        auth.append('action', 'login');
    }

    // Send form data to server-side script for authentication
    fetch('../../include/auth/auth.php', {
        method: 'POST',
        body: auth
    })
        .then(response => response.json())
        .then(async data => {
            if (data.status === 'error') {
                // Show error notification from server response
                await showNotification(data.message, 'error');
            } else if (data.status === 'success') {
                // Redirect on successful login/signup
                window.location.href = '/main.php';
            }
        });
});
