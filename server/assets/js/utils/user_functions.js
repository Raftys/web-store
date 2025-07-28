// Fetches user information (addresses) from the server
function getUserInfo(data = null) {
    let formData = new FormData();
    if (data == null) {
        formData.append('action', 'fetch_all');
    } else {
        formData = data;
    }

    return fetch('../../../include/profile/profile.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data && Object.keys(data).length > 0) {
                return data;
            }
            return null;
        })
        .catch(error => {
            console.error("Error fetching addresses:", error);
            return null;
        });
}

// Loads and renders address cards into the DOM
async function loadAddresses(addresses, type = 'cart') {
    // Load address card template asynchronously
    const template = await loadHtmlComponent('../../components/built/address/address.html');

    // Clear existing address cards container
    const container = document.getElementById('addresses');
    container.innerHTML = '';

    addresses.forEach((item, index) => {
        // Clone the template for each address
        const addressHTML = template.cloneNode(true);

        // Fill address details text
        addressHTML.querySelector('.text').textContent = `${item.address}, ${item.zip_code}, ${item.city}`;

        // Attach click event to edit button/link to open edit form
        addressHTML.querySelector('.address_edit_click').addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent event bubbling
            openAddressForm(item);
        });

        if (type === 'profile') {
            // Remove SVG icon for profile view
            const svgElement = addressHTML.querySelector('svg');
            if (svgElement) svgElement.remove();
        } else {
            // Setup SVG icon for selection in cart view
            const iconId = `image_${index}`;
            const svgIcon = addressHTML.querySelector('svg');
            if (svgIcon) {
                svgIcon.id = iconId;
            }

            // Add click handler for selecting the address card
            addressHTML.querySelector('.address_click').addEventListener('click', () => {
                toggleChoice(`#${iconId}`);
            });

            // Auto-select the first address visually
            if (index === 0 && svgIcon) {
                svgIcon.setAttribute('fill', 'green');
                svgIcon.setAttribute('stroke', 'green');
            }
        }

        // Append populated address card to the container
        container.append(addressHTML);
    });
}

// Opens the address form for creating a new address or editing an existing one
async function openAddressForm(address = null) {
    const form = await loadHtmlComponent("../../components/built/form/form.html");
    const isEditMode = address !== null;

    // Remove 'required' attribute from optional 'box_now' field
    form.querySelector('#form_item_5_input').removeAttribute('required');

    // Pre-fill form fields if editing an existing address
    if (isEditMode) {
        form.querySelector('#form_item_1_input').value = address.address || '';
        form.querySelector('#form_item_2_input').value = address.zip_code || '';
        form.querySelector('#form_item_3_input').value = address.city || '';
        form.querySelector('#form_item_4_input').value = address.country || '';
        form.querySelector('#form_item_5_input').value = address.box_now || '';
    }

    // Set form header text depending on mode
    form.querySelector('#form_message').textContent = isEditMode ? "Edit your Address" : "Add New Address";

    // Add handler for the back button to close the form without saving
    form.querySelector('#form_back_button').addEventListener('click', (event) => {
        event.preventDefault();
        form.remove();
    });

    // Append form to document body
    document.body.append(form);

    // Apply custom input styling (assumed external function)
    customInputCheck('.form input');

    // Handle form submission
    form.querySelector('.form').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Gather trimmed input values from the form
        const inputValues = {
            address: form.querySelector('#form_item_1_input').value.trim(),
            zip_code: form.querySelector('#form_item_2_input').value.trim(),
            city: form.querySelector('#form_item_3_input').value.trim(),
            country: form.querySelector('#form_item_4_input').value.trim(),
            box_now: form.querySelector('#form_item_5_input').value.trim() || null
        };

        let isUnchanged = false;

        if (isEditMode) {
            // Include ID for updating existing address
            inputValues.id = address.id;

            // Check if any address fields were modified
            isUnchanged = (
                address.address === inputValues.address &&
                address.zip_code === inputValues.zip_code &&
                address.city === inputValues.city &&
                address.country === inputValues.country &&
                address.box_now === inputValues.box_now
            );
        }

        // Proceed if changes were made or creating new address
        if (!isUnchanged) {
            await updateAddress(inputValues);
            await onFetch(await getUserInfo());  // Refresh addresses after update
        }

        // Close the form after processing
        form.remove();
    });
}

// Sends the updated address data to the server
async function updateAddress(address) {
    const formData = new FormData();
    for (const key in address) {
        formData.append(key, address[key] ?? '');
    }
    formData.append('action', 'update_address');

    try {
        const response = await fetch('../../../include/profile/profile.php', {
            method: 'POST',
            body: formData
        });
        return await response.json();
    } catch (error) {
        console.error("Error updating address:", error);
        throw error;  // Propagate error to caller
    }
}
