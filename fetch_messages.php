<?php
require 'db.php';  // Connection to the database

$query = "SELECT messages.timestamp ,users.username, messages.message 
          FROM messages 
          JOIN users ON messages.user_id = users.id 
          ORDER BY messages.timestamp ASC";
$result = $conn->query($query);

$messages = [];
while($row = $result->fetch_assoc()) {
    $messages[] = $row;
}

echo json_encode($messages);
