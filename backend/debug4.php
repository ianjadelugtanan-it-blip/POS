<?php
require_once 'config/db.php';
header('Content-Type: application/json');

// Simulate exactly what create.php does with sample data
$order = [
    'id' => 'DBG_TEST_' . time(),
    'customerName' => 'Debug User',
    'address' => '123 Test St',
    'contactNumber' => '09123456789',
    'total' => 150.00,
    'status' => 'pending',
    'date' => date('Y-m-d H:i:s'),
    'username' => 'testuser',
    'paymentMethod' => 'Cash on Delivery',
    'receiptImage' => null,
    'items' => [
        ['id' => '4J2VEFA', 'quantity' => 1, 'price' => 150.00]
    ]
];

$log = [];

try {
    $pdo->beginTransaction();
    $log[] = 'Transaction started';

    $stmt = $pdo->prepare("INSERT INTO orders (id, customer_name, address, contact_number, total, status, date, username, payment_method, receipt_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $paymentMethod = $order['paymentMethod'];
    $receiptImage = $order['receiptImage'];

    $stmt->execute([
        $order['id'],
        $order['customerName'],
        $order['address'],
        $order['contactNumber'],
        $order['total'],
        $order['status'],
        $order['date'],
        $order['username'],
        $paymentMethod,
        $receiptImage
    ]);
    $log[] = 'Order INSERT succeeded: ' . $order['id'];

    $itemStmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)");
    $checkStockStmt = $pdo->prepare("SELECT name, stock FROM products WHERE id = ? FOR UPDATE");
    $updateStockStmt = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");

    foreach ($order['items'] as $item) {
        $checkStockStmt->execute([$item['id']]);
        $product = $checkStockStmt->fetch();
        $log[] = 'Product found: ' . json_encode($product);

        if (!$product) throw new Exception("Product not found: " . $item['id']);
        if ($product['stock'] < $item['quantity']) throw new Exception("Insufficient stock");

        $itemStmt->execute([$order['id'], $item['id'], $item['quantity'], $item['price']]);
        $log[] = 'order_items INSERT succeeded';

        $updateStockStmt->execute([$item['quantity'], $item['id']]);
        $log[] = 'Stock deducted';
    }

    $pdo->commit();
    $log[] = 'COMMITTED successfully';

    // Clean up test data
    $pdo->prepare("DELETE FROM order_items WHERE order_id = ?")->execute([$order['id']]);
    $pdo->prepare("UPDATE products SET stock = stock + 1 WHERE id = '4J2VEFA'")->execute();
    $pdo->prepare("DELETE FROM orders WHERE id = ?")->execute([$order['id']]);
    $log[] = 'Test data cleaned up';

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    $log[] = 'ERROR (rolled back): ' . $e->getMessage();
}

echo json_encode(['log' => $log], JSON_PRETTY_PRINT);
?>
