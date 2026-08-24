<?php
require_once __DIR__ . '/utils/middleware.php';
require_once __DIR__ . '/utils/JsonDB.php';
checkAuth();

header('Content-Type: application/json');
$db = new JsonDB('scripts');
$scripts = $db->read() ?? [];

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode($scripts);
    exit;
}

if ($method === 'PUT' || $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        $data = $_POST;
    }

    $scripts['gtm'] = $data['gtm'] ?? $scripts['gtm'] ?? '';
    $scripts['analytics'] = $data['analytics'] ?? $scripts['analytics'] ?? '';
    $scripts['facebook_pixel'] = $data['facebook_pixel'] ?? $scripts['facebook_pixel'] ?? '';
    
    $db->write($scripts);
    echo json_encode(['success' => true, 'scripts' => $scripts]);
    exit;
}
