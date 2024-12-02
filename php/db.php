<?php
require_once 'config.php';

function connectDB() {
    try {
        $dsn = "mysql:host=$GLOBALS['DB_HOST'];dbname=$GLOBALS['DB_NAME'];charset=utf8";
        $pdo = new PDO($dsn, $GLOBALS['DB_USER'], $GLOBALS['DB_PASSWORD']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }
}
?>
