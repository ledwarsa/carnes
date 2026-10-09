<?php
require_once __DIR__ . '/utils/middleware.php';
require_once __DIR__ . '/utils/JsonDB.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$db = new JsonDB('orders');

if ($method === 'POST') {
    // Save new order from public checkout form
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }
    
    $orders = $db->read() ?? [];
    $input['id'] = uniqid('ord_');
    $input['date'] = date('Y-m-d H:i:s');
    
    array_unshift($orders, $input); // Add to beginning
    $db->write($orders);
    
    echo json_encode(['success' => true, 'id' => $input['id']]);
    exit;
}

// All other methods require auth
checkAuth();

$orders = $db->read() ?? [];

if ($method === 'GET') {
    echo json_encode($orders);
    exit;
}

if ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['id'])) {
        $orders = array_filter($orders, fn($o) => $o['id'] !== $data['id']);
        $db->write(array_values($orders));
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No id provided']);
    }
    exit;
}
