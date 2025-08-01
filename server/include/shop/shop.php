<?php
include '../../include/sql_functions.php';
include '../../include/auth/jwt.php';

if (session_status() == PHP_SESSION_NONE)
    session_start();


$result = null;
if($_POST['action'] == 'fetch_products'){
    $result = fetch_products();
} else if($_POST['action'] == 'fetch_product'){
    $result = fetch_product();
} else  if($_POST['action'] == 'add_product' && (isset($_SESSION['super_user']) && $_SESSION['super_user'] === '1') && validateAccessToken()){
    $result = addProduct();
} else  if($_POST['action'] == 'edit_product' && (isset($_SESSION['super_user']) && $_SESSION['super_user'] === '1') && validateAccessToken()){
    $result = editProduct();
}else if ($_POST['action'] == 'fetch_product_details') {
    $result = fetch_product_images();
} else if ($_POST['action'] == 'delete_product') {
    $result = deleteProduct();
}
echo json_encode($result);
exit();

// Fetch all products from the database
function fetch_products() {
    return select_all('products');
}

// Fetch a single product by ID including its images
function fetch_product(){
    // Check if the product_id is set and is an integer
    if (isset($_POST['product_id']) && is_numeric($_POST['product_id'])) {
        $product_id = $_POST['product_id']; // Ensure it's an integer

        // Fetch product details
        $product = select_all_from_id($product_id, 'products');

        $product["images"] = fetch_product_images();
        return $product;
    }
    return false;
}

// Fetch images associated with a product
function fetch_product_images(){
    // Check if the product_id is set and is an integer
    if (isset($_POST['product_id']) && is_numeric($_POST['product_id'])) {
        $product_id = $_POST['product_id']; // Ensure it's an integer
        return is_array($images = select_value_from_id('product_id', $product_id, 'product_images'))
            ? (isset($images[0]) && is_array($images[0]) ? $images : [$images])
            : [];
    }
    return false;
}

// Add a new product to the database and save its images
function addProduct() {
    $title =  $_POST['title'];
    $small_description =  $_POST['small_description'];
    $description =  $_POST['description'];
    $price =  $_POST['price'];
    $quantity =  $_POST['quantity'];
    $offer =  $_POST['offer'] === '1' ? 1 : 0;

    $insert_keys = ['name','offer','small_description','description','price','quantity'];
    $insert_values =[$title, $offer, $small_description, $description, $price, $quantity];

    $insert_id = insert('products',$insert_keys, $insert_values);

    $uploadDir = '../../assets/images/products/' . $insert_id . '/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true); // recursive, with proper permissions
    }
    $main_image = saveMainImage($uploadDir);
    update('products','id','=',$insert_id,'main_image',$main_image,false);
    $images_path = saveImages($uploadDir);
    foreach ($images_path as $image_path) {
        // Assuming you have a table 'product_images' with columns 'product_id' and 'image_path'
        $img_insert_keys = ['product_id', 'image_path'];
        $img_insert_values = [$insert_id, $image_path];
        insert('product_images', $img_insert_keys, $img_insert_values);
    }
    return true;
}

// Edit a product by deleting old data and adding new product data
function editProduct() {
    deleteProduct();
    return addProduct();
}

// Save the main image file for a product
function saveMainImage($path) {
    // Get file extension
    $fileExt = explode('/', $_FILES['main_image']['type'])[1];

    // Create target file path
    $targetFile = $path . 'main.' . $fileExt;

    // Move uploaded file
    if (move_uploaded_file($_FILES['main_image']['tmp_name'], $targetFile)) {
        return $targetFile;
    }
    return '';
}

// Save additional product images from uploaded files
function saveImages($path) {
    $savedFiles = [];
    foreach ($_FILES['images']['name'] as $index => $file_name) {
        $fileExt = explode('/', $_FILES['images']['type'][$index])[1];
        $targetFile = $path . 'secondary_' . $index . '.' . $fileExt;

        if (move_uploaded_file($_FILES['images']['tmp_name'][$index], $targetFile)) {
            $savedFiles[] = $targetFile;  // Collect saved file path
        }
    }

    return $savedFiles; // Return array of saved images (empty if none)
}

// Delete a product and its associated images folder
function deleteProduct() {
    $product_info = get('products','id','=',$_POST['id'],'name',false);
    deleteFolder('../../assets/images/products/' . $product_info['name']);
    return delete('products', 'id',$_POST['id']);
}

// Recursively delete all files and folders in a directory
function deleteFolder($folderPath) {
    if (!is_dir($folderPath)) return;

    // Get all files and directories inside the folder
    $items = scandir($folderPath);

    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;

        $path = $folderPath . DIRECTORY_SEPARATOR . $item;

        if (is_dir($path)) {
            deleteFolder($path); // Recursively delete subfolders
        } else {
            unlink($path); // Delete files
        }
    }

    // Finally, remove the empty folder itself
    rmdir($folderPath);
}
