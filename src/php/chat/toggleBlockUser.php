<?php
session_start();
require_once '../db.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['userId'])) {
    $userId = intval($data['userId']);

    try {
        $db = connectDB();

        $userRole = $db->prepare("SELECT role_id FROM users WHERE id = :userId");
        $userRole->execute(['userId' => $userId]);
        $roleIdFetch = $userRole->fetchColumn();
        $roleId = intval($roleIdFetch);
        $curRoleId = intval($_SESSION['role_id']);

        //Проверка возможности блокировки
        if ($curRoleId <= $roleId){
            echo json_encode(['success' => false, 'message' => "Not enough rank"]);
            exit;
        }

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
