<?php
include_once('../sql_functions.php');
include_once("../auth/jwt.php");
if (session_status() == PHP_SESSION_NONE)
    session_start();

if (validateAccessToken())  {
    // Collect POST parameters
    $address_id =  isset($_POST['id']) ? trim($_POST['id']) : '';
    $address = isset($_POST['address']) ? trim($_POST['address']) : '';
    $zip_code = isset($_POST['zip_code']) ? trim($_POST['zip_code']) : '';
    $city = isset($_POST['city']) ? trim($_POST['city']) : '';
    $country = isset($_POST['country']) ? trim($_POST['country']) : '';
    $box_now = isset($_POST['box_now']) ? trim($_POST['box_now']) : null;


    if ($address_id == '') {
        // Insert New One
        insert('address', ["customer_id", "address",'zip_code','city','country','box_now'],[$_SESSION['user_info']['user_id'], $address,$zip_code,$city,$country,$box_now], false);
    } else {
        // Edit an old one
        $response = update('address', 'id', '=', $address_id,["address",'zip_code','city','country','box_now'],[$address,$zip_code,$city,$country,$box_now],false);
        echo json_encode($response);
        exit();
    }
}

echo json_encode(['info'=>"no_validate"]);
exit();