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
    $stmt = $pdo->prepare("INSERT INTO orders (id, customer_name, address, contact_number, total, status, date, username, payment_method, receipt_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $paymentMethod = $order['paymentMethod'] ?? $order['payment_method'] ?? 'Cash on Delivery';
    $receiptImage = $order['receiptImage'] ?? $order['receipt_image'] ?? null;

    $stmt->execute([
        $order['id'],
        $order['customerName'] ?? $order['customer_name'],
        $order['address'] ?? null,
        $order['contactNumber'] ?? $order['contact_number'] ?? null,
        $order['total'],
        $order['status'] ?? 'pending',
        $order['date'] ?? date('Y-m-d H:i:s'),
        $order['username'] ?? null,
        $paymentMethod,
        $receiptImage
    ]);


    // 3. Insert each item into `order_items` table and validate stock
    $itemStmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)");
    
    // Prepare a statement to check current stock (using FOR UPDATE to lock the row)
    $checkStockStmt = $pdo->prepare("SELECT name, stock FROM products WHERE id = ? FOR UPDATE");
    
    // Prepare a statement to update stock
    $updateStockStmt = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");

    foreach ($order['items'] as $item) {
        // 4. Validate Stock
        $checkStockStmt->execute([$item['id']]);
        $product = $checkStockStmt->fetch();

        if (!$product) {
            throw new Exception("Product not found: " . $item['id']);
        }

        if ($product['stock'] < $item['quantity']) {
            throw new Exception("Insufficient stock for product: " . $product['name'] . ". Available: " . $product['stock'] . ", Requested: " . $item['quantity']);
        }

        // 5. Insert order item
        $itemStmt->execute([
            $order['id'],
            $item['id'],
            $item['quantity'],
            $item['price']
        ]);

        // 6. Update product stock
        $updateStockStmt->execute([$item['quantity'], $item['id']]);
    }

    // 7. Commit the transaction
    $pdo->commit();

    http_response_code(201);
    echo json_encode(['message' => 'Order created successfully and stock updated.']);

} catch (\Exception $e) {
    // Roll back changes if any step fails
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    // If it's a validation error, use 400. Otherwise 500.
    $isValidationError = strpos($e->getMessage(), 'Insufficient stock') !== false || strpos($e->getMessage(), 'Product not found') !== false;
    http_response_code($isValidationError ? 400 : 500);
    
    echo json_encode(['error' => $e->getMessage()]);
}
?>
