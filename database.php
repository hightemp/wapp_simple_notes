<?php

include_once("./config.php");
include_once("rb.php");

Config::fnLoad();

define('T_CATEGORIES', 'tcategories');
define('T_CATEGORIES_OWN_LIST', 'ownTcategoriesList');
define('T_CATEGORIES_OWN', 'ownTcategories');
define('T_NOTES', 'tnotes');
define('T_RANDOM_NOTES', 'trandomnotes');
define('T_FAVORIETES', 'tfavorietes');
define('T_NOTES_OWN', 'ownTnotes');
define('T_TASKS', 'ttasks');
define('T_FILES', 'tfiles');
define('T_IMAGES', 'timages');

if (Config::$aOptions["database"]["schema"] == "sqlite") {
    R::setup('sqlite:./db/dbfile.db');
} else {
    R::setup('mysql:host=localhost;dbname=mydatabase', 'user', 'password' );
}

if(!R::testConnection()) die('No DB connection!');