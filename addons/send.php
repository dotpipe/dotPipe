<?php
header('Content-Type: application/json; charset=utf-8');
$data = json_decode(file_get_contents("php://input"), true);
$token = is_array($data) ? ($data['token'] ?? '') : '';
$user = is_array($data) ? ($data['user'] ?? '') : '';
$message = is_array($data) ? ($data['message'] ?? '') : '';

if (!is_string($token) || !preg_match('/\\A[A-Za-z0-9_-]+\\z/', $token) || !is_string($user) || $user === '' || !is_string($message)) {
  http_response_code(400);
  echo json_encode(["error" => "Valid token, user, and message are required."]);
  exit;
}

$time = time();

$file = __DIR__ . "/sessions/$token.json";
if (!file_exists(dirname($file))) mkdir(dirname($file), 0755, true);
$chat = file_exists($file) ? json_decode(file_get_contents($file), true) : ["messages" => []];
if (!is_array($chat) || !isset($chat['messages']) || !is_array($chat['messages'])) {
  $chat = ["messages" => []];
}

$msgid = hash("sha256", $user . $message . $time);
$chat["messages"][$msgid] = [
  "message" => $message,
  "timestamp" => $time,
  "sender" => $user,
  "deliveredTo" => []
];

file_put_contents($file, json_encode($chat), LOCK_EX);
echo json_encode(["status" => "sent"]);
?>
