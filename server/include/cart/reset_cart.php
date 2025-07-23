<?php
if (session_status() == PHP_SESSION_NONE)
    session_start();

// Reset cart session variables
$_SESSION['cart'] = [];
$_SESSION['totalItems'] = 0;

// Redirect to main.php after resetting the cart
exit();
