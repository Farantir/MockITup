<?php
$data = $_POST['data'];
/*Create new unique file*/
$filename = time(); 
$f = fopen('published/'.$filename.'.html', 'w+');
$htmlfile = '<!DOCTYPE html>
<html>
    <head>
    <meta charset="utf-8">
    <title>MockITup</title>
    <link rel="stylesheet" type="text/css" href="../main.css">
    <link rel="shortcut icon" href="../Mockingbird_Illustration_Color4.png"/>
    <script src="../main.js"></script>
    <script src="../onLoad.js"></script>
    <script src="../elements.js"></script>
    <script src="../testrenderer.js"></script>
    <script src="../logik.js"></script>
    <script src="../test_logick.js"></script>
    <script src="../save.js"></script>
    </head>
        <body onload="mobile_test_render()" onResize="mobil_screen_onresize()">
	<div id="testscreencontainer">'.$data.'</div>
</body>
</html>';


fwrite($f, $htmlfile);
fclose($f);

print "http://".$_SERVER['SERVER_ADDR'].":".$_SERVER['SERVER_PORT']."/MockITup/published/".$filename.".html";

/*Delete all files older than 24h */
  $path = 'published/';
  if ($handle = opendir($path)) {
     while (false !== ($file = readdir($handle))) {
        if ((time()-filectime($path.$file)) >= 86400) {  
        	if (preg_match('/\.html$/i', $file)) {
              unlink($path.$file);}
        }
     }
   }

?>
