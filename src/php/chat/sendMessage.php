<?php
require_once '../db.php';
header('Content-Type: application/json');

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not logged in']);
        exit;
    }

    $content = $_POST['content'] ?? '';
    if (empty($content)) {
        echo json_encode(['success' => false, 'message' => 'Message content is required']);
        exit;
    }

    try {
        $db = connectDB();
        $stmt = $db->prepare("INSERT INTO messages (user_id, content, created_at)
            SELECT :user_id, :content, NOW() FROM users
            WHERE id = :user_id AND is_blocked = false;
");
        $stmt->execute(['user_id' => $_SESSION['user_id'], 'content' => $content]);

        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
