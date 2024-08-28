<?php
$arrow = $_GET['arrow'];

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

$page = "Main";
foreach ($arrow_menu as $key => $value) {
    if (($arrow) == $value) {
        $page = $key;
        break;
    }
}

$lc = strtolower($page);

$date = time();

$file = '{
    "body": {
        "tagname": "div",
        "id": "main",
        "class": "mouse",
        "textContent":"'.$page.'",
        "display": "main;",
        "footer": {
            "tagname": "div",
            "id": "footer",
            "class": "modala modala-multi-first",
            "display": "footer;main",
            "textContent": "Today is '.$date.'",
            "ajax": "'.$lc.'.php",
            "query": "date:'.$date.'",
            "insert": "main-body",
            "img-block": {
                "tagname": "img",
                "id": "footer-img",
                "class": "modala",
                "display": "main;footer;",
                "ajax": "'.$lc.'.php",
                "query": "date:'.$date.'",
                "insert": "main-body"
            }
        }
    }
}';

$f = json_decode($file);

$u = json_encode($f, JSON_PRETTY_PRINT);

echo $u;