<?php
/**
 * Get Products Endpoint
 * Retrieves all products from the database securely.
 */

require_once '../config/headers.php';
require_once '../config/db.php';

try {
    $stmt = $pdo->query("SELECT * FROM products ORDER BY category ASC, name ASC");
    $products = $stmt->fetchAll();

    // Map database field names to frontend expected field names if necessary
    $formatted_products = array_map(function($p) {
        return [
            'id' => $p['id'],
            'name' => $p['name'],
            'price' => (float)$p['price'],
            'stock' => (int)$p['stock'],
            'category' => $p['category'],
            'imageUrl' => $p['image_url']
        ];
    }, $products);

    echo json_encode($formatted_products);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch products: ' . $e->getMessage()]);
}
?>
