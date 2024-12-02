<?php
require_once '../db.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['messageId'])) {
    $messageId = intval($data['messageId']);

    try {
        $db = connectDB();
        $stmt = $db->prepare("DELETE FROM messages WHERE id = :messageId");
        $stmt->execute(['messageId' => $messageId]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
