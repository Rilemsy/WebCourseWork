<?php
require_once '../db.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['messageId'], $data['content'])) {
    $messageId = intval($data['messageId']);
    $content = $data['content'];

    try {
        $db = connectDB();
        $stmt = $db->prepare("UPDATE messages SET content = :content, is_edited = TRUE WHERE id = :messageId");
        $stmt->execute(['content' => $content, 'messageId' => $messageId]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
