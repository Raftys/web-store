<?php


if (session_status() == PHP_SESSION_NONE)
    session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = []; // Initialize as an empty array
}
$id = $_POST['id'];
$quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : 1;
$_SESSION['cart'][] = [
    'id' => $id,
    'value' => $quantity
];
if (!isset($_SESSION['totalItems']))
    $_SESSION['totalItems'] = 0; // Initialize as an empty array
$_SESSION['totalItems'] += $quantity;


// Send a success response

echo json_encode(['totalItems' => $_SESSION['totalItems']]);
exit();