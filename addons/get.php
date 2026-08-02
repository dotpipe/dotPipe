<?php
$token = $_GET["token"] ?? '';
$user = $_GET["user"] ?? '';
header('Content-Type: application/json; charset=utf-8');

if (!is_string($token) || !preg_match('/\\A[A-Za-z0-9_-]+\\z/', $token) || !is_string($user) || $user === '') {
  http_response_code(400);
  echo json_encode(["error" => "A valid token and user are required."]);
  exit;
}

$file = __DIR__ . "/sessions/$token.json";

if (!file_exists($file)) {
  echo json_encode([]);
  exit;
}

$chat = json_decode(file_get_contents($file), true);
if (!is_array($chat) || !isset($chat['messages']) || !is_array($chat['messages'])) {
  http_response_code(500);
  echo json_encode(["error" => "Invalid session data."]);
  exit;
}
$new = [];

foreach ($chat["messages"] as $id => &$msg) {
  $msg["deliveredTo"] = is_array($msg["deliveredTo"] ?? null) ? $msg["deliveredTo"] : [];
  if (!in_array($user, $msg["deliveredTo"], true)) {
    if (isset($msg["type"]) && in_array($msg["type"], ["grant", "ban"], true) && ($msg["target"] ?? null) !== $user) {
      continue;
    }
    $new[$id] = $msg;
    $msg["deliveredTo"][] = $user;
  }
}

$chat["messages"] = array_filter($chat["messages"], function($msg) {
  return count($msg["deliveredTo"]) < 10; // Adjust based on group size
});

if (empty($chat["messages"])) unlink($file);
else file_put_contents($file, json_encode($chat), LOCK_EX);

echo json_encode(array_values($new));
?>
