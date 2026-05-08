<?php
/**
 * User Registration Endpoint
 * Demonstrates: 
 * - Secure header implementation
 * - Reading JSON payload
 * - PDO Prepared Statements
 * - Secure Password Hashing
 */

require_once '../config/headers.php';
require_once '../config/db.php';

// 1. Read the JSON payload from the frontend
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// 2. Validate and sanitize input
$username = filter_var($data['username'] ?? '', FILTER_SANITIZE_STRING);
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'client';

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Username and password are required.']);
    exit;
}

// 3. Hash the password securely
$hashed_password = password_hash($password, PASSWORD_BCRYPT);

try {
    // 4. Use Prepared Statements to prevent SQL Injection
    $stmt = $pdo->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
    $stmt->execute([$username, $hashed_password, $role]);

    http_response_code(201);
    echo json_encode(['message' => 'User registered successfully.']);
} catch (\PDOException $e) {
    if ($e->getCode() == 23000) { // Duplicate entry code
        http_response_code(409);
        echo json_encode(['error' => 'Username already exists.']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Registration failed: ' . $e->getMessage()]);
    }
}
?>
