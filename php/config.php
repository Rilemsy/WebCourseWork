<?php
$env = parse_ini_file(__DIR__ . '/../.env');
$GLOBALS['DB_HOST'] = $env['DB_HOST'];
$GLOBALS['DB_NAME'] = $env['DB_NAME'];
$GLOBALS['DB_USER'] = $env['DB_USER'];
$GLOBALS['DB_PASSWORD'] = $env['DB_PASSWORD'];
?>
