<?php
// endpoint.php

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

if ($data['command'] === 'ping') {
    // Respond with ping status
    echo json_encode(["status" => "success", "message" => "Pong"]);
} elseif ($data['command'] === 'open') {
    // Handle the open command (could be initializing a session, etc.)
    echo json_encode(["status" => "success", "message" => "Connection Opened"]);
} elseif ($data['command'] === 'close') {
    // Handle closing the connection
    echo json_encode(["status" => "success", "message" => "Connection Closed"]);
} else {
    echo json_encode(["error" => "Unknown command"]);
}
?>
