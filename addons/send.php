<?php
$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'];
$user = $data['user'];
$message = $data['message'];
$time = time();

$file = __DIR__ . "/sessions/$token.json";
if (!file_exists(dirname($file))) mkdir(dirname($file), 0755, true);
$chat = file_exists($file) ? json_decode(file_get_contents($file), true) : ["messages" => []];

$msgid = hash("sha256", $user . $message . $time);
$chat["messages"][$msgid] = [
  "message" => $message,
  "timestamp" => $time,
  "sender" => $user,
  "deliveredTo" => []
];

file_put_contents($file, json_encode($chat));
echo json_encode(["status" => "sent"]);
?>
