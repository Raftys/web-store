<?php
if (isset($_POST['total'])) {
    $total_amount = $_POST['total'];
}
include "../sql_functions.php";
if (session_status() == PHP_SESSION_NONE)
    session_start();

$user_id = -1; // Default value
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true)
    $user_id = $_SESSION['user_id'];
$status = 'pending';
$conn = connect();

$stmt = $conn->prepare("INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)");
$stmt->bind_param("ids", $user_id, $total_amount, $status); // "ids" means integer, decimal, string
// Execute the statement
$stmt->execute();


$stmt = $conn->prepare('SELECT id FROM orders WHERE user_id = ? ORDER BY order_date DESC LIMIT 1');

// Bind the parameter (replace ? with $user_id)
$stmt->bind_param("i", $user_id); // "s" means the type of the parameter is a string

// Execute the query
$stmt->execute();
$result = $stmt->get_result();
$order_id = 0;

if ($row = $result->fetch_assoc())
    $order_id = (int) $row['id'];

$cart = $_SESSION['cart'];
foreach ($cart as $product) {
    $stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id,quantity) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $order_id, $product['id'], $product['quantity']);
    $stmt->execute();
}
echo json_encode("Done");
exit();

