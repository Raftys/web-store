<?php
$host = 'localhost';
$db = 'products';
$user = 'root'; // or your MySQL username
$pass = 'root'; // your MySQL password

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else {
    echo "Connected successfully";
}

// Define the default page
$page = isset($_GET['page']) ? $_GET['page'] : 'home';
// Include the header file
include('Header/header.html');

// Load content based on the page parameter
if ($page === 'shop') {
    // Include the shop page
    include('Shop/shop.html'); // Make sure this file exists and is in the correct path
} elseif ($page === 'home') {
    // Default to home page content
    include('Home/home.html'); // Make sure this file exists and is in the correct path
} else {
    // Fallback if the page does not match
    echo "<h2>404 Not Found</h2><p>The page you're looking for does not exist.</p>";
}

