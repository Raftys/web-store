// Global variables to store user info and addresses
let addresses;   // Array of all user's addresses fetched from the server
let full_name;   // User's full name
let email;       // User's email
let phone;       // User's phone number

// Initialize the page after DOM content is fully loaded
window.onload = async function () {
    const userData = await getUserInfo();
    await onFetch(userData);
};

// Process and display user data fetched from the server.
async function onFetch(data) {
    // Extract user information
    full_name = data.user.full_name;
    email = data.user.email;
    phone = data.user.phone;

    // Update corresponding elements with user info
    setElementValueOrContent('full_name', full_name);
    setElementValueOrContent('email', email);
    setElementValueOrContent('phone', phone);

    // Normalize addresses to always be an array
    addresses = Array.isArray(data.address) ? data.address : [data.address];

    // Load address cards if addresses exist
    if (addresses?.length > 0 && addresses[0] !== undefined) {
        await loadAddresses(addresses, 'profile');
    }

    // Update the state of the Save button based on changes
    toggleButton();
}

// Submit updated user information to the server.
function changeUserInfo() {
    const formData = new FormData();
    formData.append('full_name', document.getElementById('full_name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('phone', document.getElementById('phone').value);
    formData.append('action', 'update');

    fetch('../../../include/profile/profile.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(async () => {
            // After successful update, refresh user info on the page
            await showNotification('Successfully Changed User Info','success');
            await onFetch(await getUserInfo());
        })
        .catch(error => {
            console.error('Error updating user information:', error);
        });
}

// Enable or disable the Save button based on whether user info has changed.
function toggleButton() {
    // Get current input values
    const edit_full_name = document.getElementById('full_name').value;
    const edit_email = document.getElementById('email').value;
    const edit_phone = document.getElementById('phone').value;

    // Enable the Save button if any value differs from original
    const hasChanges = (full_name !== edit_full_name) || (email !== edit_email) || (phone !== edit_phone);
    document.getElementById('save').disabled = !hasChanges;
}
