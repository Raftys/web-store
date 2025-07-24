<?php
if (session_status() == PHP_SESSION_NONE)
    session_start();
// Define the default page
$page = isset($_GET['page']) ? $_GET['page'] : 'home';

// Include the header file
include_once('include/sql_functions.php');
include_once("include/auth/jwt.php");

// Connect to database.
connect();

$accessToken = isset($_COOKIE['access_token']) ? $_COOKIE['access_token'] : null;

if ($accessToken && validateAccessToken($accessToken)) {
    $_SESSION['logged_in'] = true;
    $_SESSION['user_info'] = decodeAccessToken($accessToken);
}

include('pages/root/header.html');

// Load content based on the page parameter
if ($page === 'shop') {
    include('pages/shop/shop.html');
} elseif ($page === 'home') {
    include('pages/root/home.html');
} elseif ($page === 'login') {
    include('pages/auth/login.html');
} elseif ($page === 'signup') {
    include('pages/auth/signup.html');
} elseif ($page === 'account') {
    include('pages/profile/account.html');
} elseif ($page === 'cart') {
    include('pages/cart/cart.html');
} elseif ($page === 'orders') {
    include('pages/orders/orders.html');
} elseif ($page === 'order_info') {
    include('pages/orders/order_info.html');
} elseif ($page === 'product') {
    include('pages/shop/preview_product.html');
}
else {
    // Fallback if the page does not match
    echo "<h2>404 Not Found</h2><p>The page you're looking for does not exist.</p>";
}
include('pages/root/footer.html');

