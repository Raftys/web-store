<?php
include_once('../sql_functions.php');
include_once("../auth/jwt.php");
if (session_status() == PHP_SESSION_NONE)
    session_start();

$accessToken = isset($_COOKIE['access_token']) ? $_COOKIE['access_token'] : " ";

if (validateAccessToken($accessToken)) {
    $user_info = select_all_from_id($_SESSION['user_info']['user_id'],'customers');
    $address = select_value_from_id('customer_id' ,$_SESSION['user_info']['user_id'],'address');
    echo json_encode(['user'=>$user_info,'address'=>$address]);
    exit();
}
echo json_encode(new stdClass());
exit();