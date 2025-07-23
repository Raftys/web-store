<?php
include '../../include/sql_functions.php';

// Get all products
$items = select_all('products');

echo json_encode($items);