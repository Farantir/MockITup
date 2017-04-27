<?php
$data = $_POST['data'];
$f = fopen('testonmobile.html', 'w+');
$htmlfile = '<!DOCTYPE html>
<html>
    <head>
    <meta charset="utf-8">
    <title>MockITup</title>
    <link rel="stylesheet" type="text/css" href="main.css">
    <link rel="shortcut icon" href="Mockingbird_Illustration_Color4.png"/>
    <script src="main.js"></script>
    <script src="onLoad.js"></script>
    <script src="elements.js"></script>
    <script src="testrenderer.js"></script>
    <script src="logik.js"></script>
    <script src="test_logick.js"></script>
    <script src="newElement.js"></script>
    <script src="save.js"></script>
    </head>
        <body onload="mobile_test_render()" onResize="">
	<div id="testscreencontainer">'.$data.'</div>
</body>
</html>';


fwrite($f, $htmlfile);
fclose($f);

print "http://192.168.178.26"."/MockITup/testonmobile.html";
?>
