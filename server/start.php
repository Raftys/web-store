<?php
// Always start with error reporting (for debugging, you can remove later)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Start session if not active yet
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// 1. Clear all session variables
$_SESSION = array();

// 2. Delete the session cookie itself, if any
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 3. Destroy the session on the server
session_destroy();

// 4. Delete your custom cookies (adjust names if needed)
setcookie('access_token', '', time() - 3600, '/', '', true, true);
setcookie('refresh_token', '', time() - 3600, '/', '', true, true);

// 5. Redirect to main.php
header("Location: main.php");
exit();
