<?php
session_start();
require 'dbconnect.php';

$username = $_POST['username'];
$password = $_POST['password'];

$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);                                          // s - string
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) 
{
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['is_blocked'] = $user['is_blocked'];
    switch($user['role'])
    {
        case 'user': 
            header("Location: user.html");
            break;
        case 'moderator': 
            header("Location: moderator.html");
            break;
        case 'admin': 
            header("Location: admin.html");
            break;
        default:
            header("Location: guest.html");
    }
} 
else 
{
    echo "Invalid credentials";
}