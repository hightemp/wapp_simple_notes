<?php 

include_once("./database.php");

$aRequest = $_REQUEST; // json_decode(file_get_contents("php://input"), true);
$sMethod = $_GET['method'];

include_once("./ajax/categories.php");
include_once("./ajax/favorietes.php");
include_once("./ajax/notes.php");
include_once("./ajax/random_notes.php");
include_once("./ajax/tables.php");
include_once("./ajax/tasks.php");
include_once("./ajax/files.php");
