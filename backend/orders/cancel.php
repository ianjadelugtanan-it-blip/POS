<?php
/**
 * Cancel Order Endpoint
 * Corrected to use config/db.php and config/headers.php
 */

require_once '../config/headers.php';
require_once '../config/db.php';

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Order ID required"]);
    exit;
}

try {
    // 1. Fetch order status
    $stmt = $pdo->prepare("SELECT status FROM orders WHERE id = ?");
    $stmt->execute([$data['id']]);
    $order = $stmt->fetch();

    if (!$order) {
        http_response_code(404);
        echo json_encode(["error" => "Order not found"]);
        exit;
    }

    if ($order['status'] !== 'pending') {
        http_response_code(400);
        echo json_encode(["error" => "Only pending orders can be cancelled"]);
        exit;
    }

    // 2. Begin transaction to restore stock
    $pdo->beginTransaction();

    // 3. Get items to restore stock
    $stmt = $pdo->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?");
    $stmt->execute([$data['id']]);
    $items = $stmt->fetchAll();

    foreach ($items as $item) {
        $updateStmt = $pdo->prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
        $updateStmt->execute([$item['quantity'], $item['product_id']]);
    }

    // 4. Delete order (cascading deletes items if FK is set, or delete them manually)
    // We'll delete items first just in case
    $delItemsStmt = $pdo->prepare("DELETE FROM order_items WHERE order_id = ?");
    $delItemsStmt->execute([$data['id']]);

    $delOrderStmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
    $delOrderStmt->execute([$data['id']]);

    $pdo->commit();
    echo json_encode(["message" => "Order cancelled and stock restored"]);

} catch (\Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
