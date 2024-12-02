<?php
require_once '../db.php';
header('Content-Type: application/json');

try {
    $db = connectDB();
    $query = "
        SELECT m.id, m.content, m.created_at, m.is_edited, m.user_id, u.username, r.name AS role
        FROM messages m
        JOIN users u ON m.user_id = u.id
        JOIN roles r ON u.role_id = r.id
        ORDER BY m.created_at ASC";
    $stmt = $db->query($query);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $messages]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}