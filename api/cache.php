<?php
require_once __DIR__ . '/utils/middleware.php';
require_once __DIR__ . '/utils/JsonDB.php';
checkAuth();

header('Content-Type: application/json');
$db = new JsonDB('cache_config');
$cacheConfig = $db->read() ?? ['enabled' => false];

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode($cacheConfig);
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['action']) && $data['action'] === 'clear') {
        $cacheDir = __DIR__ . '/../cache/';
        if (is_dir($cacheDir)) {
            $files = glob($cacheDir . '*');
            foreach($files as $file) {
                if(is_file($file)) {
                    unlink($file);
                }
            }
        }
        echo json_encode(['success' => true, 'message' => 'Caché limpiada con éxito']);
        exit;
    }

    if (isset($data['enabled'])) {
        $cacheConfig['enabled'] = (bool)$data['enabled'];
        $db->write($cacheConfig);
        echo json_encode(['success' => true, 'cacheConfig' => $cacheConfig]);
        exit;
    }
}
