<?php
if (session_status() == PHP_SESSION_NONE)
    session_start();
include_once "../../sql_functions.php";
$conn = connect();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['logged_in'] = true;
            $_SESSION['root'] = $user['root'];
            echo json_encode(['status' => 'success']);
            // Stop further execution
        } else
            echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
    } else
        echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
    exit();
}

