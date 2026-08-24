<?php
require_once __DIR__ . '/utils/middleware.php';
require_once __DIR__ . '/utils/JsonDB.php';
checkAuth();

header('Content-Type: application/json');
$db = new JsonDB('users');
$users = $db->read() ?? [];

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $safeUsers = array_map(function($u) {
        unset($u['password_hash']);
        return $u;
    }, $users);
    echo json_encode($safeUsers);
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Username and password required']);
        exit;
    }

    $newUser = [
        'id' => uniqid(),
        'username' => $username,
        'password_hash' => password_hash($password, PASSWORD_BCRYPT)
    ];

    $users[] = $newUser;
    $db->write($users);

    unset($newUser['password_hash']);
    echo json_encode(['success' => true, 'user' => $newUser]);
    exit;
}

if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? '';
    
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID required']);
        exit;
    }

    $found = false;
    foreach ($users as &$user) {
        if ($user['id'] === $id) {
            if (!empty($data['username'])) {
                $user['username'] = $data['username'];
            }
            if (!empty($data['password'])) {
                $user['password_hash'] = password_hash($data['password'], PASSWORD_BCRYPT);
            }
            $found = true;
            break;
        }
    }

    if ($found) {
        $db->write($users);
        echo json_encode(['success' => true, 'message' => 'User updated']);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
    exit;
}

if ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? '';

    $initialCount = count($users);
    $users = array_filter($users, function($u) use ($id) {
        return $u['id'] !== $id;
    });
    $users = array_values($users);

    if (count($users) < $initialCount) {
        $db->write($users);
        echo json_encode(['success' => true, 'message' => 'User deleted']);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
    exit;
}
