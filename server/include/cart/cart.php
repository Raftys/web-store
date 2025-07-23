<?php
if (session_status() == PHP_SESSION_NONE)
    session_start();

header('Content-Type: application/json');

// Ensure cart is an array
if (!isset($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

$id = $_POST['id'];
$quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : 1;

// Check if the item is already in the cart
$found = false;
foreach ($_SESSION['cart'] as $index => &$cartItem) {
    if ($cartItem['id'] == $id) {
        $cartItem['quantity'] += $quantity;

        if ($cartItem['quantity'] <= 0) {
            unset($_SESSION['cart'][$index]); // ✅ Correctly remove item from cart
            $_SESSION['cart'] = array_values($_SESSION['cart']); // reindex
        }

        $found = true;
        break;
    }
}
unset($cartItem); // 🔒 Good practice to avoid reference issues

// If not found, add new item
if (!$found) {
    $_SESSION['cart'][] = [
        'id' => $id,
        'name' => $_POST['name'],
        'price' => $_POST['price'],
        'image' => $_POST['image'],
        'offer' => $_POST['offer'],
        'quantity' => $quantity
    ];
}
// Ensure totalItems is numeric
if (!isset($_SESSION['totalItems']) || !is_numeric($_SESSION['totalItems'])) {
    $_SESSION['totalItems'] = 0;
}
$_SESSION['totalItems'] += $quantity;

// Return success response
echo json_encode(['totalItems' => $_SESSION['totalItems']]);
exit();

