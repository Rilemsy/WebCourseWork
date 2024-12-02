<?php
session_start();
require 'dbconnect.php';

if ($_SESSION['role'] != 'admin') {
    die("Access denied.");
}

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$role = "user";
$stmt = $conn->prepare("UPDATE users SET role = 'moderator' WHERE username = ? AND role = ?");
$stmt->bind_param("ss", $username, $role);
$stmt->execute();

if(!$stmt->execute()){
    die("Error". $stmt->error);
}
if($stmt->affected_rows == 1){
    echo json_encode("$username was assigned to be moderator successfully.");
}
else{
    echo json_encode("Failed to assigned $username to be moderator.");
}