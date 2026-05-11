<?php
/**
 * Database Connection Script
 * Uses PDO for secure database interactions.
 * Error handling is set to throw exceptions for robust error catching.
 */

$host = '127.0.0.1';
$db   = 'pos_db'; // Ensure you create this database in PHPMyAdmin
$user = 'root';   // XAMPP default
$pass = '';       // XAMPP default
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Strictly set to throw exceptions
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // In production, don't reveal the specific error message to the user
    // For now, we'll output JSON for the API to consume
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
?>
