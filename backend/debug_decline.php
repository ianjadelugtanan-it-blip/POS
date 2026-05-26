<?php
require_once 'config/db.php';

header('Content-Type: application/json');

$log = [];

// 1. Get the most recent pending order
$stmt = $pdo->query("SELECT id, status FROM orders WHERE status = 'pending' ORDER BY date DESC LIMIT 1");
$order = $stmt->fetch();

if (!$order) {
    echo json_encode(['error' => 'No pending orders found. Try with a declined order instead.']);
    // Try getting the most recent order of any status
    $stmt2 = $pdo->query("SELECT id, status FROM orders ORDER BY date DESC LIMIT 3");
    $recentOrders = $stmt2->fetchAll();
    echo "\n" . json_encode(['recent_orders' => $recentOrders]);
    exit;
}

$orderId = $order['id'];
$currentStatus = $order['status'];
$log[] = "Found order: $orderId with status: $currentStatus";

// 2. Get order items
$itemsStmt = $pdo->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?");
$itemsStmt->execute([$orderId]);
$items = $itemsStmt->fetchAll();
$log[] = "Order items: " . json_encode($items);

if (empty($items)) {
    $log[] = "WARNING: No items found in order_items for order_id = $orderId";
    echo json_encode(['log' => $log, 'issue' => 'No items in order_items table for this order!']);
    exit;
}

// 3. Check stock BEFORE
$stocksBefore = [];
foreach ($items as $item) {
    $s = $pdo->prepare("SELECT id, name, stock FROM products WHERE id = ?");
    $s->execute([$item['product_id']]);
    $stocksBefore[] = $s->fetch();
}
$log[] = "Stock BEFORE decline: " . json_encode($stocksBefore);

// 4. Simulate decline (restore stock)
$updateStockStmt = $pdo->prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
foreach ($items as $item) {
    $updateStockStmt->execute([$item['quantity'], $item['product_id']]);
    $log[] = "Restored stock: product_id={$item['product_id']}, quantity={$item['quantity']}";
}

// 5. Check stock AFTER
$stocksAfter = [];
foreach ($items as $item) {
    $s = $pdo->prepare("SELECT id, name, stock FROM products WHERE id = ?");
    $s->execute([$item['product_id']]);
    $stocksAfter[] = $s->fetch();
}
$log[] = "Stock AFTER stock restore: " . json_encode($stocksAfter);

// 6. Revert — undo our test restore so we don't mess up real data
$revertStmt = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
foreach ($items as $item) {
    $revertStmt->execute([$item['quantity'], $item['product_id']]);
}
$log[] = "Reverted test restore (data unchanged).";

echo json_encode(['log' => $log], JSON_PRETTY_PRINT);
?>
