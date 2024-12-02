<?php
require_once '../db.php';
header('Content-Type: application/json');

session_start();

if (isset($_SESSION['user_id'])) {
    try {
        $db = connectDB();
        $stmt = $db->prepare("
            SELECT u.id, u.username, u.is_blocked, r.name AS role
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = :user_id
        ");
        $stmt->execute(['user_id' => $_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Проверка на блокировку пользователя
            if ($user['is_blocked']) {
                echo json_encode(['success' => false, 'message' => 'User is blocked']);
                exit;
            }

            echo json_encode([
                'success' => true,
                'data' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'role' => $user['role'],
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
}
