
<?php
$file = '{';

for($i = 1 ; $i <= 11 ; $i++) {
    $file .= '
        "arrow'.$i.'": {
            "tagname": "p",
            "id": "main",
            "style": "position:fixed;color:blue;height:25;width:10",
            "class": "arrow'.$i.' modala clear-node",
            "innerHTML": "►",
            "method": "get",
            "ajax": "getarrow.php",
            "name": "arrow",
            "value": "'.$i.'",
            "form-class": "arrow'.$i.'",
            "insert": "arrow-area"
        },';
}

$file = substr($file, 0, -1) . '}';

$f = json_decode($file);

$u = json_encode($f, JSON_PRETTY_PRINT);

echo $u;