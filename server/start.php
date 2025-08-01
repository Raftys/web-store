<?php
// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Start session if it hasn't started yet
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// 1. Clear all session variables
$_SESSION = [];

// 2. Delete the session cookie if sessions use cookies
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 3. Destroy the session on the server
session_destroy();

// 4. Delete custom authentication cookies (adjust names if necessary)
setcookie('access_token', '', time() - 3600, '/', '', true, true);
setcookie('refresh_token', '', time() - 3600, '/', '', true, true);

// 5. Redirect to main.php (or your homepage)
header("Location: main.php");
exit();
