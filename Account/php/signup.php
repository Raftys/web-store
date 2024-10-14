<?php
// Database connection
if (session_status() == PHP_SESSION_NONE)
    session_start();
include_once "../../sql_functions.php";
$conn = connect();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = $_POST['full_name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $address = $_POST['address'];
    $city = $_POST['city'];
    $zip_code = $_POST['zip_code'];
    $country = $_POST['country'];
    $box_now = !empty($_POST['box_now']) ? $_POST['box_now'] : '0';
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash the password
    $root = 0;

    $sql = "INSERT INTO users (full_name, email, phone, address, city, zip_code, country, password, root, box_now) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssssss', $full_name, $email, $phone, $address, $city, $zip_code, $country, $password, $root, $box_now);


    try {
        $stmt->execute();
        $_SESSION['logged_in'] = false;
        include "login.php";
        echo json_encode(['status' => 'success']);
        exit();
    } catch(Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $box_now]);

    }
}
