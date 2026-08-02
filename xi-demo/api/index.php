<?php
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['status' => '200 READY', 'service' => 'xi-xi-demo-api', 'timestamp' => gmdate('c'), 'message' => 'The API endpoint is live.']);
