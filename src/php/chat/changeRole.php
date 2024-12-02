<?php
require_once '../db.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['userId'], $data['newRole'])) {
    $userId = intval($data['userId']);
    $newRole = $data['newRole'];

    try {
        $db = connectDB();
        $stmt = $db->prepare("UPDATE users SET role_id = (SELECT id FROM roles WHERE name = :newRole) WHERE id = :userId");
        $stmt->execute(['newRole' => $newRole, 'userId' => $userId]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
