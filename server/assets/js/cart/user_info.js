// Currently selected address SVG icon (defaults to first address)
let address = "#image_0";

// Stores user address data from the server
let addresses = [];

// Initialize user profile and addresses on DOM load
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const userData = await getUserInfo();
        if (userData) {
            await onFetch(userData);
        }
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Populate user profile fields and load address cards into the DOM
async function onFetch(data) {
    // Fill in user profile form fields (or leave blank if missing)
    document.getElementById('full_name').value = data.user?.full_name ?? '';
    document.getElementById('email').value = data.user?.email ?? '';
    document.getElementById('phone').value = data.user?.phone ?? '';

    // Convert address to array if it's a single object or null
    addresses = Array.isArray(data.address)
        ? data.address
        : data.address
            ? [data.address]
            : [];

    // Load address components and enable actions if addresses exist
    if (addresses.length > 0 && addresses[0] !== undefined) {
        await loadAddresses(addresses);
        toggleButtons(); // Enable form buttons if valid
    }
}

// Handle selecting a new address by updating icon fill and stroke
function toggleChoice(newIconSelector) {
    // Reset previous selected icon
    const previousIcon = document.querySelector(address);
    if (previousIcon) {
        previousIcon.setAttribute('fill', 'none');
        previousIcon.setAttribute('stroke', 'currentColor');
    }

    // Update the selected icon reference
    address = newIconSelector;

    // Highlight new icon in green
    const newIcon = document.querySelector(newIconSelector);
    if (newIcon) {
        newIcon.setAttribute('fill', 'green');
        newIcon.setAttribute('stroke', 'green');
    }
}
