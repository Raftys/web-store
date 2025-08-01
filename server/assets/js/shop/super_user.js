// Declare variable to store the main image file
let main_image;

// Declare variable to store the product's original main image file
let product_main_image;

// Declare array to store additional uploaded images
let images = [];

// Declare array to store product's original images (used in editing)
let product_images = [];

// Open the product form (used for adding or editing a product)
async function openProductForm(item = null) {
    // Load the product form HTML component
    let productHTML = await loadHtmlComponent('../../components/built/form/addItem.html');

    // Append main image upload field
    productHTML.querySelector('#main_image_container').append(await createUploads());

    // Append multiple images upload field
    productHTML.querySelector('#images_container').append(await createUploads('multiple'));

    // Prevent form click from closing the popup
    productHTML.querySelector('.popup_form').addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // If editing an existing product
    if(item !== null) {
        productHTML = await isEdit(productHTML,item);
    } else {
        // If adding a new product, set up add button
        productHTML.querySelector('#button_add_item').addEventListener('click', ()=>addNewItem());
    }

    // Append the form to the document body
    document.body.append(productHTML);

    // If editing a product, toggle the submit button based on form state
    if(item !== null) {
        toggleSubmitButton();
    }
}

// Create upload component for images (main or multiple)
async function createUploads(type=null) {
    // Load the image upload HTML component
    const image_container = await loadHtmlComponent('../../components/built/images/upload.html');

    // Configure for main image upload (single file)
    if (type === null) {
        image_container.querySelector('.image_upload').removeAttribute('multiple')
        image_container.querySelector('.text').textContent = "Click to upload main image";
    }

    // Handle image file selection
    image_container.querySelector('.image_upload').addEventListener('change', async function () {
        const fileInput = image_container.querySelector('.image_upload');
        const previewContainer = image_container.querySelector('.preview_container');
        previewContainer.classList.remove('hidden');

        // If no files are selected, return early
        if (!fileInput.files || fileInput.files.length === 0) {
            return;
        }

        // Clear previous previews for main image uploads
        if (type === null) {
            previewContainer.innerHTML = '';
        }

        // Load preview HTML for images
        const imagePreviewHTML = await loadHtmlComponent('../../components/built/images/upload_preview.html');

        // Loop through each selected file
        Array.from(fileInput.files).forEach(file => {
            // Skip if image is a duplicate
            if(type === null && isDuplicateImage(file,main_image) || type !== null && isDuplicateImage(file,images)) {
                return;
            }

            // Clone preview template and set file details
            const imagePreview = imagePreviewHTML.cloneNode(true)
            imagePreview.querySelector('.preview_filename').textContent = file.name;
            imagePreview.querySelector('.preview_thumbnail').src =URL.createObjectURL(file);

            // Add delete button logic for image preview
            imagePreview.querySelector('.bin_button').addEventListener('click', () => {
                imagePreview.remove();
                if (type === null) main_image = null;
                else images = images.filter(img => img.name !== file.name);
            })

            // Store file as main image or add to images array
            if (type === null) main_image = file;
            else images.push(file);

            // Append preview and toggle submit button
            previewContainer.append(imagePreview);
            toggleSubmitButton();
        });
    });
    return image_container;
}

// Check if an image file is a duplicate
function isDuplicateImage(file, target) {
    // If target is a single File object
    if (target instanceof File) {
        return file.name === target.name && file.size === target.size;
    }

    // If target is an array of File objects
    if (Array.isArray(target)) {
        return target.some(img =>
            file.name === img.name && file.size === img.size
        );
    }

    // Return false if target is null or unsupported
    return false;
}

// Enable or disable submit button based on form completion
function toggleSubmitButton() {
    // Get required input fields
    const requiredInputs = [
        document.getElementById('title'),
        document.getElementById('small_description'),
        document.getElementById('description'),
        document.getElementById('price'),
        document.getElementById('add_item_quantity')
    ];

    // Get containers for images
    const mainImageContainer = document.getElementById('main_image_container');
    const imagesContainer = document.getElementById('images_container');

    // Check if text inputs are filled
    const text_values = requiredInputs.every(input => input.value.trim() !== '')

    // Check if image uploads exist
    const image_values = mainImageContainer.children[0].children[1].hasChildNodes() && imagesContainer.children[0].children[1].hasChildNodes();

    // Enable button only if all fields and images are valid
    document.getElementById('button_add_item').disabled = !(text_values && image_values);
}

// Preview the main image for editing
async function previewMainImage(item) {
    const imagePreviewHTML = await loadHtmlComponent('../../components/built/images/upload_preview.html');
    const imagePreview = imagePreviewHTML.cloneNode(true);
    imagePreview.querySelector('.preview_filename').textContent = item.main_image.split('/').pop();
    imagePreview.querySelector('.preview_thumbnail').src = item.main_image;

    // Add delete logic for main image
    imagePreview.querySelector('.bin_button').addEventListener('click', () => {
        imagePreview.remove();
        main_image = null;
        toggleSubmitButton();
    })

    // Convert image source to file and store it
    const main_image_file = await imageSrcToFile(item.main_image,item.name);
    main_image = main_image_file;
    product_main_image = main_image_file;
    return imagePreview;
}

