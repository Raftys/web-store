<?php
include '../Functions/sql_functions.php';
$conn =  connect();
$items = json_encode(load_products($conn));
header('Content-Type: application/json');
echo $items;