<?php
require_once 'config/db.php';
header('Content-Type: application/json');

$result = [];

// Check orders table columns
$s = $pdo->query("DESCRIBE orders");
$result['orders_schema'] = $s->fetchAll();

// Check order_items table columns
$s2 = $pdo->query("DESCRIBE order_items");
$result['order_items_schema'] = $s2->fetchAll();

// Check products table columns
$s3 = $pdo->query("DESCRIBE products");
$result['products_schema'] = $s3->fetchAll();

// Try a manual insert to test
try {
    $testId = 'TEST_' . time();
    $pdo->beginTransaction();
    $stmt = $pdo->prepare("INSERT INTO orders (id, customer_name, address, contact_number, total, status, date, username, payment_method, receipt_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$testId, 'Test User', 'Test Address', '09123456789', 100.00, 'pending', date('Y-m-d H:i:s'), 'testuser', 'Cash on Delivery', null]);
    $pdo->commit();
    $result['test_insert'] = 'SUCCESS - inserted order ' . $testId;
    
    // Clean up the test insert
    $pdo->prepare("DELETE FROM orders WHERE id = ?")->execute([$testId]);
    $result['test_cleanup'] = 'Cleaned up test row';
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    $result['test_insert'] = 'FAILED: ' . $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT);
?>
