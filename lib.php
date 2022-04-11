<?php

include_once("./config.php");

function fnGetSelectedProjectPath()
{
    $sDir = fnGetSelectedDatabase();
    return DATA_PATH."{$sDir}/";
}

function fnPreparePath($sPath)
{
    $sDir = fnGetSelectedProjectPath();
    return "{$sDir}{$sPath}";
}

function fnGetDatabasePath()
{
    $sDir = fnGetSelectedProjectPath();
    return "{$sDir}db/dbfile.db";
}

function fnGetDatabasesList()
{
    $aProjects = glob(DATA_PATH."*");
    return $aProjects;
}

function fnGetDatabasesListForDatalist()
{
    $aList = fnGetDatabasesList();
    $aList = array_map(function ($aI) { return [ "text" => $aI ]; }, $aList);
    return $aList;
}

function fnSelectDatabase($sDatabaseName)
{
    $_SESSION["database"] = $sDatabaseName;
}

function fnGetSelectedDatabase()
{
    return $_SESSION["database"] ?: "default";
}

function fnConnectDatabase()
{
    if (Config::$aOptions["database"]["schema"] == "sqlite") {
        $sPath = fnGetDatabasePath();
        R::setup("sqlite:{$sPath}");
    } 

    if(!R::testConnection()) die('No DB connection!');
}