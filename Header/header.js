// header.js

document.addEventListener('DOMContentLoaded', function () {
    const userMenuContainer = document.querySelector('.user-menu-container');
    const userDropdownMenu = document.querySelector('.user-dropdown-menu');
    let hideDropdownTimeout;

    // Check if both elements exist
    if (userMenuContainer && userDropdownMenu) {
        // Show dropdown when mouse enters the container
        userMenuContainer.addEventListener('mouseenter', function () {
            clearTimeout(hideDropdownTimeout); // Clear any previous hide timeouts
            userDropdownMenu.style.display = 'block'; // Show dropdown
        });

        // Hide dropdown when mouse leaves the container
        userMenuContainer.addEventListener('mouseleave', function () {
            hideDropdownTimeout = setTimeout(function () {
                userDropdownMenu.style.display = 'none'; // Hide dropdown after delay
            }, 500); // Delay of 500 milliseconds
        });

        // Keep dropdown open when mouse enters the dropdown
        userDropdownMenu.addEventListener('mouseenter', function () {
            clearTimeout(hideDropdownTimeout); // Keep it open if hovering over the dropdown
        });

        // Hide dropdown when mouse leaves the dropdown
        userDropdownMenu.addEventListener('mouseleave', function () {
            hideDropdownTimeout = setTimeout(function () {
                userDropdownMenu.style.display = 'none'; // Hide dropdown after delay
            }, 500); // Delay of 500 milliseconds
        });
    } else {
    }
});

// Function to handle log off
function logoff() {
    window.location.href = '../start.php'; // Redirect to log off page
}
