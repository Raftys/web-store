<?php
include_once('../sql_functions.php');
include_once("../auth/jwt.php");

if (session_status() == PHP_SESSION_NONE)
    session_start();

// Authenticate user session and perform action based on POST 'action'
if (authProcess()) {
    if ($_POST['action'] === 'fetch') {
        fetchOrders();
    } else if ($_POST['action'] === 'update_status') {
        updateValue('status');
    } else if ($_POST['action'] === 'update_box_now') {
        updateValue('box_now');
    }
}

// If no valid auth or action, respond with no_validate
echo json_encode(['info' => "no_validate"]);
exit();

// Fetch orders based on user privileges and request parameters
function fetchOrders() {
    // If superuser requests all orders
    if (isset($_SESSION['super_user']) && $_SESSION['super_user'] === '1' && isset($_POST['user']) && $_POST['user'] === 'super') {
        echo json_encode(select_all('orders'));
    }
    // Fetch specific order details by order_id
    else if (isset($_POST['order_id'])) {
        $orders[0] = select_all_from_id($_POST['order_id'], 'orders');            // Order main info
        $orders[1] = select_value_from_id('order_id', $_POST['order_id'], 'order_items'); // Items of the order
        echo json_encode($orders);
        exit();
    }
    // Fetch orders for the logged-in user
    else {
        echo json_encode(select_value_from_id('user_id', $_SESSION['user_info']['user_id'], 'orders'));
    }
    exit();
}

// Update a given column value for an order record
function updateValue($value) {
    $order_id = isset($_POST['order_id']) ? $_POST['order_id'] : '';
    $data = isset($_POST[$value]) ? $_POST[$value] : '';
    echo json_encode(update('orders', 'id', '=', $order_id, $value, $data, false));
}
