<?php
require 'dbconnect.php';  // Database connection

// Get user input
$username = $_POST['username'];
$password = $_POST['password'];

// Hash the password for security
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Check if username already exists
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) 
{
    // Username already exists
    echo "Username already taken. <a href='register.html'>Try a different one</a>";
} 

else 
{
    // Insert new user into the database
    $stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, 'user')");
    $stmt->bind_param("ss", $username, $hashedPassword);
    $stmt->execute();

    echo "Registration successful! <a href='login.html'>Login</a>";
}