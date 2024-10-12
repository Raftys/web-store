const name = document.getElementById('full_name');
const phone = document.getElementById('phone');
const address = document.getElementById('address');
const city = document.getElementById('city');
const zip_code = document.getElementById('zip_code');
const country = document.getElementById('country');


const submitButton = document.getElementById('payment-button');

// Function to check if all inputs are filled
function checkInputs() {
    // Check if all input fields have values
    //if(name.value && phone.value && address.value && city.value && zip_code.value && country)
    if (name.value && phone.value && address.value && city.value && zip_code.value && country.value) {
        submitButton.disabled = false; // Enable button
        submitButton.style.opacity = '1'; // Set button opacity to 1
    } else {
        submitButton.disabled = true; // Disable button
        submitButton.style.opacity = '0.5'; // Set button opacity to 0.5
    }
}

// Event listeners to check inputs on keyup
name.addEventListener('keyup', checkInputs);
phone.addEventListener('keyup', checkInputs);
address.addEventListener('keyup', checkInputs);
city.addEventListener('keyup', checkInputs);
zip_code.addEventListener('keyup', checkInputs);
country.addEventListener('keyup', checkInputs);





