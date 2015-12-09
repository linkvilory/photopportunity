<?php

$imgBase64 = $_POST['imgBase64'];

if(!isset($_POST['imgBase64'])){
	exit(0);
	return 0;
}

$imgBase64 = str_replace('data:image/png;base64,', '', $imgBase64);
$imgBase64 = str_replace(' ', '+', $imgBase64);
$fileData = base64_decode($imgBase64);


$fileName = "repository/" . str_replace(" ","",str_replace(".","",microtime())) . '.png';
file_put_contents($fileName, $fileData);

echo $fileName;

?>
