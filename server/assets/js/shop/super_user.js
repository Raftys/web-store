let main_image;
let product_main_image;
let images = [];
let product_images = [];


async function openProductForm(item = null) {
    let productHTML = await loadHtmlComponent('../../components/built/form/addItem.html');

    productHTML.querySelector('#main_image_container').append(await createUploads());
    productHTML.querySelector('#images_container').append(await createUploads('multiple'));
    productHTML.querySelector('.popup_form').addEventListener('click', function(event) {
        event.stopPropagation();
    });

    if(item !== null) {
        productHTML = await isEdit(productHTML,item);
    } else {
        productHTML.querySelector('#button_add_item').addEventListener('click', ()=>addNewItem());
    }

    document.body.append(productHTML);
    if(item !== null) {
        toggleSubmitButton();
    }
}

async function createUploads(type=null) {
    const image_container = await loadHtmlComponent('../../components/built/images/upload.html');

    if (type === null) {
        image_container.querySelector('.image_upload').removeAttribute('multiple')
        image_container.querySelector('.text').textContent = "Click to upload main image";
    }

    image_container.querySelector('.image_upload').addEventListener('change', async function () {
        const fileInput = image_container.querySelector('.image_upload');
        const previewContainer = image_container.querySelector('.preview_container');
        previewContainer.classList.remove('hidden');

        if (!fileInput.files || fileInput.files.length === 0) {
            return;
        }

        if (type === null) {
            previewContainer.innerHTML = '';
        }

        const imagePreviewHTML = await loadHtmlComponent('../../components/built/images/upload_preview.html');
        // Clear previous previews

        Array.from(fileInput.files).forEach(file => {
            if(type === null && isDuplicateImage(file,main_image) || type !== null && isDuplicateImage(file,images)) {
                return;
            }

            const imagePreview = imagePreviewHTML.cloneNode(true)

            imagePreview.querySelector('.preview_filename').textContent = file.name;
            imagePreview.querySelector('.preview_thumbnail').src =URL.createObjectURL(file);
            imagePreview.querySelector('.bin_button').addEventListener('click', () => {
                imagePreview.remove();
                if (type === null) main_image = null;
                else images = images.filter(img => img.name !== file.name);
            })

            if (type === null) main_image = file;
            else images.push(file);

            previewContainer.append(imagePreview);
            toggleSubmitButton();
        });
    });
    return image_container;
}

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

    return false; // If target is null or unsupported type
}

function toggleSubmitButton() {
    const requiredInputs = [
        document.getElementById('title'),
        document.getElementById('small_description'),
        document.getElementById('description'),
        document.getElementById('price'),
        document.getElementById('add_item_quantity')
    ];
    const mainImageContainer = document.getElementById('main_image_container');
    const imagesContainer = document.getElementById('images_container');

    const text_values = requiredInputs.every(input => input.value.trim() !== '')
    const image_values = mainImageContainer.children[0].children[1].hasChildNodes() && imagesContainer.children[0].children[1].hasChildNodes();

    document.getElementById('button_add_item').disabled = !(text_values && image_values);

}

async function previewMainImage(item) {
    const imagePreviewHTML = await loadHtmlComponent('../../components/built/images/upload_preview.html');
    const imagePreview = imagePreviewHTML.cloneNode(true);
    imagePreview.querySelector('.preview_filename').textContent =item.main_image.split('/').pop();
    imagePreview.querySelector('.preview_thumbnail').src =item.main_image;
    imagePreview.querySelector('.bin_button').addEventListener('click', () => {
        imagePreview.remove();
        main_image = null;
        toggleSubmitButton();
    })
    const main_image_file = await imageSrcToFile(item.main_image,item.name);
    main_image = main_image_file;
    product_main_image = main_image_file;
    return imagePreview;
}

async function previewImages(item) {
    const product_img = await getProductImages(item);
    const imagePreviewHTML = await loadHtmlComponent('../../components/built/images/upload_preview.html');

    const fragment = document.createDocumentFragment();

    for (const image of product_img) {
        const imagePreview = imagePreviewHTML.cloneNode(true);
        imagePreview.querySelector('.preview_filename').textContent = image.image_path.split('/').pop();
        imagePreview.querySelector('.preview_thumbnail').src = image.image_path;
        imagePreview.querySelector('.bin_button').addEventListener('click', () => {
            imagePreview.remove();
            images = images.filter(img => img.name !== image.image_path);
            toggleSubmitButton();
        })
        const imageFile = await imageSrcToFile(image.image_path,image.image_path);
        product_images.push(imageFile);
        images.push(imageFile)
        fragment.appendChild(imagePreview);
    }
    return fragment;
}

async function imageSrcToFile(src, filename) {
    const response = await fetch(src);
    const blob = await response.blob();

    // You can provide a filename and MIME type here
    return  new File([blob], filename, { type: blob.type });
}

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

function addNewItem(item = null) {
    const inputs = getAddFormValues();
    // If it's an edit and nothing changed, do nothing
    if (item !=null && compareValue(item, inputs)) {
        closeForm();
        return;
    }

    const formData = new FormData();
    formData.append('title',inputs['name']);
    formData.append('small_description',inputs['small_description']);
    formData.append('description',inputs['description']);
    formData.append('price',inputs['price']);
    formData.append('quantity',inputs['quantity']);
    formData.append('offer',inputs['offer']);
    formData.append('main_image',main_image);
    for (let i = 0; i < images.length; i++) {
        formData.append('images[]', images[i]); // Notice the 'images[]' name
    }

    if (item !=null) {
        formData.append('action','edit_product');
        formData.append('id',item.id);
    } else {
        formData.append('action','add_product');
    }


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

function compareValue(item, inputs) {

    if (main_image !== product_main_image)
        return false;
    if (images.length !== product_images.length) return false;
    if(!images.every((val, index) => val === product_images[index])) return false;
    for (const [key, value] of Object.entries(item)) {
        if (key !== 'id' && key !== 'main_image' && value !== inputs[key]) return false;
    }
    return true;
}

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

function closeForm() {
    document.querySelector('.form_overlay').remove();
    main_image = null;
    product_main_image= null;
    images = [];
    product_images = [];
}

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