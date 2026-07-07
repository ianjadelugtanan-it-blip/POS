<?php
/**
 * Products Route Handlers
 * - handle_products_get(PDO)
 * - handle_products_save(PDO)
 * - handle_products_delete(PDO)
 */

function handle_products_get(PDO $pdo): void
{
    try {
        $stmt     = $pdo->query("SELECT * FROM products ORDER BY category ASC, name ASC");
        $products = $stmt->fetchAll();

        $formatted = array_map(function ($p) {
            return [
                'id'       => $p['id'],
                'name'     => $p['name'],
                'price'    => (float) $p['price'],
                'stock'    => (int) $p['stock'],
                'category' => $p['category'],
                'imageUrl' => $p['image_url']
            ];
        }, $products);

        echo json_encode($formatted);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch products: ' . $e->getMessage()]);
    }
}

function handle_products_save(PDO $pdo): void
{
    $json_data = file_get_contents('php://input');
    $product   = json_decode($json_data, true);

    if (!$product || empty($product['id']) || empty($product['name'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing product information.']);
        return;
    }

    try {
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
}

function handle_products_delete(PDO $pdo): void
{
    $json_data = file_get_contents('php://input');
    $data      = json_decode($json_data, true);
    $id        = $data['id'] ?? '';

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID is required.']);
        return;
    }

    try {
        $pdo->beginTransaction();

        // Remove linked order items first to avoid FK constraint failures
        $stmt1 = $pdo->prepare("DELETE FROM order_items WHERE product_id = ?");
        $stmt1->execute([$id]);

        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);

        $pdo->commit();
        echo json_encode(['message' => 'Product deleted successfully.']);
    } catch (\PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        if ($e->getCode() == 23000) {
            http_response_code(409);
            echo json_encode(['error' => 'Cannot delete product: It is linked to existing orders.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete product.']);
        }
    }
}
