// product.js

// Function to get query parameters from the URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

let product_info = new FormData();

// Function to fetch product details based on the product ID
function fetchProductDetails() {
    const productId = getQueryParameter('product_id'); // Get the product ID from the URL

    if (productId) {
        fetch('../Header/header.php')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header-container').innerHTML = data;
            })
            .catch(error => console.error('Error loading header:', error));

        fetch('../Product/product_preview.php', { // Make sure the path is correct relative to product.html
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
                    product_info.append("name", data.name);
                    product_info.append("image", data.image);
                    product_info.append("price", data.price);
                    product_info.append("offer",data.offer);

                    // Store the image URLs for modal gallery
                    product_info.append("images", JSON.stringify(data.images));

                    document.getElementById('product-title').innerText = data.name; // Update title
                    if(data.offer != null)
                        document.getElementById('product-title').style.color = 'red';
                    document.getElementById('product-offer').innerText = data.offer;
                    document.getElementById('product-image').src = data.image; // Set the image src to first image
                    createThumbnailGallery(data.images);
                    document.getElementById('product-description').innerText = data.description; // Update description
                    document.getElementById('product-price').innerText = `Τιμή: ${parseFloat(data.price).toFixed(2)}€`; // Update price
                } else {
                    console.error('Error in data:', data.error);
                }
            })
            .catch(error => console.error('Error fetching product details:', error));
    } else {
        console.error('No product ID provided in the URL.');
    }
}

function createThumbnailGallery(images) {
    const galleryContainer = document.querySelector('.thumbnail-gallery'); // Use the existing container

    images.forEach((imgSrc) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = imgSrc;
        thumbnail.classList.add('thumbnail');
        thumbnail.onclick = () => {
            document.getElementById('product-image').src = imgSrc;
        };
        galleryContainer.appendChild(thumbnail);
    });
}

// Call the function when the window loads
window.onload = function () {
    fetchProductDetails(); // Fetch product details on page load
};

// Close the modal
function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

// Image Navigation Functions
let currentImageIndex = 0; // Track the current image index in the array

function showImage(index, images) {
    const modalImg = document.getElementById("imgInModal");
    if (index >= 0 && index < images.length) {
        modalImg.src = images[index];
        currentImageIndex = index;
    }
}

function showNextImage(images) {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showImage(currentImageIndex, images);
}

function showPrevImage(images) {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showImage(currentImageIndex, images);
}

// Handle the image modal with previous and next arrows
function openModal() {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("imgInModal");
    const productImg = document.getElementById("product-image");
    const images = JSON.parse(product_info.get("images")); // Parse the image URLs array

    modal.style.display = "block";
    modalImg.src = productImg.src; // Set modal image to the current main image

    // Set the current image index based on the product image
    currentImageIndex = images.indexOf(productImg.src);

    // Add event listeners to the next and previous buttons
    const nextButton = document.querySelector(".next");
    const prevButton = document.querySelector(".prev");

    nextButton.onclick = () => showNextImage(images);
    prevButton.onclick = () => showPrevImage(images);
}

// Increment the quantity
function incrementQuantity() {
    const quantityInput = document.getElementById("quantity");
    const quantity = parseInt(quantityInput.value);
    quantityInput.value = quantity + 1;
}

// Decrement the quantity
function decrementQuantity() {
    const quantityInput = document.getElementById("quantity");
    const quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
        quantityInput.value = quantity - 1;
    }
}

function addToCart() {
    const productId = getQueryParameter('product_id');
    const quantity = parseInt(document.getElementById("quantity").value);
    addItems(productId, product_info.get("name"), product_info.get("price"), product_info.get("image"), product_info.get("offer"), quantity);
    showNotification(`Το προϊόν ${product_info.get("name")} έχει προστεθεί στο καλάθι σας.`, "notification");
}
