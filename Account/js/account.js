document.addEventListener('DOMContentLoaded', function () {
    fetch('../fetch_account_info.php')
        .then(response => response.json())
        .then(data => {
            if (data) {
                document.getElementById('full_name').innerText = 'Full Name: ' + data.full_name;
                document.getElementById('email').innerText = 'Email: ' + data.email;
                document.getElementById('phone').innerText = 'Phone: ' + data.phone;
                document.getElementById('address').innerText = 'Address: ' + data.address;
                document.getElementById('city').innerText = 'City: ' + data.city;
                document.getElementById('zip_code').innerText = 'Zip Code: ' + data.zip_code;
                document.getElementById('country').innerText = 'Country: ' + data.country;
            } else {
                alert('No user data found');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});
