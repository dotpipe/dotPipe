<?php
session_start();    
$time = "jsons/json".time().".json";
file_put_contents($time, $_GET['modal']);
chmod($time, 777);
printf('<article><a href="%s">Your file is %s</a></article>',$time,$time);
?>
