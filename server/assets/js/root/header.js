// Set up event listeners after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve key UI elements
    const profileBtn = document.getElementById('header_profile');     // Profile button (to open panel)
    const closeBtn = document.getElementById('header_x_button');      // Close button inside panel
    const overlay = document.getElementById('overlay');               // Background overlay element

    // Attach event listener to open the profile panel
    if (profileBtn) {
        profileBtn.addEventListener('click', () => toggleProfilePanel('open'));
    }

    // Attach event listener to close the profile panel (via close button)
    if (closeBtn) {
        closeBtn.addEventListener('click', () => toggleProfilePanel('close'));
    }

    // Attach event listener to close the profile panel when clicking on overlay
    if (overlay) {
        overlay.addEventListener('click', () => toggleProfilePanel('close'));
    }
});

/**
 * Toggles the visibility of the profile panel and updates UI state.
 *
 * @param {string} value - Accepts 'open' or 'close' to control the panel state.
 */
function toggleProfilePanel(value) {
    const panel = document.getElementById('header_account_panel');  // Profile slide panel
    let [add, remove] = value === 'open' ? ['open', 'close'] : ['close', 'open'];

    // Apply the appropriate CSS classes for opening or closing the panel
    panel.classList.add(add);
    panel.classList.remove(remove);

    // Show or hide the overlay based on the panel state
    document.getElementById('overlay').style.display = (add === 'open' ? 'block' : 'none');

    // Enable or disable page scroll depending on the panel state
    if (add === 'open') {
        document.body.classList.add('no-scroll');   // Prevent scrolling when panel is open
    } else {
        document.body.classList.remove('no-scroll'); // Restore scrolling when panel is closed
    }
}
