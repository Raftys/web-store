// product_preview.js

// Function to get query parameters from the URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to fetch product details based on the product ID
function fetchProductDetails() {
    const productId = getQueryParameter('product_id'); // Get the product ID from the URL

    if (productId) {
        fetch('../product_preview.php', { // Make sure the path is correct relative to product.html
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'product_id': productId // Send the product ID to the PHP script
            })
        })
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                if (data && !data.error) { // Check if there's data and no error
                    // Populate the product details in the HTML
                    document.getElementById('product-title').innerText = data.name; // Update title
                    document.getElementById('product-image').src = data.image; // Set the image src
                    document.getElementById('product-description').innerText = data.description; // Update description
                    document.getElementById('product-price').innerText = `Price: €${parseFloat(data.price).toFixed(2)}`; // Update price
                } else {
                    console.error('Error in data:', data.error);
                }
            })
            .catch(error => console.error('Error fetching product details:', error));
    } else {
        console.error('No product ID provided in the URL.');
    }
}

// Call the function when the window loads
window.onload = function() {
    fetchProductDetails(); // Fetch product details on page load
};
