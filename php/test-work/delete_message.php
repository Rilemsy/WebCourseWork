<?php
session_start();
require 'dbconnect.php';

if (!isset($_SESSION['user_id']) || $_SESSION['is_blocked']) {
    http_response_code(403); // Forbidden
    die("Access denied.");
}

$message_id = $_POST['message_id'];
$user_id = $_SESSION['user_id'];

// Check if the message belongs to the logged-in user
$stmt = $conn->prepare("SELECT * FROM messages WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $message_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Delete the message
    $deleteStmt = $conn->prepare("DELETE FROM messages WHERE id = ?");
    $deleteStmt->bind_param("i", $message_id);
    $deleteStmt->execute();
    echo "Message deleted successfully.";
} else {
    http_response_code(403);
    echo "You do not have permission to delete this message.";
}
?>
