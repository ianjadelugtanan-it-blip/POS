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
    $pdo->beginTransaction();

    $statusStmt = $pdo->prepare("SELECT status FROM orders WHERE id = ?");
    $statusStmt->execute([$id]);
    $order = $statusStmt->fetch();

    if (!$order) {
        http_response_code(404);
        echo json_encode(['error' => 'Order not found.']);
        exit;
    }

    $status = trim(strtolower($order['status']));
    $shouldRestoreStock = in_array($status, ['pending', 'processing'], true);

    if ($shouldRestoreStock) {
        $itemsStmt = $pdo->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?");
        $itemsStmt->execute([$id]);
        $items = $itemsStmt->fetchAll();

        foreach ($items as $item) {
            $restoreStmt = $pdo->prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
            $restoreStmt->execute([$item['quantity'], $item['product_id']]);
        }
    }

    $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
    $stmt->execute([$id]);

    $pdo->commit();
    echo json_encode(['message' => 'Order record removed.' . ($shouldRestoreStock ? ' Stock restored.' : '')]);
} catch (\PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete order record.']);
}
?>
