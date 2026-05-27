<?php
require 'backend/config/db.php';
$stmt = $pdo->query("SELECT id, name, SUBSTRING(image_url, 1, 30) as img FROM products");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
