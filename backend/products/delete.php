<?php
/**
 * Delete Product Endpoint
 */

require_once '../config/headers.php';
require_once '../config/db.php';

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);
$id = $data['id'] ?? '';

if (empty($id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Product ID is required.']);
    exit;
}

try {
    $pdo->beginTransaction();

    // Forcefully remove any linked order items to prevent foreign key constraint failures
    $stmt1 = $pdo->prepare("DELETE FROM order_items WHERE product_id = ?");
    $stmt1->execute([$id]);

    // Now delete the product
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$id]);

    $pdo->commit();
    echo json_encode(['message' => 'Product deleted successfully.']);
} catch (\PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    // Check for foreign key constraint errors
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(['error' => 'Cannot delete product: It is linked to existing orders.']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete product.']);
    }
}
?>
