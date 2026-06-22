<?php
require_once __DIR__ . '/../backend/config/db.php';

try {
    echo "Resetting order NK4APO1 to pending and product 4J2VEFA stock to 3...\n";
    $pdo->exec("UPDATE orders SET status = 'pending' WHERE id = 'NK4APO1'");
    $pdo->exec("UPDATE products SET stock = 3 WHERE id = '4J2VEFA'");

    echo "Running simulation of update.php...\n";
    $id = 'NK4APO1';
    $status = 'declined';
    $declineReason = 'Test decline reason';

    $pdo->beginTransaction();

    // 1. Fetch current status of the order
    $statusStmt = $pdo->prepare("SELECT status FROM orders WHERE id = ? FOR UPDATE");
    $statusStmt->execute([$id]);
    $currentOrder = $statusStmt->fetch();

    if (!$currentOrder) {
        throw new Exception("Order not found.");
    }

    $currentStatus = $currentOrder['status'];
    echo "Current Status in DB: '{$currentStatus}'\n";

    // 2. Perform the update
    $sql = "UPDATE orders SET status = ?, decline_reason = ? WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$status, $declineReason, $id]);
    echo "Status updated to declined in DB.\n";

    // 3. If transitioning to declined (or cancelled) from pending/processing, restore product stock
    $transitionCondition = (($status === 'declined' || $status === 'cancelled') && $currentStatus !== 'declined' && $currentStatus !== 'cancelled');
    echo "Transition condition is: " . ($transitionCondition ? "TRUE" : "FALSE") . "\n";

    if ($transitionCondition) {
        // Fetch items associated with the order
        $itemsStmt = $pdo->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ?");
        $itemsStmt->execute([$id]);
        $items = $itemsStmt->fetchAll();
        echo "Found " . count($items) . " items for this order.\n";

        // Restore stock
        $updateStockStmt = $pdo->prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
        foreach ($items as $item) {
            echo "Restoring stock: product={$item['product_id']}, quantity={$item['quantity']}\n";
            $updateStockStmt->execute([$item['quantity'], $item['product_id']]);
            echo "Updated stock statement executed.\n";
        }
    }

    $pdo->commit();
    echo "Transaction committed successfully.\n";

    // Check final stock
    $finalStock = $pdo->query("SELECT stock FROM products WHERE id = '4J2VEFA'")->fetchColumn();
    echo "Final Stock of product 4J2VEFA: {$finalStock}\n";

} catch (\Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo "Error encountered: " . $e->getMessage() . "\n";
}
?>
