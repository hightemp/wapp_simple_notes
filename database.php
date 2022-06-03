<?php

ini_set('display_errors', 1);

include_once("./config.php");
include_once("rb.php");
include_once("lib.php");

// Config::fnLoad();

define('T_CATEGORIES', 'tcategories');
define('T_NOTES', 'tnotes');

define('T_FILES', 'tfiles');
define('T_IMAGES', 'timages');

define('T_TAGS', 'ttags');
define('T_TAGS_TO_OBJECTS', 'ttagstoobjectss');

fnConnectDatabase();

define('PROJECT_PATH', fnGetSelectedProjectPath());
define('PROJECT', fnGetSelectedDatabase());

$sNP = "/data/".PROJECT."/notes";
$sFNP = PROJECT_PATH."notes";
$sFFP = PROJECT_PATH."resources/files";
$sIP = "/data/".PROJECT."/resources/images";
$sFIP = PROJECT_PATH."resources/images";