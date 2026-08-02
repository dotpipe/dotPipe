<?php

header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'version' => 1,
    'source' => 'dashboard/xi-extension.php',
    'controlPlane' => 'control-panel.php',
    'frontend' => [
        'bodyTag' => [
            'data-api-source' => 'background-php',
            'data-shell-mode' => 'hollow',
        ],
        'css' => ':root { --extension-accent: #b58cff; } .status-dot { box-shadow: 0 0 0 3px rgba(181, 140, 255, .12); }',
    ],
    'apis' => [
        [
            'id' => 'background-php-ping',
            'name' => 'Background PHP ping',
            'method' => 'POST',
            'url' => '../endpoint.php',
            'headers' => "{\n  \"Content-Type\": \"application/json\"\n}",
            'body' => "{\n  \"command\": \"ping\"\n}",
            'source' => 'background-php',
        ],
        [
            'id' => 'menu-page-manifest',
            'name' => 'Menu page manifest',
            'method' => 'GET',
            'url' => '../activeMenu/menu_pages/collective.php',
            'headers' => '{}',
            'body' => '',
            'source' => 'background-php',
        ],
    ],
], JSON_PRETTY_PRINT);
