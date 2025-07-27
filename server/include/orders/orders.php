<?php
include_once('../sql_functions.php');
include_once("../auth/jwt.php");
if (session_status() == PHP_SESSION_NONE)
    session_start();

if (authProcess()) {
    if ($_POST['action'] ==='fetch') {
        fetchOrders();
    } else if  ($_POST['action'] === 'update_status') {
        updateValue('status');
    } else if ($_POST['action'] === 'update_box_now') {
        updateValue('box_now');
    }
}

echo json_encode(['info'=>"no_validate"]);
exit();

function fetchOrders() {
    if (isset($_SESSION['super_user']) && $_SESSION['super_user'] === '1' && isset($_POST['user']) && $_POST['user']=== 'super') {
        echo json_encode(select_all('orders'));
    } else if(isset($_POST['order_id'])) {
        $orders[0] = select_all_from_id($_POST['order_id'],'orders');
        $orders[1] =  select_value_from_id('order_id',$_POST['order_id'],'order_items');
        echo json_encode($orders);
        exit();
    }
    else {
        echo json_encode(select_value_from_id('user_id',$_SESSION['user_info']['user_id'],'orders'));
    }
    exit();
}

function updateValue($value) {
    $order_id =  isset($_POST['order_id']) ? $_POST['order_id'] : '';
    $data = isset($_POST[$value]) ? $_POST[$value] : '';
    echo json_encode(update('orders','id','=',$order_id,$value,$data,false));
}