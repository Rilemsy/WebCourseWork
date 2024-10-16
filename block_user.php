<?php
session_start();
require 'dbconnect.php';

if ($_SESSION['role'] != 'moderator') {
    die("Access denied.");
}

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];

// $query = "SELECT messages.timestamp ,users.username, messages.message 
//           FROM messages 
//           JOIN users ON messages.user_id = users.id 
//           ORDER BY messages.timestamp ASC";
// $result = $conn->query($query);

// $row = $result->fetch_assoc();
// if ($row["username"] != "user") {
//     die("Only user can be blocked.");
// }

$role = "user";
$stmt = $conn->prepare("UPDATE users SET is_blocked = 1 WHERE username = ? AND role = ?");
$stmt->bind_param("ss", $username, $role);

if(!$stmt->execute()){
    die("Error". $stmt->error);
}
if($stmt->affected_rows == 1){
    echo json_encode("$username was blocked successfully.");
}
else{
    echo json_encode("Failed to block $username.");
}