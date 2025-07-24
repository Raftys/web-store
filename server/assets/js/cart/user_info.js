let address = "#image_0";         // CSS selector of the currently selected address SVG icon
let addresses;                    // Array of all user's addresses fetched from server

// Fetch User Profile and Addresses
function getUserInfo() {
    fetch('../../../include/profile/fetch_user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
        .then(response => response.json())
        .then(async data => {
            if (data && Object.keys(data).length > 0) {
                // Fill user info
                document.getElementById('full_name').value = data.user?.full_name;
                document.getElementById('email').value = data.user?.email;
                document.getElementById('phone').value = data.user?.phone;
                toggleButtons();

                addresses = Array.isArray(data.address) ? data.address : [data.address];

                // Load address cards
                if (addresses?.length >0) {
                    await loadAddresses(addresses).catch(error =>
                        console.error("Error loading addresses:", error)
                    );
                    toggleButtons();
                }
            }
        })
        .catch(error => console.error("Error fetching addresses:", error));
}

// Load and Render Address Cards
async function loadAddresses(addresses) {

    const template = await loadHtmlComponent('../../components/built/address/address.html');

    // Clear existing addresses
    document.getElementById('addresses').innerHTML = '';

    addresses.forEach((item, i) => {
        const addressHTML = template.cloneNode(true);

        // Fill in address text
        addressHTML.querySelector('.text').textContent = `${item.address}, ${item.zip_code}, ${item.city}`;

        // Assign a unique ID to the SVG icon
        const iconId = 'image_' + i;
        addressHTML.querySelector('svg').id = iconId;

        // Add click handler for selecting this address
        addressHTML.querySelector('.address_click').addEventListener('click', () => {
            toggleChoice('#' + iconId);
        });

        // Add click handler for editing this address
        addressHTML.querySelector('.address_edit_click').addEventListener('click', (event) => {
            event.stopPropagation();
            openAddressForm(item);
        });

        // Append the address card to the container
        document.getElementById('addresses').append(addressHTML);

        // Auto-select first address by default
        if (i === 0) {
            addressHTML.querySelector('#' + iconId).setAttribute('fill', 'green');
            addressHTML.querySelector('#' + iconId).setAttribute('stroke', 'green');
        }
    });
}

// Select/Deselect an Address
function toggleChoice(newIcon) {
    // Deselect previous
    document.querySelector(address)?.setAttribute('fill', 'none');
    document.querySelector(address)?.setAttribute('stroke', 'currentColor');

    // Select new
    address = newIcon;
    document.querySelector(newIcon)?.setAttribute('fill', 'green');
    document.querySelector(newIcon)?.setAttribute('stroke', 'green');
}

// Open Address Form (New or Edit)
async function openAddressForm(address = null) {
    const form = await loadHtmlComponent("../../components/built/form/form.html");
    const isEdit = address !== null;

    // Remove required from optional box field
    form.querySelector('#form_item_5_input').removeAttribute('required');

    // Pre-fill form values if editing
    if (isEdit) {
        form.querySelector('#form_item_1_input').value = address?.address;
        form.querySelector('#form_item_2_input').value = address?.zip_code;
        form.querySelector('#form_item_3_input').value = address?.city;
        form.querySelector('#form_item_4_input').value = address?.country;
        form.querySelector('#form_item_5_input').value = address?.box_now || "";
    }

    // Set header message
    form.querySelector('#form_message').textContent = isEdit
        ? "Edit your Address"
        : "Add New Address";

    // Add back button handler to close form
    form.querySelector('#form_back_button').addEventListener('click', (event) => {
        event.preventDefault();
        form.remove();
    });

    // Append form to DOM
    document.body.append(form);

    // Apply custom input styling
    customInputCheck('.form input');

    // Form submission handler
    form.querySelector('.form').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Collect form input values
        const inputValues = {
            address: form.querySelector('#form_item_1_input').value.trim(),
            zip_code: form.querySelector('#form_item_2_input').value.trim(),
            city: form.querySelector('#form_item_3_input').value.trim(),
            country: form.querySelector('#form_item_4_input').value.trim(),
            box_now: form.querySelector('#form_item_5_input').value.trim() || null
        };

        let match = false;

        if (isEdit) {
            // Add ID for updating
            inputValues.id = address?.id;

            // Check if values actually changed
            match = (
                address?.address === inputValues.address &&
                address?.zip_code === inputValues.zip_code &&
                address?.city === inputValues.city &&
                address?.country === inputValues.country &&
                address?.box_now === inputValues.box_now
            );
        }

        if (!match) {
            await updateAddress(inputValues);
            await getUserInfo();  // Refresh addresses
        }

        // Close form
        form.remove();
    });
}
// Update Address Data to Server
async function updateAddress(address) {
    const formBody = Object.keys(address)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(address[key] ?? ''))
        .join('&');

    fetch('../../../include/profile/address.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody
    })
        .then(response => response.json())
        .catch(error => {
            console.error("Error updating address:", error);
        });
}


// INITIALIZATION
document.addEventListener('DOMContentLoaded', async function () {
    await getUserInfo();

});
