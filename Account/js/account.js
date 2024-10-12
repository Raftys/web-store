document.addEventListener('DOMContentLoaded', function () {
   get_info().then(() => {});
});


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

function logoff() {
    window.location.href = '../start.php';
}

