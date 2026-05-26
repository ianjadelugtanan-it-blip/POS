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
$declineReason = $data['declineReason'] ?? null;


if (empty($id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Order ID is required.']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Fetch current status of the order
    $statusStmt = $pdo->prepare("SELECT status FROM orders WHERE id = ? FOR UPDATE");
    $statusStmt->execute([$id]);
    $currentOrder = $statusStmt->fetch();

    if (!$currentOrder) {
        throw new Exception("Order not found.");
    }

    $currentStatus = $currentOrder['status'];

    // 2. Perform the update
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

    if (!empty($updates)) {
        $sql .= implode(', ', $updates) . " WHERE id = ?";
        $params[] = $id;
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
    }

    // 3. If transitioning to declined (or cancelled) from pending/processing, restore product stock
    if (($status === 'declined' || $status === 'cancelled') && $currentStatus !== 'declined' && $currentStatus !== 'cancelled') {
        // Fetch items associated with the order
        $itemsStmt = $pdo->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?");
        $itemsStmt->execute([$id]);
        $items = $itemsStmt->fetchAll();

        // Restore stock
        $updateStockStmt = $pdo->prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
        foreach ($items as $item) {
            $updateStockStmt->execute([$item['quantity'], $item['product_id']]);
        }
    }

    $pdo->commit();
    echo json_encode(['message' => 'Order updated successfully.']);
} catch (\Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update order: ' . $e->getMessage()]);
}
?>
