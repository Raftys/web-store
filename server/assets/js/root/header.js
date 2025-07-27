// Set up event listeners after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const profileBtn = document.getElementById('header_profile');
    const closeBtn = document.getElementById('header_x_button');
    const overlay = document.getElementById('overlay');

    if (profileBtn) {
        profileBtn.addEventListener('click', () => toggleProfilePanel('open'));
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => toggleProfilePanel('close'));
    }

    if (overlay) {
        overlay.addEventListener('click', () => toggleProfilePanel('close'));
    }
});


// Show or hide the profile panel and adjust UI accordingly
function toggleProfilePanel(value) {
    console.log("Hello");
    const panel = document.getElementById('header_account_panel');
    console.log(panel);
    let [add, remove] = value === 'open' ? ['open', 'close'] : ['close', 'open'];
    panel.classList.add(add);
    panel.classList.remove(remove);

    document.getElementById('overlay').style.display = (add === 'open' ? 'block' : 'none');

    if (add === 'open') {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }
}
