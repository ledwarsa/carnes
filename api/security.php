<?php
require_once __DIR__ . '/utils/middleware.php';
require_once __DIR__ . '/utils/JsonDB.php';
checkAuth();

header('Content-Type: application/json');
$db = new JsonDB('security');
$security = $db->read() ?? ['enabled' => false, 'whitelist' => ["127.0.0.1", "::1"], 'blocked_ips' => []];

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode($security);
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['enabled'])) {
        $security['enabled'] = (bool)$data['enabled'];
    }
    
    if (isset($data['whitelist'])) {
        $security['whitelist'] = array_map('trim', explode(',', $data['whitelist']));
    }
    
    if (isset($data['blocked_ips'])) {
        $security['blocked_ips'] = array_map('trim', explode(',', $data['blocked_ips']));
    }
    
    $db->write($security);
    echo json_encode(['success' => true, 'security' => $security]);
    exit;
}
