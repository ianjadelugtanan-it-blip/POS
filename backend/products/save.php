<?php
/**
 * Add/Update Product Endpoint
 * Uses Prepared Statements for secure insertion/update.
 */

require_once '../config/headers.php';
require_once '../config/db.php';

$json_data = file_get_contents('php://input');
$product = json_decode($json_data, true);

if (!$product || empty($product['id']) || empty($product['name'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing product information.']);
    exit;
}

try {
    // ON DUPLICATE KEY UPDATE allows this endpoint to handle both creation and editing
    $sql = "INSERT INTO products (id, name, price, stock, category, image_url) 
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            name = VALUES(name), 
            price = VALUES(price), 
            stock = VALUES(stock), 
            category = VALUES(category), 
            image_url = VALUES(image_url)";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $product['id'],
        $product['name'],
        $product['price'],
        $product['stock'],
        $product['category'],
        $product['imageUrl'] ?? null
    ]);

    echo json_encode(['message' => 'Product saved successfully.']);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
