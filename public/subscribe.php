<?php
/**
 * Substack subscribe proxy.
 * Uses form-urlencoded input (not JSON) to avoid WAF/Imunify360 blocks.
 */

// Diagnostic endpoint
if (isset($_GET['test'])) {
    header('Content-Type: application/json');
    echo json_encode([
        'php_version' => PHP_VERSION,
        'curl_available' => function_exists('curl_init'),
        'allow_url_fopen' => ini_get('allow_url_fopen'),
        'openssl' => extension_loaded('openssl'),
        'status' => 'ok'
    ]);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Read from standard form POST data
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$first_url = isset($_POST['first_url']) ? $_POST['first_url'] : '';
$first_referrer = isset($_POST['first_referrer']) ? $_POST['first_referrer'] : '';

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email']);
    exit;
}

$url = 'https://theanthropicstack.substack.com/api/v1/free';

$payload = json_encode([
    'first_url'        => $first_url,
    'first_referrer'   => $first_referrer,
    'current_url'      => $first_url,
    'current_referrer'  => $first_referrer,
    'referral_code'    => '',
    'source'           => 'subscribe_page',
    'email'            => $email,
]);

$response = false;
$httpCode = 0;

// Method 1: cURL
if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($payload),
            'User-Agent: Mozilla/5.0',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_SSL_VERIFYPEER => false,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
}

// Method 2: file_get_contents fallback
if ($response === false && ini_get('allow_url_fopen')) {
    $opts = [
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/json\r\nContent-Length: " . strlen($payload) . "\r\nUser-Agent: Mozilla/5.0\r\n",
            'content' => $payload,
            'timeout' => 15,
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
        ],
    ];
    $context = stream_context_create($opts);
    $response = @file_get_contents($url, false, $context);
    if ($response !== false && isset($http_response_header)) {
        foreach ($http_response_header as $header) {
            if (preg_match('/^HTTP\/\d\.\d\s+(\d+)/', $header, $matches)) {
                $httpCode = (int)$matches[1];
            }
        }
    }
}

header('Content-Type: application/json');

if ($response === false) {
    http_response_code(502);
    echo json_encode(['error' => 'Could not reach Substack']);
    exit;
}

if ($httpCode >= 200 && $httpCode < 300) {
    http_response_code(200);
    echo json_encode(['success' => true]);
} else {
    http_response_code($httpCode ? $httpCode : 502);
    echo $response;
}
