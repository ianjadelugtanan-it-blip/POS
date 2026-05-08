<?php
/**
 * Remove User Endpoint
 * Prevents removing system core accounts.
 */

require_once '../config/headers.php';
require_once '../config/db.php';

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);
$username = $data['username'] ?? '';

if (empty($username) || $username === 'admin' || $username === 'client') {
    http_response_code(400);
    echo json_encode(['error' => 'Cannot remove core system accounts.']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM users WHERE username = ?");
    $stmt->execute([$username]);
    echo json_encode(['message' => 'User access revoked successfully.']);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to remove user.']);
}
?>
