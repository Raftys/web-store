let addresses;                    // Array of all user's addresses fetched from server
let full_name;
let email;
let phone;
document.addEventListener('DOMContentLoaded', function () {
   getInfo().then(() => {});
});

function getInfo() {
    return fetch('../../include/profile/fetch_user.php')
        .then(response => response.json())
        .then(async data => {
            if (data && Object.keys(data).length > 0) {
                full_name =data.user.full_name;
                email =data.user.email;
                phone =data.user.phone;
                setElementValueOrContent('full_name',full_name);
                setElementValueOrContent('email', email);
                setElementValueOrContent('phone', phone);

                addresses = Array.isArray(data.address) ? data.address : [data.address];
                if (addresses?.length > 0) {
                    await loadAddresses(addresses).catch(error =>
                        console.error("Error loading addresses:", error)
                    );
                }
                toggleButton();
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function changeUserInfo() {
    const formData = new FormData();
    formData.append('full_name',document.getElementById('full_name').value);
    formData.append('email',document.getElementById('email').value);
    formData.append('phone',document.getElementById('phone').value);


    fetch('../../../include/profile/update_user.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(() => {
            // Display success or error message
            getInfo().then(() => {});
            toggleButton();
        })
        .catch(error => {
            console.error('Error:', error);
        });

    /*
    let button = document.getElementById('edit-button').innerText;


    const fields = ['full_name', 'email', 'phone', 'address', 'city', 'zip_code', 'country', 'box_now'];
    if(button === 'Edit') {
        document.getElementById('edit-button').innerText = 'Save';
        fields.forEach(field => {
            const textElement = document.getElementById(field);
            const inputElement = document.getElementById(field + '_input');
            textElement.style.display = 'none';
            inputElement.style.display = 'block';
            inputElement.value=document.getElementById(field).innerText;
        })
    }
    if(button === 'Save') {
        document.getElementById('edit-button').innerText = 'Edit';
        const formData = new FormData();
        fields.forEach(field => {
            const textElement = document.getElementById(field);
            const inputElement = document.getElementById(field + '_input');
            formData.append(field,inputElement.value);
            textElement.style.display = 'block';
            inputElement.style.display = 'none';
        })
        fetch('../Account/php/update_user.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(() => {
                // Display success or error message
                get_info().then(() => {});
                document.getElementById('edit-button').innerText = 'Edit';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }*/
}

async function loadAddresses(addresses) {

    const template = await loadHtmlComponent('../../components/built/address/address.html');

    // Clear existing addresses
    document.getElementById('addresses').innerHTML = '';

    addresses.forEach((item) => {
        const addressHTML = template.cloneNode(true);

        // Fill in address text
        addressHTML.querySelector('.text').textContent = `${item.address}, ${item.zip_code}, ${item.city}`;

        // Remove SVg using for cart, selecting address
        addressHTML.querySelector('svg').remove();

        // Add click handler for editing this address
        addressHTML.querySelector('.address_edit_click').addEventListener('click', (event) => {
            event.stopPropagation();
            openAddressForm(item);
        });

        // Append the address card to the container
        document.getElementById('addresses').append(addressHTML);
    });
}

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
            console.log("Updating Address");
            await updateAddress(inputValues);
            console.log("Reloading Address");
            await getInfo();  // Refresh addresses
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


function toggleButton() {
    let edit_full_name = document.getElementById('full_name').value;
    let edit_email = document.getElementById('email').value;
    let edit_phone = document.getElementById('phone').value;
    document.getElementById('save').disabled = !(full_name !== edit_full_name || email !== edit_email || phone !== edit_phone);

}