// Preview multiple images for editing
async function previewImages(item) {
    const product_img = await getProductImages(item);
    const imagePreviewHTML = await loadHtmlComponent('../../components/built/images/upload_preview.html');
    const fragment = document.createDocumentFragment();

    // Loop through each product image
    for (const image of product_img) {
        const imagePreview = imagePreviewHTML.cloneNode(true);
        imagePreview.querySelector('.preview_filename').textContent = image.image_path.split('/').pop();
        imagePreview.querySelector('.preview_thumbnail').src = image.image_path;

        // Add delete button logic
        imagePreview.querySelector('.bin_button').addEventListener('click', () => {
            imagePreview.remove();
            images = images.filter(img => img.name !== image.image_path);
            toggleSubmitButton();
        })

        // Convert image source to file and add to arrays
        const imageFile = await imageSrcToFile(image.image_path,image.image_path);
        product_images.push(imageFile);
        images.push(imageFile)
        fragment.appendChild(imagePreview);
    }
    return fragment;
}

// Convert image URL to File object
async function imageSrcToFile(src, filename) {
    const response = await fetch(src);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
}

// Fetch product images from server
async function getProductImages(item) {
    const formData = new FormData();
    formData.append('action', 'fetch_product_details');
    formData.append('product_id', item.id);

    return fetch('../../../include/shop/shop.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            return data;
        })
}

// Add a new product or edit an existing one
function addNewItem(item = null) {
    const inputs = getAddFormValues();

    // If editing and no changes are detected, close the form
    if (item !=null && compareValue(item, inputs)) {
        closeForm();
        return;
    }

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('title',inputs['name']);
    formData.append('small_description',inputs['small_description']);
    formData.append('description',inputs['description']);
    formData.append('price',inputs['price']);
    formData.append('quantity',inputs['quantity']);
    formData.append('offer',inputs['offer']);
    formData.append('main_image',main_image);

    // Append multiple images
    for (let i = 0; i < images.length; i++) {
        formData.append('images[]', images[i]);
    }

    // Set action type based on add or edit
    if (item !=null) {
        formData.append('action','edit_product');
        formData.append('id',item.id);
    } else {
        formData.append('action','add_product');
    }

    // Send request to server
    fetch('../../include/shop/shop.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(async data => {
            if (data) {
                await showNotification('Product has been added', 'success');
                await initPage('super');
            } else {
                await showNotification('Product has not been added', 'error');
            }
            closeForm();
        })
}

// Delete a product
function deleteItem(item) {
    const formData = new FormData();
    formData.append('id', item.id);
    formData.append('action','delete_product');

    fetch('../../include/shop/shop.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(async data => {
            if (data) {
                await showNotification('Product has been deleted', 'success');
                await initPage('super');
            } else {
                await showNotification('Product has not been deleted', 'error');
            }
            closeForm();
        })
}

// Compare form values to existing product values (detect changes)
function compareValue(item, inputs) {
    if (main_image !== product_main_image) return false;
    if (images.length !== product_images.length) return false;
    if(!images.every((val, index) => val === product_images[index])) return false;
    for (const [key, value] of Object.entries(item)) {
        if (key !== 'id' && key !== 'main_image' && value !== inputs[key]) return false;
    }
    return true;
}

// Get values from the add/edit product form
function getAddFormValues() {
    return {
        name: document.getElementById('title').value,
        small_description: document.getElementById('small_description').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        quantity: document.getElementById('add_item_quantity').value,
        offer: document.getElementById('checkbox').checked ? '1' : '0',
        main_image: main_image.path,
        images: images
    };
}

// Close the product form and reset variables
function closeForm() {
    document.querySelector('.form_overlay').remove();
    main_image = null;
    product_main_image= null;
    images = [];
    product_images = [];
}

// Populate form fields and images for editing a product
async function isEdit(productHTML, item) {
    productHTML.querySelector('#title').value = item.name;
    productHTML.querySelector('#small_description').value = item.small_description;
    productHTML.querySelector('#description').value = item.description;
    productHTML.querySelector('#price').value = item.price;
    productHTML.querySelector('#add_item_quantity').value = item.quantity;
    productHTML.querySelector('#checkbox').checked = item.offer === '1';

    const preview_containers = productHTML.querySelectorAll('.preview_container');
    preview_containers[0].append(await previewMainImage(item));
    preview_containers[1].append(await previewImages(item));

    productHTML.querySelector('#button_delete_item').disabled = false;
    productHTML.querySelector('#button_delete_item').addEventListener('click', ()=>deleteItem(item));
    productHTML.querySelector('#button_add_item').addEventListener('click', ()=>addNewItem(item));
    return productHTML;
}
