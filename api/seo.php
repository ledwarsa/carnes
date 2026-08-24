<?php
require_once __DIR__ . '/utils/middleware.php';
require_once __DIR__ . '/utils/JsonDB.php';
checkAuth();

header('Content-Type: application/json');
$db = new JsonDB('seo');
$seo = $db->read() ?? [];

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode($seo);
    exit;
}

if ($method === 'PUT' || $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        $data = $_POST;
    }
    
    $seo['title'] = $data['title'] ?? $seo['title'] ?? '';
    $seo['description'] = $data['description'] ?? $seo['description'] ?? '';
    $seo['keywords'] = $data['keywords'] ?? $seo['keywords'] ?? '';
    
    $db->write($seo);
    echo json_encode(['success' => true, 'seo' => $seo]);
    exit;
}
