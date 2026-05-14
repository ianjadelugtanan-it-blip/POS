<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["error" => "Order ID required"]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT status FROM orders WHERE id = ?");
    $stmt->execute([$data['id']]);
    $order = $stmt->fetch();

    if (!$order) {
        echo json_encode(["error" => "Order not found"]);
        exit;
    }

    if ($order['status'] !== 'pending') {
        echo json_encode(["error" => "Only pending orders can be cancelled"]);
        exit;
    }

    // Begin transaction to restore stock
    $conn->beginTransaction();

    // Get items to restore stock
    $stmt = $conn->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?");
    $stmt->execute([$data['id']]);
    $items = $stmt->fetchAll();

    foreach ($items as $item) {
        $stmt = $conn->prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
        $stmt->execute([$item['quantity'], $item['product_id']]);
    }

    // Delete order and items (cascading)
    $stmt = $conn->prepare("DELETE FROM orders WHERE id = ?");
    $stmt->execute([$data['id']]);

    $conn->commit();
    echo json_encode(["message" => "Order cancelled and stock restored"]);

} catch (PDOException $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    echo json_encode(["error" => $e->getMessage()]);
}
?>
