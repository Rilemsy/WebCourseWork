<?php
require_once '../db.php';
header('Content-Type: application/json');

try {
    $db = connectDB();
    $query = "
        SELECT u.id, u.username, u.is_blocked, r.name AS role
        FROM users u
        JOIN roles r ON u.role_id = r.id
        ORDER BY 
            u.is_blocked ASC,       -- Сначала пользователи без блокировки
            FIELD(u.role_id, 3, 2, 1), -- Роли в порядке admin, moderator, user
            u.username ASC          -- Сортировка по имени в алфавитном порядке
    ";
    $stmt = $db->query($query);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $users]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}