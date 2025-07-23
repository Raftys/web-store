// ================================================================================================ //
// header.js
// ================================================================================================ //

// Wait until the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function () {

    // ================================================================================================ //
    // Profile Panel Functions
    // ================================================================================================ //

    // Open the profile panel when clicking the profile button in the header
    document.getElementById('header_profile').addEventListener('click', () => {
        toggleProfilePanel('open');
    });

    // Close the profile panel when clicking the "X" button inside the panel
    document.getElementById('header_x_button').addEventListener('click', () => {
        toggleProfilePanel('close');
    });

    // Close the profile panel when clicking on the background overlay
    document.getElementById('overlay').addEventListener('click', () => {
        toggleProfilePanel('close');
    });

    // ================================================================================================ //

});


// ================================================================================================ //
// toggleProfilePanel
// Shows or hides the profile panel by toggling CSS classes
// Also shows/hides the overlay and disables/enables body scroll
// ================================================================================================ //
function toggleProfilePanel(value) {
    const panel = document.getElementById('header_account_panel');

    // Determine which classes to add and remove based on 'open' or 'close' argument
    let [add, remove] = value === 'open' ? ['open', 'close'] : ['close', 'open'];
    panel.classList.add(add);
    panel.classList.remove(remove);

    // Show or hide the semi-transparent overlay behind the panel
    document.getElementById('overlay').style.display = (add === 'open' ? 'block' : 'none');

    // Prevent or allow page scrolling when the panel is open
    if (add === 'open') {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }
}
