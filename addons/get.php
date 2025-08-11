<?php
$token = $_GET["token"] ?? '';
$user = $_GET["user"] ?? '';
$file = __DIR__ . "/sessions/$token.json";

if (!file_exists($file)) {
  echo json_encode([]);
  exit;
}

$chat = json_decode(file_get_contents($file), true);
$new = [];

foreach ($chat["messages"] as $id => &$msg) {
  if (!in_array($user, $msg["deliveredTo"])) {
    if (isset($msg["type"]) && in_array($msg["type"], ["grant", "ban"]) && $msg["target"] !== $user) {
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
else file_put_contents($file, json_encode($chat));

echo json_encode(array_values($new));
?>
