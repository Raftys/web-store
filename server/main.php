<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE)
    session_start();

// Define the default page (use 'home' if no page parameter is set)
$page = isset($_GET['page']) ? $_GET['page'] : 'home';

// Include database and authentication helper functions
include_once('include/sql_functions.php');
include_once("include/auth/jwt.php");

// Connect to the database
connect();

// Run authentication process (checks and setups)
authProcess();

// Include the header HTML for all pages
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
    include('pages/profile/profile.html');
} elseif ($page === 'cart') {
    include('pages/cart/cart.html');
} elseif ($page === 'orders') {
    include('pages/orders/orders.html');
} elseif ($page === 'order_info') {
    include('pages/orders/order_info.html');
} elseif ($page === 'product') {
    include('pages/shop/preview_product.html');
} elseif ($page === 'help') {
    include('pages/settings/help.html');
} elseif ($page === 'privacy') {
    include('pages/settings/privacy_policy.html');
} elseif ($page === 'term') {
    include('pages/settings/term_of_service.html');
} else {
    // Show 404 message if no matching page found
    echo "<h2>404 Not Found</h2><p>The page you're looking for does not exist.</p>";
}

// Include the footer HTML for all pages
include('pages/root/footer.html');
