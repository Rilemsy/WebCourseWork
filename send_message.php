<?php
session_start();
require 'dbconnect.php';

// Check if user is logged in and not blocked
if (!isset($_SESSION['user_id']) || $_SESSION['is_blocked']) {
    //echo json_encode("You aren't able to send messages.");
    die("You aren't able to send messages.");
}

$data = json_decode(file_get_contents('php://input'), true);
$message = $data['message'];
$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("INSERT INTO messages (user_id, message) VALUES (?, ?)");
$stmt->bind_param("is", $user_id, $message);
$stmt->execute();