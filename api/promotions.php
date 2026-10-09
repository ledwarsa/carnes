<?php
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
require_once __DIR__ . '/utils/middleware.php';
require_once __DIR__ . '/utils/JsonDB.php';

$db = new JsonDB('promotions');
$promos = $db->read() ?? [];
$method = $_SERVER['REQUEST_METHOD'];

// Public read access for frontend logic
if ($method === 'GET') {
    echo json_encode($promos);
    exit;
}

// Require admin for modifications
checkAuth();

if ($method === 'POST') {
    // Read JSON body
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid JSON']);
        exit;
    }

    $id = $data['id'] ?? null;
    $name = $data['name'] ?? '';
    $discount = floatval($data['discount'] ?? 0);
    $type = $data['type'] ?? 'global'; // global, category, product
    $target_ids = $data['target_ids'] ?? []; // array of category names or product ids
    
    $schedule_type = $data['schedule_type'] ?? 'always'; // always, date_range, days_of_week
    $start_date = $data['start_date'] ?? '';
    $end_date = $data['end_date'] ?? '';
    $days = $data['days'] ?? []; // array of 0-6 (0=Sun, 1=Mon)
    
    $is_active = isset($data['is_active']) ? (bool)$data['is_active'] : true;

    if (empty($name)) {
        http_response_code(400);
        echo json_encode(['message' => 'El nombre es requerido']);
        exit;
    }

    if ($id) {
        $index = -1;
        foreach ($promos as $i => $p) {
            if ($p['id'] === $id) { $index = $i; break; }
        }
        if ($index !== -1) {
            $promos[$index] = array_merge($promos[$index], [
                'name' => $name,
                'discount' => $discount,
                'type' => $type,
                'target_ids' => $target_ids,
                'schedule_type' => $schedule_type,
                'start_date' => $start_date,
                'end_date' => $end_date,
                'days' => $days,
                'is_active' => $is_active,
                'updated_at' => date('c')
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Promoción no encontrada']);
            exit;
        }
    } else {
        $id = 'promo_' . time();
        $promos[] = [
            'id' => $id,
            'name' => $name,
            'discount' => $discount,
            'type' => $type,
            'target_ids' => $target_ids,
            'schedule_type' => $schedule_type,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'days' => $days,
            'is_active' => $is_active,
            'created_at' => date('c')
        ];
    }

    $db->write($promos);
    echo json_encode(['message' => 'Promoción guardada', 'id' => $id]);
    exit;
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? '';
    $promos = array_filter($promos, function($p) use ($id) { return $p['id'] !== $id; });
    $db->write(array_values($promos));
    echo json_encode(['message' => 'Promoción eliminada']);
    exit;
}

http_response_code(405);
echo json_encode(['message' => 'Method not allowed']);
