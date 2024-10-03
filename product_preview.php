<?php
include 'fetch_products.php';

function load_product($conn, $product_id) {
    $sql = "SELECT * FROM products WHERE id=$product_id";
    return $conn->query($sql);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $product_id = $_POST['product_id'];
    $conn =  connect_database();
    $item = load_product($conn, $product_id)->fetch_assoc();
    $image = $item["image"];
    echo $image;





    header("Location: Product/product.html?product_id=" . urlencode($product_id));
    exit();
    // Do something with the product ID, like querying the database
}


