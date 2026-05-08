<?php
/**
 * Security Headers (Defense-in-Depth)
 * This script sets mandatory security headers for API communication.
 */

// 1. Cross-Origin Resource Sharing (CORS)
// In development, you might need to allow your frontend port (e.g., http://localhost:5173)
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 2. Content-Type (Forcing JSON response)
header('Content-Type: application/json; charset=UTF-8');

// 3. X-Content-Type-Options (Preventing MIME-sniffing)
header('X-Content-Type-Options: nosniff');

// 4. Strict-Transport-Security (HSTS) - Only relevant for HTTPS
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');

// 5. X-Frame-Options (Preventing clickjacking/embedding)
header('X-Frame-Options: DENY');

// 6. Content-Security-Policy (Restricting resources)
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none';");

// 7. X-XSS-Protection (Legacy protection for older browsers)
header('X-XSS-Protection: 1; mode=block');
?>
