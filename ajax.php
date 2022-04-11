<?php 

include_once("./database.php");

$aRequest = $_REQUEST; // json_decode(file_get_contents("php://input"), true);
$sMethod = $_REQUEST['method'];

include_once("./models/tags.php");

include_once("./controllers/categories.php");
include_once("./controllers/favorietes.php");
include_once("./controllers/notes.php");
include_once("./controllers/random_notes.php");
include_once("./controllers/tables.php");
include_once("./controllers/tables_categories.php");
include_once("./controllers/tasks.php");
include_once("./controllers/files.php");
include_once("./controllers/links.php");
include_once("./controllers/tags.php");
include_once("./controllers/search.php");
