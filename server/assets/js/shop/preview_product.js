let product_id_info;
// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function () {
    // Fetch product details once the DOM is ready
    fetchProductDetails();
});

// Fetch product details based on product ID from URL
function fetchProductDetails() {
    // Get product ID from the query string
    const productId = getQueryParameter('product_id');

    // If no product ID is provided, log an error and exit
    if (!productId) {
        console.error('No product ID provided in the URL.');
        return;
    }

    // Prepare form data to send in the POST request
    const formData = new FormData();
    formData.append('action', 'fetch_product');
    formData.append('product_id', productId);

    // Fetch product details from the server
    fetch('../../../include/shop/shop.php', {
        method: 'POST',
        body: formData
    })
        // Convert response to JSON format
        .then(response => response.json())
        // Handle the returned product data
        .then(data => {
            // If no data or error in response, log an error and exit
            if (!data || data.error) {
                console.error('Error in data:', data?.error || 'Unknown error');
                return;
            }
            product_id_info = data;

            // Load product details into the page
            loadProduct(data);
        })
        // Handle fetch errors (e.g., network issues)
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
}

// Load product data into the page DOM elements
function loadProduct(data) {
    // Add main image to the beginning of images array
    data.images.unshift({ image_path: data.main_image });

    // Set product title
    document.getElementById('product_title').innerText = data.name;

    // If there is an offer, display "Special Offer"; otherwise, remove the offer element
    if (data.offer === '0') {
        document.getElementById('product_offer').innerText = t('special_offer');
    } else {
        document.getElementById('product_offer').remove();
    }

    // Set main product image
    document.getElementById('product_image').src = data.images[0].image_path;

    // Set product description
    document.getElementById('product_description').innerText = data.description;

    // Format price to two decimal places
    const priceFormatted = parseFloat(data.price).toFixed(2);

    // Display product price
    document.getElementById('product_price').innerText = `${t('total')} ${priceFormatted}€`;

    // Display price per item
    document.getElementById('product_price_per_item').innerText = `${t('per_item')} ${priceFormatted}€`;

    // Create clickable image thumbnails gallery
    createThumbnailGallery(data.images);

    // Setup event listener for "Add to Cart" button
    document.getElementById('add_button').addEventListener('click', (event) => {
        // Prevent event bubbling
        event.stopPropagation();

        // Get selected quantity and add to data
        data.quantity = parseInt(document.getElementById('quantity').textContent);

        // Add product to cart
        addItem(data);
    });

    // Setup event listener for clicking the main image to open a modal
    document.getElementById('product_image').addEventListener('click', () => {
        // Open modal with main image and gallery images
        openModal(data.main_image, data.images);
    });
}