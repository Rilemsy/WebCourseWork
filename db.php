<?php
$servername = "localhost";
$username = "root";
$password = "3719";
$dbname = "chat_application";
echo "Allo";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) 
{
    die("Connection failed: " . $conn->connect_error);
}
else
{
    echo "Connected";
}