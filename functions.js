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
function showNotification(message) {
    // Create notification div
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerText = message;

    // Append to body
    document.body.appendChild(notification);

    // Show notification with fade-in effect
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.opacity = 1; // Fade in
    }, 10); // Small timeout for the effect to take place

    // Set timeout to hide and remove notification after 4 seconds
    setTimeout(() => {
        notification.style.opacity = 0; // Fade out
        setTimeout(() => {
            notification.remove(); // Remove from DOM
        }, 300); // Wait for fade out transition to finish before removing
    }, 4000); // Show for 4 seconds
}

let name = "name";
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
                name = data.name;
                return name;
            } else {
                console.error('Error in data:', data.error);
                return null;
            }
        })
        .catch(error => console.error('Error fetching product details:', error));
}

function loadCart() {
    let array = new array();


}