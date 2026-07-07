<?php
/**
 * Users Route Handlers
 * - handle_users_get(PDO)
 * - handle_users_remove(PDO)
 */

function handle_users_get(PDO $pdo): void
{
    try {
        $stmt  = $pdo->query("SELECT id, username, role FROM users");
        $users = $stmt->fetchAll();
        echo json_encode($users);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch users.']);
    }
}

function handle_users_remove(PDO $pdo): void
{
    $json_data = file_get_contents('php://input');
    $data      = json_decode($json_data, true);
    $username  = $data['username'] ?? '';

    if (empty($username) || $username === 'admin' || $username === 'client') {
        http_response_code(400);
        echo json_encode(['error' => 'Cannot remove core system accounts.']);
        return;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM users WHERE username = ?");
        $stmt->execute([$username]);
        echo json_encode(['message' => 'User access revoked successfully.']);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to remove user.']);
    }
}
