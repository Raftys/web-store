<?php
include_once('../sql_functions.php');
include_once("../auth/jwt.php");
if (session_status() == PHP_SESSION_NONE)
    session_start();

$accessToken = isset($_COOKIE['access_token']) ? $_COOKIE['access_token'] : " ";

if (validateAccessToken()) {
    $orders = [];
    if (isset($_POST['order_id'])) {
        $orders[0] = select_all_from_id($_POST['order_id'],'orders');
        $orders[1] =  select_value_from_id('order_id',$_POST['order_id'],'order_items');
        echo json_encode($orders);
        exit();
    }
    $result = select_value_from_id('user_id',$_SESSION['user_info']['user_id'],'orders');
    foreach ($result as $order_row) {
        // Initialize with order info at index 0
        $order_id = $order_row["id"];
        $orders[] = $order_row;
    }
    echo json_encode($orders);
    exit();
}

echo json_encode(['info'=>"no_validate"]);
exit();