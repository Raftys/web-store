<?php

include "../sql_functions.php";
include_once("../auth/jwt.php");
if (session_status() == PHP_SESSION_NONE)
    session_start();

$city = '';
$zip_code = '';
$country = '';
$box_now = '';
$address = '';

// User Info
$full_name = isset($_POST['full_name']) ? $_POST['full_name'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$phone = isset($_POST['phone']) ? $_POST['phone'] : '';

// Address Info
if (!isset($_POST['address_id'])) {
    $address = isset($_POST['address']) ? $_POST['address'] : '';
    $city = isset($_POST['city']) ? $_POST['city'] : '';
    $zip_code = isset($_POST['zip_code']) ? $_POST['zip_code'] : '';
    $country = isset($_POST['country']) ? $_POST['country'] : '';
    $box_now = isset($_POST['box_now']) ? $_POST['box_now'] : '';
}

// Price Info
$sub_total = isset($_POST['sub_total']) ? $_POST['sub_total'] : '';
$coupon = isset($_POST['coupon']) ? $_POST['coupon'] : '';
$shipping = isset($_POST['shipping']) ? $_POST['shipping'] : '';
$total_price = isset($_POST['total_price']) ? floatval($_POST['total_price']) : '';

// Payment Info
$payment_method = isset($_POST['payment_method']) ? $_POST['payment_method'] : '';
$receipt = isset($_POST['receipt']) ? $_POST['receipt'] : '';

$status = 'pending';
$user_info = '';

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    $accessToken = isset($_COOKIE['access_token']) ? $_COOKIE['access_token'] : " ";

    if (validateAccessToken()) {
        $user_info = select_all_from_id($_SESSION['user_info']['user_id'],'users');
        $address =  $_POST['address_id'];
    } else {
        exit();
    }
}

$insert_keys = ['order_date','sub_total','coupon','shipping','total_price','payment_method','receipt','status'];
$insert_values = [date("Y-m-d H:i:s"),$sub_total,$coupon,$shipping,$total_price,$payment_method,$receipt,$status];
if ($user_info != '') {
    $insert_keys[] = 'user_id';
    $insert_values[] = $user_info['id'];
    if ($user_info['full_name'] !== $full_name) {
        $insert_keys[] = 'full_name';
        $insert_values[] = $full_name;
    }
    if ($user_info['email'] !== $email) {
        $insert_keys[] = 'email';
        $insert_values[] = $email;
    }
    if ($user_info['phone'] !== $phone) {
        $insert_keys[] = 'phone';
        $insert_values[] = $phone;
    }
    $insert_keys[] = 'address_id';
    $insert_values[] = $address;
} else {
    array_push($insert_keys, 'full_name', 'email', 'phone','address','zip_code','city','country','box_now');
    array_push($insert_values, $full_name, $email, $phone,$address,$zip_code,$city,$country,$box_now );
}

$order_id = insert('orders',$insert_keys,$insert_values);

foreach ($_SESSION['cart'] as $key_item => $item) {
    $insert_keys_items = ['order_id','product_id','price','quantity','total'];
    $insert_values_items =[];
    $insert_values_items[] = $order_id;
    foreach ($item as $key => $value) {
        if ($key == 'id') {
            $insert_values_items[] = $value;
        }
        if ($key == 'price') {
            $insert_values_items[] = $value;
        } else if($key == 'quantity') {
            $insert_values_items[] = $value;
        }
    }
    $insert_values_items[] = $insert_values_items[2] * $insert_values_items[3];
    $order_item = insert('order_items',$insert_keys_items,$insert_values_items);

    // Reset
    $insert_keys_items = [];
    $insert_values_items = [];
}

echo json_encode("Done");
exit();
