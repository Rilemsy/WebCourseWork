<?php
session_start();
require 'db.php';

if ($_SESSION['role'] != 'admin') {
    die("Access denied.");
}

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];

$stmt = $conn->prepare("UPDATE users SET role = 'moderator' WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
