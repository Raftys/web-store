<?php
session_start();
include_once '../sql_functions.php'; // Include your database connection functions
$conn = connect(); // Connect to the database

// Fetch all orders along with their associated items and customer details
$sql = "
SELECT 
    o.id AS order_id, 
    u.id AS user_id,  -- Fetch user_id from the users table
    c.full_name AS customer_name, 
    c.email AS customer_email, 
    c.phone AS customer_phone, 
    c.address AS customer_address, 
    c.city AS customer_city, 
    c.zip_code AS customer_zip_code, 
    c.country AS customer_country,
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
JOIN 
    customers c ON o.customer_id = c.id  -- Use customer_id to join with customers table
LEFT JOIN 
    order_items oi ON o.id = oi.order_id
LEFT JOIN 
    products p ON oi.product_id = p.id
ORDER BY 
    o.order_date DESC"; // Order by date, newest first

// Prepare the statement to prevent SQL injection
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

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
$stmt->close(); // Close the statement
$conn->close(); // Close the connection

// Return JSON response
header('Content-Type: application/json');
echo json_encode(array_values($orders)); // Return as an indexed array
?>
