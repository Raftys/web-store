<?php
include "../sql_functions.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if the product_id is set and is an integer
    if (isset($_POST['product_id']) && is_numeric($_POST['product_id'])) {
        $product_id = intval($_POST['product_id']); // Ensure it's an integer

        // Ensure the connection is successful
        $conn = connect();

        // Fetch product details
        $result = load_product($conn, $product_id);


        // Check if a product was found
        if ($result && $result->num_rows > 0) {
            $item = $result->fetch_assoc(); // Fetch associative array
            echo json_encode($item); // Return JSON-encoded data
        } else {
            echo json_encode(['error' => 'Product not found']);
        }

        // Close the connection
        $conn->close();
    } else {
        echo json_encode(['error' => 'Invalid product ID']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}