<?php

ini_set('display_errors', 1);

include_once("./config.php");
include_once("rb.php");
include_once("lib.php");

// Config::fnLoad();

define('T_CATEGORIES', 'tcategories');
define('T_NOTES', 'tnotes');

define('T_TABLES_CATEGORIES', 'ttablescategories');
define('T_TABLES', 'ttables');

define('T_RANDOM_NOTES', 'trandomnotes');
define('T_FAVORIETES', 'tfavorietes');
define('T_LINKS', 'tlinks');
define('T_TASKS', 'ttasks');
define('T_FILES', 'tfiles');
define('T_IMAGES', 'timages');

define('T_TAGS', 'ttags');
define('T_TAGS_TO_OBJECTS', 'ttagstoobjectss');

fnConnectDatabase();

define('PROJECT_PATH', fnGetSelectedProjectPath());

$sNP = "/data/notes";
$sFNP = PROJECT_PATH."notes";
$sTP = "/data/tables";
$sFTP = PROJECT_PATH."tables";
$sFFP = PROJECT_PATH."resources/files";
$sIP = "/data/resources/images";
$sFIP = PROJECT_PATH."resources/images";