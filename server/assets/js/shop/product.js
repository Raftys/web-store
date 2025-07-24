// product.js

// Modal image navigation logic
let currentImageIndex = 0;

// Initialize the product preview on page load
window.onload = function () {
    fetchProductDetails();
};

// Fetch product details using the product ID from the URL
function fetchProductDetails() {
    const productId = getQueryParameter('product_id');

    if (!productId) {
        console.error('No product ID provided in the URL.');
        return;
    }

    fetch('../../../include/shop/product_preview.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ 'product_id': productId })
    })
        .then(response => response.json())
        .then(data => {
            if (!data || data.error) {
                console.error('Error in data:', data?.error || 'Unknown error');
                return;
            }

            // Populate product details in the DOM
            document.getElementById('product_title').innerText = data.name;
            if (data.offer === '0') {
                document.getElementById('product_offer').innerText = 'Special Offer';
            } else {
                document.getElementById('product_offer').remove();
            }
            document.getElementById('product_image').src = data.images[0];
            document.getElementById('product_description').innerText = data.description;

            const priceFormatted = parseFloat(data.price).toFixed(2);
            document.getElementById('product_price').innerText = `Τιμή: ${priceFormatted}€`;
            document.getElementById('product_price_per_item').innerText = `Τιμή ανά τεμάχιο: ${priceFormatted}€`;

            // Create thumbnails
            createThumbnailGallery(data.images);

            // Add to cart button logic
            document.getElementById('add_button').addEventListener('click', (event) => {
                event.stopPropagation();
                data.quantity = parseInt(document.getElementById('quantity').textContent);
                addItem(data);
            });

            // Image click opens modal
            document.getElementById('product_image').addEventListener('click', () => {
                openModal(data.main_image, data.images);
            });

        })
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
}

// Create clickable thumbnail images
function createThumbnailGallery(images) {
    const galleryContainer = document.querySelector('.thumbnail_gallery');
    galleryContainer.innerHTML = ''; // Clear existing thumbnails

    images.forEach((imgSrc) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = imgSrc;
        thumbnail.classList.add('thumbnail');
        thumbnail.onclick = () => openModal(imgSrc, images);
        galleryContainer.appendChild(thumbnail);
    });
}

// Open the image modal
function openModal(imageSrc, images) {
    const modal = document.getElementById('image_modal');
    const modalImg = document.getElementById('image_in_model');

    modal.style.display = 'flex';
    modalImg.src = imageSrc;
    currentImageIndex = images.indexOf(imageSrc);

    document.querySelector('.next_image').onclick = () => {
        event.stopPropagation();
        showNextImage(images);
    }
    document.querySelector('.prev_image').onclick = () => {
        event.stopPropagation();
        showPrevImage(images);
    }
}

// Close the image modal
function closeModal() {
    document.getElementById('image_modal').style.display = 'none';
}

// Show a specific image in the modal
function showImage(index, images) {
    if (index >= 0 && index < images.length) {
        document.getElementById('image_in_model').src = images[index];
        currentImageIndex = index;
    }
}

// Show next image in the modal
function showNextImage(images) {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showImage(currentImageIndex, images);
}

// Show previous image in the modal
function showPrevImage(images) {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showImage(currentImageIndex, images);
}
