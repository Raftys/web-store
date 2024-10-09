<?php
session_start();
include_once '../sql_functions.php'; // Include your database connection functions
$conn = connect(); // Connect to the database

// Fetch all orders along with their associated items, user details, and product details
$sql = "
SELECT 
    o.id AS order_id, 
    u.full_name AS customer_name, 
    u.email AS customer_email, 
    u.phone AS customer_phone, 
    u.address AS customer_address, 
    u.city AS customer_city, 
    u.zip_code AS customer_zip_code, 
    u.country AS customer_country,
    o.order_date, 
    o.total_amount, 
    o.status, 
    oi.product_id, 
    oi.quantity AS item_quantity, 
    oi.price AS item_price, 
    oi.total AS item_total,
    p.name AS product_name,
    p.description AS product_description,
    p.image AS product_image
FROM 
    orders o
JOIN 
    users u ON o.user_id = u.id
LEFT JOIN 
    order_items oi ON o.id = oi.order_id
LEFT JOIN 
    products p ON oi.product_id = p.id
ORDER BY 
    o.order_date DESC"; // Order by date, newest first

$result = $conn->query($sql);

$orders = []; // Array to hold orders

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Check if order_id already exists in the orders array
        $order_id = $row['order_id'];

        // If order doesn't exist in the array, create it
        if (!isset($orders[$order_id])) {
            $orders[$order_id] = [
                'order_id' => $order_id,
                'customer_name' => $row['customer_name'],
                'customer_email' => $row['customer_email'],
                'customer_phone' => $row['customer_phone'],
                'customer_address' => $row['customer_address'],
                'customer_city' => $row['customer_city'],
                'customer_zip_code' => $row['customer_zip_code'],
                'customer_country' => $row['customer_country'],
                'order_date' => $row['order_date'],
                'total_amount' => $row['total_amount'],
                'status' => $row['status'],
                'items' => [] // Initialize items array
            ];
        }

        // Add the item to the order's items array
        if ($row['product_id']) {
            $orders[$order_id]['items'][] = [
                'product_id' => $row['product_id'],
                'product_name' => $row['product_name'], // Product name
                'product_description' => $row['product_description'], // Product description
                'product_image' => $row['product_image'], // Product image URL
                'quantity' => $row['item_quantity'],
                'price' => $row['item_price'],
                'item_total' => $row['item_total']
            ];
        }
    }
}

// Close the connection
$conn->close();

// Return JSON response
header('Content-Type: application/json');
echo json_encode(array_values($orders)); // Return as an indexed array

