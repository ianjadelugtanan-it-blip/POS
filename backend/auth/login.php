<?php
/**
 * User Login Endpoint
 * Demonstrates:
 * - PDO Prepared Statements
 * - Secure Password Verification with password_verify()
 */

require_once '../config/headers.php';
require_once '../config/db.php';

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';


if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing credentials.']);
    exit;
}

try {
    // 1. Fetch user by username using prepared statement
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    // 2. Verify password
    if ($user && password_verify($password, $user['password'])) {
        // Successful login
        // Remove password from response for security
        unset($user['password']);
        echo json_encode([
            'message' => 'Login successful',
            'user' => $user
        ]);
    } else {
        // generic error message for security (don't reveal if user exists)
        http_response_code(401);
        echo json_encode(['error' => 'Invalid username or password.']);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Login failed: ' . $e->getMessage()]);
}
?>
