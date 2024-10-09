<?php
// update_order_status.php
header('Content-Type: application/json');

require_once '../sql_functions.php'; // Include your database connection functions
$conn = connect(); // Connect to the database

$data = json_decode(file_get_contents('php://input'), true); // Get the POST data
$order_id = $data['order_id'];
$status = $data['status'];

// Prepare and execute the update statement
$sql = "UPDATE orders SET status = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $status, $order_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Status updated successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error updating status.']);
}

$stmt->close();
$conn->close();