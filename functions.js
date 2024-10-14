//add to cart
function addItems(id, name, price, image, quantity) {
    const formData = new FormData();
    formData.append("id",id);
    formData.append("name",name);
    formData.append("price",price);
    formData.append("image",image);
    formData.append("quantity",quantity)
    fetch('../cart.php', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse JSON if the response is OK
        })
        .then(data => {
            document.getElementById('cart-label').innerText = `Καλάθι (${data.totalItems})`;
        })
        .catch(error => {
            console.error('Error:', error); // Log the error for debugging
            alert("Error: " + error.message); // Display the error message
        });
}

// Function to create and display notification
function showNotification(message,type) {
    // Create notification div
    const notification = document.createElement('div');
    notification.classList.add(type);
    notification.innerText = message;

    // Append to body
    document.body.appendChild(notification);

    // Show notification with fade-in effect
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.opacity = '1'; // Fade in
    }, 10); // Small timeout for the effect to take place

    // Set timeout to hide and remove notification after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0'; // Fade out
        setTimeout(() => {
            notification.remove(); // Remove from DOM
        }, 300); // Wait for fade out transition to finish before removing
    }, 4000); // Show for 4 seconds
}

let item_name = "name";
function loadItemName(product_id) {
    return fetch('../Product/product_preview.php', { // Make sure the path is correct relative to product.html
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'product_id': product_id // Send the product ID to the PHP script
        })
    })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            if (data && !data.error) { // Check if there's data and no error
                // Populate the product details in the HTML
                item_name = data.name;
                return item_name;
            } else {
                console.error('Error in data:', data.error);
                return null;
            }
        })
        .catch(error => console.error('Error fetching product details:', error));
}

function get_info() {
    return fetch('../Account/php/fetch_account_info.php')
        .then(response => response.json())
        .then(data => {
            if (data && Object.keys(data).length > 0) {
                setElementValueOrContent('full_name', data.full_name);
                setElementValueOrContent('email', data.email);
                setElementValueOrContent('phone', data.phone);
                setElementValueOrContent('address', data.address);
                setElementValueOrContent('city', data.city);
                setElementValueOrContent('zip_code', data.zip_code);
                setElementValueOrContent('country', data.country);
                setElementValueOrContent('box_now', data.box_now);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function setElementValueOrContent(id, value) {
    const element = document.getElementById(id);
    if (element) {
        if (element.tagName === 'INPUT') {
            // If it's an input or textarea, set the value
            element.value = value;
        } else {
            // Otherwise, set the innerHTML
            element.innerHTML = value;
        }
    } else {
        console.warn(`Element with ID '${id}' not found.`);
    }
}