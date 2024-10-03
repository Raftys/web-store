<?php
include 'fetch_products.php';


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $product_id = $_POST['product_id'];
    echo "Package: $product_id";
    //header("Location: Product/product.html?product_id=" . urlencode($product_id));
    exit();
    // Do something with the product ID, like querying the database
}


