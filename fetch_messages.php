<?php
require 'dbconnect.php';
error_reporting(E_ALL);
$query = "SELECT messages.id, messages.user_id, users.username, messages.message 
          FROM messages 
          JOIN users ON messages.user_id = users.id 
          ORDER BY messages.timestamp ASC";

$result = $conn->query($query);
//var_dump($result);
$messages = [];
while ($row = $result->fetch_assoc()) {
    $messages[] = $row;
}

header('Content-Type: application/json');
echo json_encode($messages);
?>
