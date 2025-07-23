document.addEventListener('DOMContentLoaded', function () {
   get_info().then(() => {});
});

function get_info() {
    return fetch('../../include/profile/fetch_user.php')
        .then(response => response.json())
        .then(data => {
            console.log(data.user);
            if (data && Object.keys(data).length > 0) {
                setElementValueOrContent('full_name', data.user.full_name);
                setElementValueOrContent('email', data.user.email);
                setElementValueOrContent('phone', data.user.phone);
                setElementValueOrContent('address', data.address);
                setElementValueOrContent('city', data.city);
                setElementValueOrContent('zip_code', data.zip_code);
                setElementValueOrContent('country', data.country);
                setElementValueOrContent('box_now', data.box_now);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function edit() {
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
    }
}

