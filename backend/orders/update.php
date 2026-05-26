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

<<<<<<< HEAD
    // 1. Fetch current status of the order
    $statusStmt = $pdo->prepare("SELECT status FROM orders WHERE id = ? FOR UPDATE");
=======
    $statusStmt = $pdo->prepare("SELECT status FROM orders WHERE id = ?");
>>>>>>> 50e551402bc1863b5a955ed46bd9009b91e26735
    $statusStmt->execute([$id]);
    $currentOrder = $statusStmt->fetch();

    if (!$currentOrder) {
<<<<<<< HEAD
        throw new Exception("Order not found.");
    }

    $currentStatus = $currentOrder['status'];

    // 2. Perform the update
=======
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

>>>>>>> 50e551402bc1863b5a955ed46bd9009b91e26735
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

<<<<<<< HEAD
    if (!empty($updates)) {
        $sql .= implode(', ', $updates) . " WHERE id = ?";
        $params[] = $id;
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
=======
    if (empty($updates)) {
        $pdo->commit();
        echo json_encode(['message' => 'No changes made.']);
        exit;
>>>>>>> 50e551402bc1863b5a955ed46bd9009b91e26735
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
<<<<<<< HEAD
} catch (\Exception $e) {
=======
} catch (\PDOException $e) {
>>>>>>> 50e551402bc1863b5a955ed46bd9009b91e26735
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update order: ' . $e->getMessage()]);
}
?>
