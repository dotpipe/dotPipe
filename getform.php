
<?php
session_start();
$array = [];
if (isset($_GET))
{
    $i = 0;
    foreach ($_GET as $key => $value)
    {
        if ($_GET["value".$i] != null)
    
        $array = array_merge_recursive($array, array($_GET["key".$i] => $_GET["value".$i]));
        $i++;
    }
}
else
{
	echo "error";
	return;
}
echo json_encode(array("change" => $array), JSON_PRETTY_PRINT);

?>
