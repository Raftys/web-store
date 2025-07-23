<?php
include_once('../sql_functions.php');
if (session_status() == PHP_SESSION_NONE)
    session_start();

if (isset($_POST['coupon'])) {
    $coupon = "'" . $_POST['coupon'] . "'";

    // Check if coupon exists
    $info = select_value_from_id('code', $coupon,'coupons');
    if ($info) {
        echo json_encode(['info' => $info]);
        exit();
    }
}
echo json_encode(['info' => 'no coupon']);
exit();
