<?php

include_once("./database.php");
include_once("./vendor/autoload.php");

$aNotes = R::findAll(T_NOTES);

foreach ($aNotes as $oNote) {
    $parser = new \cebe\markdown\Markdown();
    $oNote->content = str_replace(["<p>","</p>"], "", $oNote->content);
    $oNote->content = $parser->parse($oNote->content);
    R::store($oNote);
    echo "{$oNote->id}<br>";
    echo "<textarea>{$oNote->content}</textarea><br>";
}