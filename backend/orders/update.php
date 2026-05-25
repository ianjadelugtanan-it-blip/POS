<?php
/**
 * Update Order Endpoint
 */

require_once '../config/headers.php';
require_once '../config/db.php';

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$id = $data['id'] ?? '';
$status = isset($data['status']) ? trim(strtolower($data['status'])) : null;
$eta = $data['estimatedArrival'] ?? null;
$declineReason = $data['declineReason'] ?? null;


if (empty($id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Order ID is required.']);
    exit;
}

try {
    $pdo->beginTransaction();

    $statusStmt = $pdo->prepare("SELECT status FROM orders WHERE id = ?");
    $statusStmt->execute([$id]);
    $currentOrder = $statusStmt->fetch();

    if (!$currentOrder) {
        http_response_code(404);
        echo json_encode(['error' => 'Order not found.']);
        exit;
    }

    $currentStatus = trim(strtolower($currentOrder['status']));
    if ($status === 'declined' && in_array($currentStatus, ['pending', 'processing'], true)) {
        $itemStmt = $pdo->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?");
        $itemStmt->execute([$id]);
        $items = $itemStmt->fetchAll();

        foreach ($items as $item) {
            $restoreStmt = $pdo->prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
            $restoreStmt->execute([$item['quantity'], $item['product_id']]);
        }
    }

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
    if ($declineReason) {
        $updates[] = "decline_reason = ?";
        $params[] = $declineReason;
    }

    if (empty($updates)) {
        $pdo->commit();
        echo json_encode(['message' => 'No changes made.']);
        exit;
    }

    $sql .= implode(', ', $updates) . " WHERE id = ?";
    $params[] = $id;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $pdo->commit();
    echo json_encode(['message' => 'Order updated successfully.']);
} catch (\PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update order.']);
}
?>
