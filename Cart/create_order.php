<?php
$total_amount = isset($_POST['total']) ? floatval($_POST['total']) : 0;

include "../sql_functions.php";
if (session_status() == PHP_SESSION_NONE)
    session_start();

$full_name = $_POST['full_name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$address = $_POST['address'];
$city = $_POST['city'];
$zip_code = $_POST['zip_code'];
$country = $_POST['country'];


$user_id = -1; // Default value
$conn = connect();
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    $user_id = $_SESSION['user_id'];
    $response = [
        'id' => $user_id,
        'full_name' => $full_name,
        'email' => $email,
        'phone' => $phone,
        'address' => $address,
        'city' => $city,
        'zip_code' => $zip_code,
        'country' => $country,
    ];
    $user_info = select_all_from_id($conn, $user_id, 'users')->fetch_assoc();
    if($user_info != $response) {
        update_table('users', $user_id, $full_name, $email, $phone, $address, $city, $zip_code, $country);
    }
}
else {
    $user_id = $_SESSION['user_id'] = guest_user($full_name, $email, $phone, $address, $city, $zip_code, $country);

}
$status = 'pending';

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
$_SESSION['order_id'] = $order_id;

$cart = $_SESSION['cart'];
foreach ($cart as $product) {
    $stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id,quantity) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $order_id, $product['id'], $product['quantity']);
    $stmt->execute();
}
echo json_encode("Done");
exit();

