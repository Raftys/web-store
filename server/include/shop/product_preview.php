<?php
include "../../include/sql_functions.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if the product_id is set and is an integer
    if (isset($_POST['product_id']) && is_numeric($_POST['product_id'])) {
        $product_id = intval($_POST['product_id']); // Ensure it's an integer

        // Ensure the connection is successful

        // Fetch product details
        $product = select_all_from_id($product_id,'products');

        $full_path = "../../assets/images/products/" . $_POST['product_id'];  // Define the full folder path
        $images = [];
        if (is_dir($full_path)) {
            // Get all image files (jpg, jpeg, png, gif) in the folder
            foreach (glob("$full_path/*.{jpg,jpeg,png,gif}", GLOB_BRACE) as $file) {
                // Append only the relative path, so it can be used directly in HTML
                $images[] = $file;
            }
        }

        $product["images"] = $images;
        echo json_encode($product);
        exit();
    } else {
        echo json_encode(['error' => 'Invalid product ID']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}