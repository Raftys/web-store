<?php
header('Content-Type: application/json');

// Database connection (assume you have set up your DB connection here)
include_once '../sql_functions.php';  // Adjust the path as necessary

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

$customer_id = $data['customer_id'];
$box_now = $data['box_now'];

$conn = connect();
// Prepare and execute the update statement
$sql = "UPDATE customers SET box_now = ? WHERE id = ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("si", $box_now, $customer_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Box Now Locker ID updated successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No changes made.']);
    }
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement.']);
}

$conn->close();