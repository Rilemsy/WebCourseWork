<?php
$GLOBALS['DB_HOST'] = getenv('DB_HOST') ?: 'localhost';
$GLOBALS['DB_NAME'] = getenv('DB_NAME') ?: 'default_db';
$GLOBALS['DB_USER'] = getenv('DB_USER') ?: 'root';
$GLOBALS['DB_PASSWORD'] = getenv('DB_PASSWORD') ?: 'root';
?>
