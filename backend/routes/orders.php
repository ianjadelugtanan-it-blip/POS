<?php
/**
 * Orders Route Handlers
 * - handle_orders_get(PDO)
 * - handle_orders_create(PDO)
 * - handle_orders_update(PDO)
 * - handle_orders_cancel(PDO)
 * - handle_orders_delete(PDO)
 */

function handle_orders_get(PDO $pdo): void
{
    try {
        $username = $_GET['username'] ?? null;

        if ($username) {
            $stmt = $pdo->prepare("SELECT * FROM orders WHERE username = ? ORDER BY date DESC");
            $stmt->execute([$username]);
        } else {
            $stmt = $pdo->query("SELECT * FROM orders ORDER BY date DESC");
        }
        $orders = $stmt->fetchAll();

        $result = [];
        foreach ($orders as $order) {
            $itemStmt = $pdo->prepare("
                SELECT oi.*, p.name, p.image_url AS imageUrl
                FROM order_items oi
                LEFT JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            ");
            $itemStmt->execute([$order['id']]);
            $items = $itemStmt->fetchAll();

            $result[] = [
                'id'              => $order['id'],
                'customerName'    => $order['customer_name'],
                'address'         => $order['address'],
                'contactNumber'   => $order['contact_number'],
                'total'           => (float) $order['total'],
                'status'          => $order['status'],
                'date'            => $order['date'],
                'estimatedArrival'=> $order['estimated_arrival'],
                'username'        => $order['username'],
                'paymentMethod'   => $order['payment_method'],
                'receiptImage'    => $order['receipt_image'],
                'declineReason'   => $order['decline_reason'],
                'items'           => array_map(function ($i) {
                    return [
                        'id'       => $i['product_id'],
                        'name'     => $i['name'] ?? 'Deleted Product',
                        'price'    => (float) $i['price_at_time'],
                        'quantity' => (int) $i['quantity'],
                        'imageUrl' => $i['imageUrl'] ?? null
                    ];
                }, $items)
            ];
        }

        echo json_encode($result);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch orders: ' . $e->getMessage()]);
    }
}

function handle_orders_create(PDO $pdo): void
{
    $json_data = file_get_contents('php://input');
    $order     = json_decode($json_data, true);

    if (!$order || empty($order['items'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid order data.']);
        return;
    }

    try {
        $pdo->beginTransaction();

        $paymentMethod = $order['paymentMethod'] ?? $order['payment_method'] ?? 'Cash on Delivery';
        $receiptImage  = $order['receiptImage']  ?? $order['receipt_image']  ?? null;

        $stmt = $pdo->prepare("INSERT INTO orders (id, customer_name, address, contact_number, total, status, date, username, payment_method, receipt_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
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

        $itemStmt        = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)");
        $checkStockStmt  = $pdo->prepare("SELECT name, stock FROM products WHERE id = ? FOR UPDATE");
        $updateStockStmt = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");

        foreach ($order['items'] as $item) {
            $checkStockStmt->execute([$item['id']]);
            $product = $checkStockStmt->fetch();

            if (!$product) {
                throw new \Exception("Product not found: " . $item['id']);
            }

            if ($product['stock'] < $item['quantity']) {
                throw new \Exception("Insufficient stock for product: " . $product['name'] . ". Available: " . $product['stock'] . ", Requested: " . $item['quantity']);
            }

            $itemStmt->execute([$order['id'], $item['id'], $item['quantity'], $item['price']]);
            $updateStockStmt->execute([$item['quantity'], $item['id']]);
        }

        $pdo->commit();
        http_response_code(201);
        echo json_encode(['message' => 'Order created successfully and stock updated.']);
    } catch (\Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        $isValidationError = strpos($e->getMessage(), 'Insufficient stock') !== false
            || strpos($e->getMessage(), 'Product not found') !== false;
        http_response_code($isValidationError ? 400 : 500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handle_orders_update(PDO $pdo): void
{
    $json_data    = file_get_contents('php://input');
    $data         = json_decode($json_data, true);

    $id            = $data['id'] ?? '';
    $status        = isset($data['status']) ? trim(strtolower($data['status'])) : null;
    $eta           = $data['estimatedArrival'] ?? null;
    $declineReason = $data['declineReason'] ?? null;

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'Order ID is required.']);
        return;
    }

    try {
        $pdo->beginTransaction();

        $statusStmt = $pdo->prepare("SELECT status FROM orders WHERE id = ? FOR UPDATE");
        $statusStmt->execute([$id]);
        $currentOrder = $statusStmt->fetch();

        if (!$currentOrder) {
            throw new \Exception("Order not found.");
        }

        $currentStatus = trim(strtolower($currentOrder['status']));

        $sql     = "UPDATE orders SET ";
        $params  = [];
        $updates = [];

        if ($status) {
            $updates[] = "status = ?";
            $params[]  = $status;
        }
        if ($eta) {
            $updates[] = "estimated_arrival = ?";
            $params[]  = $eta;
        }
        if ($declineReason) {
            $updates[] = "decline_reason = ?";
            $params[]  = $declineReason;
        }

        if (empty($updates)) {
            $pdo->commit();
            echo json_encode(['message' => 'No changes made.']);
            return;
        }

        $sql .= implode(', ', $updates) . " WHERE id = ?";
        $params[] = $id;
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        // Restore stock when moving to declined/cancelled from an active state
        if (($status === 'declined' || $status === 'cancelled') && !in_array($currentStatus, ['declined', 'cancelled'])) {
            $itemsStmt = $pdo->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?");
            $itemsStmt->execute([$id]);
            $items = $itemsStmt->fetchAll();

            $updateStockStmt = $pdo->prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
            foreach ($items as $item) {
                $updateStockStmt->execute([$item['quantity'], $item['product_id']]);
            }
        }

        $pdo->commit();
        echo json_encode(['message' => 'Order updated successfully.']);
    } catch (\Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update order: ' . $e->getMessage()]);
    }
}

function handle_orders_cancel(PDO $pdo): void
{
    $json_data = file_get_contents('php://input');
    $data      = json_decode($json_data, true);

    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Order ID required']);
        return;
    }

    try {
        $stmt = $pdo->prepare("SELECT status FROM orders WHERE id = ?");
        $stmt->execute([$data['id']]);
        $order = $stmt->fetch();

        if (!$order) {
            http_response_code(404);
            echo json_encode(['error' => 'Order not found']);
            return;
        }

        if ($order['status'] !== 'pending') {
            http_response_code(400);
            echo json_encode(['error' => 'Only pending orders can be cancelled']);
            return;
        }

        $pdo->beginTransaction();

        $stmt = $pdo->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?");
        $stmt->execute([$data['id']]);
        $items = $stmt->fetchAll();

        foreach ($items as $item) {
            $updateStmt = $pdo->prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
            $updateStmt->execute([$item['quantity'], $item['product_id']]);
        }

        $delItemsStmt = $pdo->prepare("DELETE FROM order_items WHERE order_id = ?");
        $delItemsStmt->execute([$data['id']]);

        $delOrderStmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
        $delOrderStmt->execute([$data['id']]);

        $pdo->commit();
        echo json_encode(['message' => 'Order cancelled and stock restored']);
    } catch (\Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handle_orders_delete(PDO $pdo): void
{
    $json_data = file_get_contents('php://input');
    $data      = json_decode($json_data, true);
    $id        = $data['id'] ?? '';

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'Order ID is required.']);
        return;
    }

    try {
        $pdo->beginTransaction();

        $statusStmt = $pdo->prepare("SELECT status FROM orders WHERE id = ?");
        $statusStmt->execute([$id]);
        $order = $statusStmt->fetch();

        if (!$order) {
            http_response_code(404);
            echo json_encode(['error' => 'Order not found.']);
            return;
        }

        $status             = trim(strtolower($order['status']));
        $shouldRestoreStock = in_array($status, ['pending', 'processing'], true);

        if ($shouldRestoreStock) {
            $itemsStmt = $pdo->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?");
            $itemsStmt->execute([$id]);
            $items = $itemsStmt->fetchAll();

            foreach ($items as $item) {
                $restoreStmt = $pdo->prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
                $restoreStmt->execute([$item['quantity'], $item['product_id']]);
            }
        }

        $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->execute([$id]);

        $pdo->commit();
        echo json_encode(['message' => 'Order record removed.' . ($shouldRestoreStock ? ' Stock restored.' : '')]);
    } catch (\PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete order record.']);
    }
}
