<?php
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

require_once __DIR__ . '/utils/middleware.php';
require_once __DIR__ . '/utils/JsonDB.php';

$db = new JsonDB('combos');

$combos = $db->read() ?? [];

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode($combos);
    exit;
}

checkAuth();

if ($method === 'POST') {
    $id = $_POST['id'] ?? null;
    $name = $_POST['name'] ?? '';
    $discount = $_POST['discount'] ?? 0;
    $products = isset($_POST['products']) ? json_decode($_POST['products'], true) : [];
    $is_active = isset($_POST['is_active']) ? filter_var($_POST['is_active'], FILTER_VALIDATE_BOOLEAN) : true;
    
    $imagePath = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $filename = time() . '_combo_' . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            $imagePath = 'uploads/' . $filename;
        }
    }

    if ($id) {
        $found = false;
        foreach ($combos as &$combo) {
            if ($combo['id'] === $id) {
                $combo['name'] = $name;
                $combo['discount'] = $discount;
                $combo['products'] = $products;
                $combo['is_active'] = $is_active;
                if ($imagePath !== '') {
                    if (isset($combo['image']) && file_exists(__DIR__ . '/../' . $combo['image'])) {
                        unlink(__DIR__ . '/../' . $combo['image']);
                    }
                    $combo['image'] = $imagePath;
                }
                $found = true;
                break;
            }
        }
        if ($found) {
            $db->write($combos);
            echo json_encode(['success' => true]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Combo not found']);
        }
    } else {
        $newCombo = [
            'id' => uniqid('combo_'),
            'name' => $name,
            'discount' => $discount,
            'products' => $products,
            'is_active' => $is_active,
            'image' => $imagePath
        ];
        $combos[] = $newCombo;
        $db->write($combos);
        echo json_encode(['success' => true, 'combo' => $newCombo]);
    }
    exit;
}

if ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? '';
    
    $initialCount = count($combos);
    
    foreach ($combos as $c) {
        if ($c['id'] === $id && !empty($c['image'])) {
            $imgPath = __DIR__ . '/../' . $c['image'];
            if (file_exists($imgPath)) {
                unlink($imgPath);
            }
            break;
        }
    }

    $combos = array_filter($combos, function($c) use ($id) {
        return $c['id'] !== $id;
    });
    $combos = array_values($combos);
    
    if (count($combos) < $initialCount) {
        $db->write($combos);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false]);
    }
    exit;
}
