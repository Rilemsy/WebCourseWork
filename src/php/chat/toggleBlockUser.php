<?php
require_once '../db.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['userId'])) {
    $userId = intval($data['userId']);

    try {
        $db = connectDB();
        $stmt = $db->prepare("UPDATE users SET is_blocked = NOT is_blocked WHERE id = :userId");
        $stmt->execute(['userId' => $userId]);

        $isBlocked = $db->prepare("SELECT is_blocked FROM users WHERE id = :userId");
        $isBlocked->execute(['userId' => $userId]);
        $status = $isBlocked->fetchColumn();

        echo json_encode(['success' => true, 'isBlocked' => $status]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
