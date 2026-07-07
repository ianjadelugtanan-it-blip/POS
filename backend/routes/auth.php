<?php
/**
 * Auth Route Handlers
 * - handle_login(PDO)
 * - handle_register(PDO)
 */

function handle_login(PDO $pdo): void
{
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing credentials.']);
        return;
    }

    try {
        // Fetch user by username using prepared statement
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        // Verify password
        if ($user && password_verify($password, $user['password'])) {
            // Remove password from response for security
            unset($user['password']);
            echo json_encode([
                'message' => 'Login successful',
                'user'    => $user
            ]);
        } else {
            // Generic error — don't reveal if user exists
            http_response_code(401);
            echo json_encode(['error' => 'Invalid username or password.']);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Login failed: ' . $e->getMessage()]);
    }
}

function handle_register(PDO $pdo): void
{
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';
    $role     = $data['role'] ?? 'client';

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Username and password are required.']);
        return;
    }

    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
        $stmt->execute([$username, $hashed_password, $role]);

        http_response_code(201);
        echo json_encode(['message' => 'User registered successfully.']);
    } catch (\PDOException $e) {
        if ($e->getCode() == 23000) {
            http_response_code(409);
            echo json_encode(['error' => 'Username already exists.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Registration failed: ' . $e->getMessage()]);
        }
    }
}
