<?php
include_once('../sql_functions.php');
include_once("../auth/jwt.php");
if (session_status() == PHP_SESSION_NONE)
    session_start();

if (validateAccessToken()) {
    $full_name =  isset($_POST['full_name']) ? trim($_POST['full_name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $projection_keys = ['full_name', 'email', 'phone'];
    $projection_values = [$full_name, $email, $phone];
    $response = update('customers', 'id', '=', $_SESSION['user_info']['user_id'],$projection_keys,$projection_values,false);
    echo json_encode($response);
    exit();
}

echo json_encode(['info'=>"no_validate"]);
exit();