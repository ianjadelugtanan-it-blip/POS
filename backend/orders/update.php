<?php
/**
 * Update Order Endpoint
 */

require_once '../config/headers.php';
require_once '../config/db.php';

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$id = $data['id'] ?? '';
$status = $data['status'] ?? null;
$eta = $data['estimatedArrival'] ?? null;

if (empty($id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Order ID is required.']);
    exit;
}

try {
    $sql = "UPDATE orders SET ";
    $params = [];
    $updates = [];

    if ($status) {
        $updates[] = "status = ?";
        $params[] = $status;
    }
    if ($eta) {
        $updates[] = "estimated_arrival = ?";
        $params[] = $eta;
    }

    if (empty($updates)) {
        echo json_encode(['message' => 'No changes made.']);
        exit;
    }

    $sql .= implode(', ', $updates) . " WHERE id = ?";
    $params[] = $id;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['message' => 'Order updated successfully.']);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update order.']);
}
?>
