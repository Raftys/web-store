<?php
include_once('../sql_functions.php');
include_once("../auth/jwt.php");
if (session_status() == PHP_SESSION_NONE)
    session_start();

$accessToken = isset($_COOKIE['access_token']) ? $_COOKIE['access_token'] : " ";

if (validateAccessToken() && $_SESSION['user_info']['user_id'] === $_POST['user_id']) {
    $user_address[0] = select_all_from_id($_POST['user_id'],'customers');
    $user_address[1]  = select_all_from_id($_POST['address_id'],'address');
    echo json_encode($user_address);
    exit();
}


echo json_encode(['info'=>"no_validate"]);
exit();