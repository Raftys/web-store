<?php
// Include SQL helper and JWT handling functions
include_once "../sql_functions.php";
include_once "jwt.php";

// Start the session if it hasn't been started yet
if (session_status() == PHP_SESSION_NONE)
    session_start();

// Check for POST request and route to the correct action
if ($_POST['action'] === 'login') {
    login();
}

if ($_POST['action'] === 'signup') {
    signup();
}

echo "No Action Selected";
exit();

// Function to handle user login
function login() {
    // Get email and password from POST request
    $email = $_POST['Email'];
    $password = $_POST['Password'];

    // Query the database for the user by email
    $user = get("users","email","=",$email,['id','password','super_user'],false);

    // Check if user exists
    if(count($user) === 3) {
        // Verify the password
        if (password_verify($password, $user['password'])) {
            // Set tokens and mark user as logged in
            setTokens($user['id']);
            $_SESSION['logged_in']= true;
            $_SESSION['super_user'] = $user['super_user'];
            echo json_encode(['status' => 'success']);
        } else {
            // Invalid password
            echo json_encode(['status' => 'error', 'message' => 'error_invalid_email_password']);
        }
    } else {
        // User not found
        echo json_encode(['status' => 'error', 'message' => 'error_invalid_email_password']);
    }
    exit();
}

// Function to handle user signup
function signup() {

    // Get all form values from POST
    $full_name = $_POST['Full_Name'];
    $email = $_POST['Email'];
    $phone = $_POST['Phone_Number'];
    $password_1 = $_POST['Password'];

    // Hash the password securely
    $password = password_hash($password_1, PASSWORD_DEFAULT);

    // Check if email already exists in the database
    $result = get("users", "email","=",$email,"email",false);
    if (count($result) > 0) {
        // Email is already in use
        echo "Email already exists: ", count($result);
        exit();
    }

    // Insert new customer into the database
    $sql_customer = "INSERT INTO users (full_name, email, phone, password, is_user) VALUES (?, ?, ?, ?, ?)";
    $customer_id = doQuery($sql_customer, "ssssi", $full_name, $email, $phone, $password, 0);

    // Set tokens and mark user as logged in
    setTokens($customer_id);
    $_SESSION['logged_in']= true;

    // Return success response
    echo json_encode(['status' => 'success']);

    exit();
}
