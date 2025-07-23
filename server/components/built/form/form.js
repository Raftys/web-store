

function customInputCheck(id) {
    // Select all input elements inside flex_container with class column
    const inputs = document.querySelectorAll(id);

    // Attach invalid event listeners to required inputs to show custom error notifications
    inputs.forEach(input => {
        if (input.required) {

            input.addEventListener('invalid', async function (event) {
                event.preventDefault(); // Prevent default browser validation message

                if (input.validity.valueMissing) {
                    // Input is empty
                    await showNotification("Please fill out the fields with *", "error");
                } else if (input.validity.typeMismatch) {
                    // Input value type is incorrect (e.g. invalid email format)
                    await showNotification("Please enter a valid value to: " + input.name, "error");
                } else if (input.validity.patternMismatch) {
                    // Input does not match the pattern attribute
                    await showNotification("Please match the requested format", "error");
                } else {
                    // Other validation errors
                    await showNotification("Please fill out this field correctly", "error");
                }
            });
        }
    });

}