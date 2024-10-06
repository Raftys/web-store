document.addEventListener('DOMContentLoaded', function () {
   get_info();
});

function get_info() {
    fetch('../Account/php/fetch_account_info.php')
        .then(response => response.json())
        .then(data => {
            if (data) {
                document.getElementById('full_name').innerHTML =  data.full_name;
                document.getElementById('email').innerHTML =  data.email;
                document.getElementById('phone').innerHTML = data.phone;
                document.getElementById('address').innerHTML =  data.address;
                document.getElementById('city').innerHTML =  data.city;
                document.getElementById('zip_code').innerHTML =  data.zip_code;
                document.getElementById('country').innerHTML = data.country;
            } else {
                alert('No user data found');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function edit() {
    document.getElementById('edit-button').innerText = 'Save';
    const fields = ['full_name', 'email', 'phone', 'address', 'city', 'zip_code', 'country'];
    fields.forEach(field => {
        const textElement = document.getElementById(field);
        const inputElement = document.getElementById(field + '_input');
        textElement.style.display = 'none';
        inputElement.style.display = 'block';
        inputElement.value=document.getElementById(field).innerText;
    })
    document.getElementById('edit-button').onclick = function () {
        const fields = ['full_name', 'email', 'phone', 'address', 'city', 'zip_code', 'country'];
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
                get_info();
                alert("Info Updated!")
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }
}
/*
document.getElementById('edit-button').onclick = function() {
    // Toggle between editing and saving
    let isEditing = this.innerText === 'Save';

    // Show/hide inputs and text
    const fields = ['full_name', 'email', 'phone', 'address', 'city', 'zip_code', 'country'];

    fields.forEach(field => {
        const textElement = document.getElementById(field);
        const inputElement = document.getElementById(field + '_input');

        if (isEditing) {
            // Save the new value and update the data object
            data[field] = inputElement.value;
            textElement.innerHTML = '<strong>' + field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + ':</strong> ' + data[field];

            // Send data to the server
            updateDataToServer(field, data[field]);
        } else {
            // Switch to input fields
            inputElement.value = data[field] || ''; // Set input value
            inputElement.style.display = 'block';
            textElement.style.display = 'none';
        }
    });

    // Change button text
    this.innerText = isEditing ? 'Edit' : 'Save';
};

function updateDataToServer(field, value) {
    // Create an XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Configure it: POST-request for the URL /update.php
    xhr.open('POST', '/update.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Send the request over the network
    xhr.send(`field=${field}&value=${encodeURIComponent(value)}`);

    // Optional: handle response from server
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('Update successful:', xhr.responseText);
        } else {
            console.error('Update failed:', xhr.status, xhr.statusText);
        }
    };
}*/
