<?php

if (session_status() == PHP_SESSION_NONE)
    session_start();

if ($_POST['action'] === 'reset') {
    resetCart();
} else if ($_POST['action'] === 'fetch') {
    fetchCart();
} else if ($_POST['action'] === 'apply_coupon') {
    applyCoupon();
} else if ($_POST['action'] === 'add') {
    addCart();
}

echo "No Action Selected";
exit();

// Reset the shopping cart
function resetCart() {
    $_SESSION['cart'] = [];
    $_SESSION['totalItems'] = 0;
    exit();
}

// Fetch current cart contents
function fetchCart() {
    if (isset($_SESSION['cart']))
        echo json_encode($_SESSION['cart']);
    else
        echo json_encode("Error");
    exit();
}

// Apply coupon code if valid
function applyCoupon() {
    if (isset($_POST['coupon'])) {
        $coupon = "'" . $_POST['coupon'] . "'";

        // Verify coupon exists in database
        $info = select_value_from_id('code', $coupon, 'coupons');
        if ($info) {
            echo json_encode(['info' => $info]);
            exit();
        }
    }
    echo json_encode(['info' => 'no coupon']);
    exit();
}

// Add item or update quantity in cart
function addCart() {
    if (!isset($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }

    $id = $_POST['id'];
    $quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : 1;

    $found = false;
    foreach ($_SESSION['cart'] as $index => &$cartItem) {
        if ($cartItem['id'] == $id) {
            $cartItem['quantity'] += $quantity;

            if ($cartItem['quantity'] <= 0) {
                unset($_SESSION['cart'][$index]);
                $_SESSION['cart'] = array_values($_SESSION['cart']); // Reindex array
            }

            $found = true;
            break;
        }
    }
    unset($cartItem);

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

    if (!isset($_SESSION['totalItems']) || !is_numeric($_SESSION['totalItems'])) {
        $_SESSION['totalItems'] = 0;
    }
    $_SESSION['totalItems'] += $quantity;

    echo json_encode(['totalItems' => $_SESSION['totalItems']]);
    exit();
}
