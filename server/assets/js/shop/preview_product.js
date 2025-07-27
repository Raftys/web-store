
// Initialize product preview when the page loads
document.addEventListener('DOMContentLoaded', function () {
    fetchProductDetails();
});

// Fetch product details based on product ID from URL
function fetchProductDetails() {
    const productId = getQueryParameter('product_id');

    if (!productId) {
        console.error('No product ID provided in the URL.');
        return;
    }
    const formData = new FormData();
    formData.append('action', 'fetch_product');
    formData.append('product_id', productId);

    fetch('../../../include/shop/shop.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (!data || data.error) {
                console.error('Error in data:', data?.error || 'Unknown error');
                return;
            }

            data.images.unshift({ image_path: data.main_image });
            // Populate product details into the DOM
            document.getElementById('product_title').innerText = data.name;
            if (data.offer === '0') {
                document.getElementById('product_offer').innerText = 'Special Offer';
            } else {
                document.getElementById('product_offer').remove();
            }
            document.getElementById('product_image').src = data.images[0].image_path;

            document.getElementById('product_description').innerText = data.description;

            const priceFormatted = parseFloat(data.price).toFixed(2);
            document.getElementById('product_price').innerText = `Τιμή: ${priceFormatted}€`;
            document.getElementById('product_price_per_item').innerText = `Τιμή ανά τεμάχιο: ${priceFormatted}€`;

            // Create product image thumbnails
            createThumbnailGallery(data.images);

            // Add to cart button event setup
            document.getElementById('add_button').addEventListener('click', (event) => {
                event.stopPropagation();
                data.quantity = parseInt(document.getElementById('quantity').textContent);
                addItem(data);
            });

            // Clicking main image opens modal
            document.getElementById('product_image').addEventListener('click', () => {
                openModal(data.main_image, data.images);
            });

        })
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
}

