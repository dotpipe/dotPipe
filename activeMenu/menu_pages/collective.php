<?php
session_start();

$arrow_menu = array(
    "Main" => "1",
    "Electric" => "2",
    "Acoustic" => "3",
    "Bass" => "4",
    "Pedals" => "5",
    "Amps" => "6",
    "Software" => "7",
    "Combos" => "8",
    "Video" => "9",
    "Blog" => "10",
    "YouTube" => "11"
);

$keys = [];
foreach ($arrow_menu as $key => $value) {
    $keys[] = $key;
}

$file = '{';

for($i = 1 ; $i <= 11 ; $i++) {
    $file .= '
        "arrow'.$i.'": {
            "tagname": "p",
            "id": "main'.$i.'",
            "class": "mouse arrow'.$i.' modala",
            "innerHTML": "➤",
            "method": "GET",
            "tool-tip": "'. $keys[$i - 1]. ';;;1000;100",
            "ajax": "./getarrow.php",
            "name": "main",
            "value": "'.$i.'",
            "form-class": "arrow'.$i.'",
            "insert": "arrow-area"
        },';
}

$file = substr($file, 0, -1) . '}';

$f = json_decode($file);

$u = json_encode($f, JSON_PRETTY_PRINT);

echo $u;