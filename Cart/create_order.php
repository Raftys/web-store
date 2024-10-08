<?php
if (isset($_POST['total'])) {
    $total_amount = $_POST['total'];
}
include "../sql_functions.php";
if (session_status() == PHP_SESSION_NONE)
    session_start();

$id = -1; // Default value
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true)
    $id = $_SESSION['user_id'];
$status = 'pending';
$conn = connect();

$stmt = $conn->prepare("INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)");
$stmt->bind_param("ids", $id, $total_amount, $status); // "ids" means integer, decimal, string
// Execute the statement
$stmt->execute();

$stmt = $conn->prepare('SELECT * FROM orders');
//$stmt->bind_param("i", $id);
$stmt->execute();
$result = json_encode($stmt->get_result(),true);
echo $result;
exit();

$cart = $_SESSION['cart'];
foreach ($cart as $product) {
    $stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id,quantity) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $result['id'], $product['id'], $product['quantity']);
    $stmt->execute();
}
echo json_encode($_SESSION['cart']);
exit();

