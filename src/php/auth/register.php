<?php
session_start();
require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $db = connectDB();

    try {
        $db->beginTransaction();

        $stmt = $db->prepare("INSERT INTO users (username, password_hash) VALUES (:username, :password)");
        $stmt->execute(['username' => $username, 'password' => $password]);

        $stmt = $db->prepare("SELECT id, role_id FROM users WHERE username = :username");
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role_id'] = $user['role_id'];

            $db->commit();

            echo json_encode(['success' => true, 'message' => 'Registration successful']);
        } else {
            $db->rollBack();
            echo json_encode(['success' => false, 'message' => 'User retrieval failed after registration.']);
        }
    } catch (Exception $e) {
        $db->rollBack();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
