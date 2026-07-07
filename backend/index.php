<?php
/**
 * Central API Router
 *
 * All requests to /POS/backend/ are rewritten here by .htaccess.
 * This file applies headers once, resolves the route, and dispatches
 * to the appropriate handler function — no require_once in endpoint files.
 */

require_once __DIR__ . '/config/headers.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/routes/auth.php';
require_once __DIR__ . '/routes/products.php';
require_once __DIR__ . '/routes/orders.php';
require_once __DIR__ . '/routes/users.php';

// Apply CORS headers and handle OPTIONS preflight once, centrally
apply_cors_headers();

// ── Route Dispatch Table ──────────────────────────────────────────────────────
// Keys: "<METHOD> <path-suffix>"  (path-suffix relative to /POS/backend/)
// Values: callable handler name
$routes = [
    // Auth
    'POST auth/login.php'       => 'handle_login',
    'POST auth/register.php'    => 'handle_register',

    // Products
    'GET  products/get.php'     => 'handle_products_get',
    'POST products/save.php'    => 'handle_products_save',
    'POST products/delete.php'  => 'handle_products_delete',

    // Orders
    'GET  orders/get.php'       => 'handle_orders_get',
    'POST orders/create.php'    => 'handle_orders_create',
    'POST orders/update.php'    => 'handle_orders_update',
    'POST orders/cancel.php'    => 'handle_orders_cancel',
    'POST orders/delete.php'    => 'handle_orders_delete',

    // Users
    'GET  users/get.php'        => 'handle_users_get',
    'POST users/remove.php'     => 'handle_users_remove',
];

// ── Resolve the incoming route key ───────────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'];

// Strip query string then normalise the URI to just the path
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = rawurldecode($uri);

// Remove the base path prefix so we end up with e.g. "auth/login.php"
$base     = '/POS/backend/';
$trimmed  = ltrim(str_replace($base, '', $uri), '/');

$key = $method . ' ' . $trimmed;

// ── Dispatch ─────────────────────────────────────────────────────────────────
if (isset($routes[$key]) && function_exists($routes[$key])) {
    $pdo = get_pdo();
    call_user_func($routes[$key], $pdo);
} else {
    http_response_code(404);
    echo json_encode([
        'error' => 'Route not found.',
        'route' => $key
    ]);
}
