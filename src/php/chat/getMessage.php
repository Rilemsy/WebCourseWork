<?php
require_once '../db.php';
header('Content-Type: application/json');

try {
    $db = connectDB();
    
    if (isset($_GET['messageId']) && is_numeric($_GET['messageId'])) {
        $messageId = (int)$_GET['messageId'];
        
        $query = "
            SELECT m.id, m.content, m.created_at, m.is_edited, m.user_id, u.username, u.is_blocked, r.name AS role
            FROM messages m
            JOIN users u ON m.user_id = u.id
            JOIN roles r ON u.role_id = r.id
            WHERE m.id = :messageId";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':messageId', $messageId, PDO::PARAM_INT);
        $stmt->execute();
        $message = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($message) {
            echo json_encode(['success' => true, 'data' => $message]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Message not found.']);
        }
    } 
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
