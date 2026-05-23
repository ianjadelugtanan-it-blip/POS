<?php
/**
 * Password Reset Utility
 * Updates default users ('admin' and 'client') to use plain-text 'admin' and 'client' passwords.
 */
require_once 'config/db.php';

try {
    $admin_hash = password_hash('admin', PASSWORD_BCRYPT);
    $client_hash = password_hash('client', PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE username = 'admin'");
    $stmt->execute([$admin_hash]);

    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE username = 'client'");
    $stmt->execute([$client_hash]);

    echo json_encode(["status" => "success", "message" => "Passwords reset: admin -> admin, client -> client"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
