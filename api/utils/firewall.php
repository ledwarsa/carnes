<?php
require_once __DIR__ . '/JsonDB.php';

function runFirewall() {
    $db = new JsonDB('security');
    $config = $db->read() ?? ['enabled' => false, 'whitelist' => ["127.0.0.1", "::1"], 'blocked_ips' => []];
    
    if (empty($config['enabled'])) {
        return; // Firewall disabled
    }
    
    // Attempt to get client IP
    $client_ip = $_SERVER['REMOTE_ADDR'] ?? '';
    if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $client_ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    }
    $client_ip = trim($client_ip);
    
    // Server IP for whitelist
    $server_ip = $_SERVER['SERVER_ADDR'] ?? '';
    
    // Whitelist check
    $whitelist = $config['whitelist'] ?? ["127.0.0.1", "::1"];
    if (!empty($server_ip) && !in_array($server_ip, $whitelist)) {
        $whitelist[] = $server_ip;
    }
    
    if (in_array($client_ip, $whitelist)) {
        return; // Allowed
    }
    
    // Blacklist check
    $blocked_ips = $config['blocked_ips'] ?? [];
    if (in_array($client_ip, $blocked_ips)) {
        http_response_code(403);
        die("403 Forbidden (Blocked by firewall)");
    }
    
    // Payload detection logic
    $malicious_patterns = [
        '/<script\b[^>]*>(.*?)<\/script>/is', // XSS
        '/union\s+select/i', // SQLi
        '/base64_decode\(/i', // PHP execution
        '/\.\.\//', // Directory traversal
        '/eval\(/i'
    ];
    
    $payloads = [
        json_encode($_GET),
        json_encode($_POST),
        $_SERVER['REQUEST_URI'] ?? ''
    ];
    
    foreach ($payloads as $payload) {
        foreach ($malicious_patterns as $pattern) {
            if (preg_match($pattern, $payload)) {
                // Block and log IP
                $config['blocked_ips'][] = $client_ip;
                $config['blocked_ips'] = array_unique($config['blocked_ips']);
                $db->write($config);
                
                http_response_code(403);
                die("403 Forbidden (Blocked by firewall - Malicious payload detected)");
            }
        }
    }
}
// Automatically run firewall when this file is included
runFirewall();
