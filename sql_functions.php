<?php
function connect()
{
    $host = 'localhost';
    $db = 'saltses';
    $user = 'root'; // or your MySQL username
    $pass = 'root'; // your MySQL password

    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

function load_products($conn) {
    $sql = "SELECT * FROM products";
    $result = $conn->query($sql);

    $items = [];

    if ($result->num_rows > 0) {
        // Output data of each row
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
    }
    $conn->close();
    return $items;
}

function load_product($conn, $product_id) {
    // Using prepared statements to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->bind_param("i", $product_id); // 'i' means that $product_id is an integer
    $stmt->execute();
    return $stmt->get_result();
}

function loadCart() {
    
}