<?php
$total_amount = isset($_POST['total']) ? floatval($_POST['total']) : 0;

include "../sql_functions.php";
if (session_status() == PHP_SESSION_NONE)
    session_start();

$full_name = isset($_POST['full_name']) ? $_POST['full_name'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$phone = isset($_POST['phone']) ? $_POST['phone'] : '';
$address = isset($_POST['address']) ? $_POST['address'] : '';
$city = isset($_POST['city']) ? $_POST['city'] : '';
$zip_code = isset($_POST['zip_code']) ? $_POST['zip_code'] : '';
$country = isset($_POST['country']) ? $_POST['country'] : '';


$user_id = null; // Default value
$conn = connect();
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true)
    $user_id = $_SESSION['user_id'];
$customer_id  = create_customer($full_name, $email, $phone, $address, $city, $zip_code, $country);

$status = 'pending';

$stmt = $conn->prepare("INSERT INTO orders (user_id, customer_id, total_amount, status) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iids", $user_id, $customer_id, $total_amount, $status); // "ids" means integer, decimal, string
// Execute the statement
$stmt->execute();


$stmt = $conn->prepare('SELECT id FROM orders WHERE customer_id = ? ORDER BY order_date DESC LIMIT 1');

// Bind the parameter (replace ? with $user_id)
$stmt->bind_param("i", $customer_id); // "s" means the type of the parameter is a string

// Execute the query
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc())
    $_SESSION['order_id'] = $order_id = (int) $row['id'];


$cart = $_SESSION['cart'];
foreach ($cart as $product) {
    $stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id,quantity) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $_SESSION['order_id'], $product['id'], $product['quantity']);
    $stmt->execute();
}
echo json_encode("Done");
exit();

