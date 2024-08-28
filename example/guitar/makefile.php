<?php
session_start();    
$time = "jsons/json".time().".json";
file_put_contents($time, $_GET['modal']);
chmod($time, 777);
printf('<br><article><a href="%s">This is a PHP button %s</a></article>',$time,$time);
?>
