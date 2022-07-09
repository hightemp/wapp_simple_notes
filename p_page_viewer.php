<?php

include_once("./database.php");

$sContent = "";
$iID = (int) @$_GET["id"];
if (isset($_GET["id"]) && $_GET["id"]) {
    $oNote = R::findOne(T_NOTES, "id = ?", [$iID]);

    $sContent = $oNote->content;
}

echo $sContent;
?>
<style>
body, html {
    font-family: Arial, sans-serif;
}
</style>