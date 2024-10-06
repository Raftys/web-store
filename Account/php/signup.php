<?php
// Database connection
session_start();
$conn = new mysqli('localhost', 'root', 'root', 'saltses');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = $_POST['full_name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $address = $_POST['address'];
    $city = $_POST['city'];
    $zip_code = $_POST['zip_code'];
    $country = $_POST['country'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash the password
    $root = 0;

    $sql = "INSERT INTO users (full_name, email, phone, address, city, zip_code, country, password, root) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssssss', $full_name, $email, $phone, $address, $city, $zip_code, $country, $password, $root);

    if ($stmt->execute()) {
        $_SESSION['loggedin'] = false;
        include "login.php";
        header('Location: main.php');
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }
}
