<?php
session_start();
require 'dbconnect.php';

if (!isset($_SESSION['user_id']) || $_SESSION['is_blocked']) {
    http_response_code(403); // Forbidden
    die("Access denied.");
}

$message_id = $_POST['message_id'];
$new_message = $_POST['new_message'];
$user_id = $_SESSION['user_id'];

// Check if the message belongs to the logged-in user
$stmt = $conn->prepare("SELECT * FROM messages WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $message_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Update the message
    $updateStmt = $conn->prepare("UPDATE messages SET message = ? WHERE id = ?");
    $updateStmt->bind_param("si", $new_message, $message_id);
    $updateStmt->execute();
    echo "Message updated successfully.";
} else {
    http_response_code(403);
    echo "You do not have permission to edit this message.";
}
?>
