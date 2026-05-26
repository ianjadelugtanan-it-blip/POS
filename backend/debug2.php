<?php
require_once 'config/db.php';
header('Content-Type: application/json');

$result = [];

// Check orders count
$s = $pdo->query("SELECT COUNT(*) as cnt FROM orders");
$result['orders_count'] = $s->fetch()['cnt'];

// Check order_items count
$s2 = $pdo->query("SELECT COUNT(*) as cnt FROM order_items");
$result['order_items_count'] = $s2->fetch()['cnt'];

// Get last 3 orders
$s3 = $pdo->query("SELECT id, status, username FROM orders ORDER BY date DESC LIMIT 3");
$result['last_3_orders'] = $s3->fetchAll();

// Get all products with stock
$s4 = $pdo->query("SELECT id, name, stock FROM products");
$result['products'] = $s4->fetchAll();

echo json_encode($result, JSON_PRETTY_PRINT);
?>
