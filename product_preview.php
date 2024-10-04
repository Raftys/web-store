<?php
function connect()
{
    $host = 'localhost';
    $db = 'products';
    $user = 'root'; // or your MySQL username
    $pass = 'root'; // your MySQL password

    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

function load_product($conn, $product_id) {
    // Using prepared statements to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->bind_param("i", $product_id); // 'i' means that $product_id is an integer
    $stmt->execute();
    return $stmt->get_result();
}

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