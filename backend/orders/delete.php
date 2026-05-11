<?php
/**
 * Delete Order Endpoint
 */

require_once '../config/headers.php';
require_once '../config/db.php';

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);
$id = $data['id'] ?? '';

if (empty($id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Order ID is required.']);
    exit;
}

try {
    // order_items will be deleted automatically due to ON DELETE CASCADE
    $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Order record removed.']);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete order record.']);
}
?>
