<?php
/**
 * Create Order Endpoint
 * Demonstrates:
 * - PDO Transactions (Atomicity)
 * - Prepared Statements for complex data
 * - Foreign Key handling
 */

require_once '../config/headers.php';
require_once '../config/db.php';

$json_data = file_get_contents('php://input');
$order = json_decode($json_data, true);

if (!$order || empty($order['items'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid order data.']);
    exit;
}

try {
    // 1. Start a transaction to ensure all-or-nothing insertion
    $pdo->beginTransaction();

    // 2. Insert into `orders` table
    $stmt = $pdo->prepare("INSERT INTO orders (id, customer_name, address, contact_number, total, status, date) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $order['id'],
        $order['customerName'],
        $order['address'] ?? null,
        $order['contactNumber'] ?? null,
        $order['total'],
        $order['status'] ?? 'pending',
        $order['date'] ?? date('Y-m-d H:i:s')
    ]);

    // 3. Insert each item into `order_items` table
    $itemStmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)");
    
    // Also prepare a statement to update stock
    $stockStmt = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");

    foreach ($order['items'] as $item) {
        $itemStmt->execute([
            $order['id'],
            $item['id'],
            $item['quantity'],
            $item['price']
        ]);

        // 4. Update product stock
        $stockStmt->execute([$item['quantity'], $item['id']]);
    }

    // 5. Commit the transaction
    $pdo->commit();

    http_response_code(201);
    echo json_encode(['message' => 'Order created successfully and stock updated.']);

} catch (\PDOException $e) {
    // Roll back changes if any step fails
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Order creation failed: ' . $e->getMessage()]);
}
?>
