<?php

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$command = is_array($data) ? ($data['command'] ?? null) : null;
$responses = [
    'ping' => ['status' => 'success', 'message' => 'Pong'],
    'open' => ['status' => 'success', 'message' => 'Connection Opened'],
    'close' => ['status' => 'success', 'message' => 'Connection Closed'],
];

if (!isset($responses[$command])) {
    http_response_code(400);
    echo json_encode(['error' => 'Unknown command']);
    exit;
}

echo json_encode($responses[$command]);
