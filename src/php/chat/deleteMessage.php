<?php
session_start();
require_once '../db.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['messageId'])) {
    $messageId = intval($data['messageId']);
    try {
        $db = connectDB();
        $stmt = $db->prepare("DELETE FROM messages WHERE id = :messageId AND (user_id = :curUserId OR EXISTS(SELECT 1 FROM users u WHERE u.id = :curUserId AND (u.role_id = 3 OR u.role_id = 2)))");
        $stmt->execute(['messageId' => $messageId, 'curUserId' => $_SESSION['user_id']]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
