<?php
require_once __DIR__ . '/utils/middleware.php';
require_once __DIR__ . '/utils/JsonDB.php';
checkAuth();

header('Content-Type: application/json');
$db = new JsonDB('products');
$products = $db->read() ?? [];

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode($products);
    exit;
}

if ($method === 'POST') {
    $id = $_POST['id'] ?? null;
    $name = $_POST['name'] ?? '';
    $price = $_POST['price'] ?? '';
    $button_url = $_POST['button_url'] ?? '';
    $imagePath = '';

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $filename = time() . '_' . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            $imagePath = 'uploads/' . $filename;
        }
    }

    if ($id) {
        $found = false;
        foreach ($products as &$product) {
            if ($product['id'] === $id) {
                if ($name !== '') $product['name'] = $name;
                if ($price !== '') $product['price'] = $price;
                if ($button_url !== '') $product['button_url'] = $button_url;
                if ($imagePath !== '') {
                    // Delete old image if it exists
                    if (isset($product['image']) && file_exists(__DIR__ . '/../' . $product['image'])) {
                        unlink(__DIR__ . '/../' . $product['image']);
                    }
                    $product['image'] = $imagePath;
                }
                $found = true;
                break;
            }
        }
        if ($found) {
            $db->write($products);
            echo json_encode(['success' => true, 'message' => 'Product updated']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Product not found']);
        }
    } else {
        $newProduct = [
            'id' => uniqid(),
            'name' => $name,
            'price' => $price,
            'button_url' => $button_url,
            'image' => $imagePath
        ];
        $products[] = $newProduct;
        $db->write($products);
        echo json_encode(['success' => true, 'product' => $newProduct]);
    }
    exit;
}

if ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? '';

    $initialCount = count($products);
    
    // Find image to delete
    foreach ($products as $p) {
        if ($p['id'] === $id && !empty($p['image'])) {
            $imgPath = __DIR__ . '/../' . $p['image'];
            if (file_exists($imgPath)) {
                unlink($imgPath);
            }
            break;
        }
    }

    $products = array_filter($products, function($p) use ($id) {
        return $p['id'] !== $id;
    });
    $products = array_values($products);

    if (count($products) < $initialCount) {
        $db->write($products);
        echo json_encode(['success' => true, 'message' => 'Product deleted']);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Product not found']);
    }
    exit;
}
