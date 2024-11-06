<?php
if (session_status() == PHP_SESSION_NONE)
    session_start();
include "../Functions/sql_functions.php";
$user_id = $_SESSION['user_id'];
$new_full_name = $_POST['full_name'];
$new_email = $_POST['email'];
$new_phone = $_POST['phone'];
$new_address = $_POST['address'];
$new_city = $_POST['city'];
$new_zip_code = $_POST['zip_code'];
$new_country = $_POST['country'];
$new_box_now = $_POST['box_now'];


// Create connection
$conn = connect();
update_table('users',$user_id,$new_full_name, $new_email, $new_phone, $new_address, $new_city, $new_zip_code, $new_country, $new_box_now);
echo json_encode("Done");
exit();

