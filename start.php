<?php
session_start();

// Check if this is the first visit or if the session was previously cleaned
if (!isset($_SESSION['session_cleaned'])) {
    // Perform session cleanup
    session_unset(); // Clear all session variables
    session_destroy(); // Destroy the session

    // Set a flag in a new session to indicate that cleanup has been done
    $_SESSION['session_cleaned'] = true;

    // Optionally, set a cookie that lasts for the current session
    setcookie("session_cleaned", "true", time() + 3600); // Cookie lasts for 1 hour

    // Redirect to main.php to avoid re-running this code
    header("Location: main.php");
    exit();
}