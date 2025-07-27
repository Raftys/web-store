<?php
include_once('../sql_functions.php');
include_once("../auth/jwt.php");
if (session_status() == PHP_SESSION_NONE)
    session_start();
if (authProcess()) {
    if($_POST['action']=="update"){
        updateUser();
    } else if($_POST['action']=="fetch_all"){
        fetchUserAllAddress();
    } else if($_POST['action']=="fetch_one"){
        fetchUserOneAddress();
    } else if($_POST['action']=="update_address"){
        updateAddress();
    }
}


echo json_encode(['info'=>"no_validate"]);
exit();



function updateUser() {
    $full_name =  isset($_POST['full_name']) ? trim($_POST['full_name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $projection_keys = ['full_name', 'email', 'phone'];
    $projection_values = [$full_name, $email, $phone];
    $response = update('users', 'id', '=', $_SESSION['user_info']['user_id'],$projection_keys,$projection_values,false);
    echo json_encode($response);
    exit();
}

function fetchUserAllAddress() {
    $user_info = select_all_from_id($_SESSION['user_info']['user_id'],'users');
    $address = select_value_from_id('customer_id' ,$_SESSION['user_info']['user_id'],'addresses');
    echo json_encode(['user'=>$user_info,'address'=>$address]);
    exit();
}

function fetchUserOneAddress() {
    $user_address[0] = select_all_from_id($_POST['user_id'],'users');
    $user_address[1]  = select_all_from_id($_POST['address_id'],'addresses');
    echo json_encode($user_address);
    exit();
}

function updateAddress() {
    // Collect POST parameters
    $address_id =  isset($_POST['id']) ? trim($_POST['id']) : '';
    $address = isset($_POST['address']) ? trim($_POST['address']) : '';
    $zip_code = isset($_POST['zip_code']) ? trim($_POST['zip_code']) : '';
    $city = isset($_POST['city']) ? trim($_POST['city']) : '';
    $country = isset($_POST['country']) ? trim($_POST['country']) : '';
    $box_now = isset($_POST['box_now']) ? trim($_POST['box_now']) : null;


    if ($address_id == '') {
        // Insert New One
        insert('addresses', ["customer_id", "address",'zip_code','city','country','box_now'],[$_SESSION['user_info']['user_id'], $address,$zip_code,$city,$country,$box_now], false);
    } else {
        // Edit an old one
        $response = update('addresses', 'id', '=', $address_id,["address",'zip_code','city','country','box_now'],[$address,$zip_code,$city,$country,$box_now],false);
        echo json_encode($response);
        exit();
    }
}