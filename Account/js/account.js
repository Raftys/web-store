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
                alert("Info Updated!")
                document.getElementById('edit-button').innerText = 'Edit';
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }
}
