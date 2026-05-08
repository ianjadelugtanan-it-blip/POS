<?php
/**
 * Get Users Endpoint
 */

require_once '../config/headers.php';
require_once '../config/db.php';

try {
    $stmt = $pdo->query("SELECT id, username, role FROM users");
    $users = $stmt->fetchAll();
    echo json_encode($users);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch users.']);
}
?>
