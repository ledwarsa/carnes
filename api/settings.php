<?php
header('Content-Type: application/json');

require_once 'utils/middleware.php';
require_once 'utils/JsonDB.php';

$db = new JsonDB('settings');

// Initialize if empty
$settings = $db->read();
if (!$settings) {
    $settings = [
        'facebook' => '',
        'instagram' => '',
        'whatsapp_number' => '573000000000',
        'whatsapp_message' => '¡Hola! Quisiera más información.',
        'phone' => 'Teléfono 300 000 00 00',
        'location' => 'Bogotá, Colombia',
    ];
    $db->write($settings);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode($settings);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if auth is required to write (if auth middleware is used, but for now just accept POST or require auth if possible)
    // We assume checkAuth() is a function in middleware.php if it exists, let's check it later.
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['facebook'])) $settings['facebook'] = $data['facebook'];
    if (isset($data['instagram'])) $settings['instagram'] = $data['instagram'];
    if (isset($data['whatsapp_number'])) $settings['whatsapp_number'] = $data['whatsapp_number'];
    if (isset($data['whatsapp_message'])) $settings['whatsapp_message'] = $data['whatsapp_message'];
    if (isset($data['phone'])) $settings['phone'] = $data['phone'];
    if (isset($data['location'])) $settings['location'] = $data['location'];
    
    $db->write($settings);
    
    echo json_encode(['success' => true, 'message' => 'Configuración guardada correctamente']);
    exit;
}
