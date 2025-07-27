// Modal image navigation logic
let currentImageIndex = 0;

// Create and display clickable thumbnails for images
function createThumbnailGallery(images) {
    const galleryContainer = document.querySelector('.thumbnail_gallery');
    galleryContainer.innerHTML = ''; // Clear existing thumbnails

    images.forEach((image) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image.image_path;
        thumbnail.classList.add('thumbnail');
        thumbnail.onclick = () => openModal(image.image_path, images);
        galleryContainer.appendChild(thumbnail);
    });
}

// Open modal window showing selected image
function openModal(imageSrc, images) {
    document.getElementById('image_modal').style.display = 'flex';
    document.getElementById('image_in_model').src = imageSrc ;

    currentImageIndex = images.indexOf(imageSrc);

    document.querySelector('.next_image').onclick = (event) => {
        event.stopPropagation();
        showNextImage(images);
    }
    document.querySelector('.prev_image').onclick = (event) => {
        event.stopPropagation();
        showPrevImage(images);
    }
}

// Close the image modal
function closeModal() {
    document.getElementById('image_modal').style.display = 'none';
}

// Show image by index in the modal
function showImage(index, images) {
    if (index >= 0 && index < images.length) {
        document.getElementById('image_in_model').src = images[index].image_path;
        currentImageIndex = index;
    }
}

// Navigate to and display next image in modal
function showNextImage(images) {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showImage(currentImageIndex, images);
}

// Navigate to and display previous image in modal
function showPrevImage(images) {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showImage(currentImageIndex, images);
}