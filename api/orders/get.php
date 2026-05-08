<?php
/**
 * Get Orders Endpoint
 * Fetches all orders with their items.
 */

require_once '../config/headers.php';
require_once '../config/db.php';

try {
    // 1. Fetch all orders
    $stmt = $pdo->query("SELECT * FROM orders ORDER BY date DESC");
    $orders = $stmt->fetchAll();

    $result = [];
    foreach ($orders as $order) {
        // 2. Fetch items for each order
        $itemStmt = $pdo->prepare("
            SELECT oi.*, p.name 
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        ");
        $itemStmt->execute([$order['id']]);
        $items = $itemStmt->fetchAll();

        // 3. Format order for frontend
        $result[] = [
            'id' => $order['id'],
            'customerName' => $order['customer_name'],
            'address' => $order['address'],
            'contactNumber' => $order['contact_number'],
            'total' => (float)$order['total'],
            'status' => $order['status'],
            'date' => $order['date'],
            'estimatedArrival' => $order['estimated_arrival'],
            'items' => array_map(function($i) {
                return [
                    'id' => $i['product_id'],
                    'name' => $i['name'],
                    'price' => (float)$i['price_at_time'],
                    'quantity' => (int)$i['quantity']
                ];
            }, $items)
        ];
    }

    echo json_encode($result);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch orders: ' . $e->getMessage()]);
}
?>
