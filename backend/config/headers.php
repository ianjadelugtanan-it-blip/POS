<?php
/**
 * Security Headers (Defense-in-Depth)
 * Exposes apply_cors_headers() to be called once by the central router.
 */

function apply_cors_headers(): void
{
    $allowed_origins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://127.0.0.1:5173',
        'http://localhost',
        'http://127.0.0.1'
    ];

    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

    // Allow if in list OR if it's a localhost origin
    if ($origin && (in_array($origin, $allowed_origins) || preg_match('/^http:\/\/localhost(:\d+)?$/', $origin))) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
        header("Vary: Origin");
    }

    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");

    // Handle preflight OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    // Content-Type (Forcing JSON response)
    header('Content-Type: application/json; charset=UTF-8');

    // X-Content-Type-Options (Preventing MIME-sniffing)
    header('X-Content-Type-Options: nosniff');

    // Strict-Transport-Security (HSTS) - Only relevant for HTTPS
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');

    // X-Frame-Options (Preventing clickjacking/embedding)
    header('X-Frame-Options: DENY');

    // Content-Security-Policy (Restricting resources)
    header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none';");

    // X-XSS-Protection (Legacy protection for older browsers)
    header('X-XSS-Protection: 1; mode=block');
}
