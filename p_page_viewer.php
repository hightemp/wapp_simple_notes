<?php

include_once("./database.php");

$sContent = "";
$iID = (int) @$_GET["id"];
if (isset($_GET["id"]) && $_GET["id"]) {
    $oNote = Notes::fnGetOne($_GET);

    $sContent = $oNote->content;
}

echo $sContent;
?>
<style>
body, html {
    font-family: Arial, sans-serif;
}
</style>

<link rel="stylesheet" href="<?php echo $sBA ?>/prism/themes/prism.min.css">
<script src="<?php echo $sBA ?>/prism/prism.js"></script>
<script src="<?php echo $sBA ?>/prism/plugins/autoloader/prism-autoloader.js"></script>