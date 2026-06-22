<?php
require_once __DIR__ . '/../backend/config/db.php';

echo "=== PRODUCTS ===\n";
$stmt = $pdo->query("SELECT id, name, stock FROM products");
while ($row = $stmt->fetch()) {
    echo "ID: {$row['id']} | Name: {$row['name']} | Stock: {$row['stock']}\n";
}

echo "\n=== ORDERS ===\n";
$stmt = $pdo->query("SELECT id, customer_name, status, total FROM orders");
while ($row = $stmt->fetch()) {
    echo "ID: {$row['id']} | Name: {$row['customer_name']} | Status: {$row['status']} | Total: {$row['total']}\n";
}

echo "\n=== ORDER ITEMS ===\n";
$stmt = $pdo->query("SELECT order_id, product_id, quantity FROM order_items");
while ($row = $stmt->fetch()) {
    echo "OrderID: {$row['order_id']} | ProductID: {$row['product_id']} | Qty: {$row['quantity']}\n";
}
?>
