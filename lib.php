<?php

include_once("./config.php");

function fnZipDataFolder()
{
    $sFilePath = "/tmp/{$_SERVER['SERVER_NAME']}_".PROJECT."_".time().".zip";

    fnZipFolder(PROJECT_PATH, $sFilePath);

    return $sFilePath;
}

function fnZipFolder($sFolder, $sFilePath)
{
    // Get real path for our folder
    $rootPath = realpath($sFolder);

    // Initialize archive object
    $zip = new ZipArchive();
    $zip->open($sFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

    // Create recursive directory iterator
    /** @var SplFileInfo[] $files */
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($rootPath),
        RecursiveIteratorIterator::LEAVES_ONLY
    );

    foreach ($files as $name => $file)
    {
        // Skip directories (they would be added automatically)
        if (!$file->isDir())
        {
            // Get real and relative path for current file
            $filePath = $file->getRealPath();
            $relativePath = substr($filePath, strlen($rootPath) + 1);

            // Add current file to archive
            $zip->addFile($filePath, $relativePath);
        }
    }

    // Zip archive will be created only after closing object
    $zip->close();
}

function fnBuildRecursiveCategoriesList(&$aResult, $aCategories) 
{
    $aResult = [];

    foreach ($aCategories as $oCategory) {
        $aTreeChildren = [];

        $aChildren = R::findAll(T_CATEGORIES, " tcategories_id = {$oCategory->id}");
        fnBuildRecursiveCategoriesList($aTreeChildren, $aChildren);

        $aNotes = R::findAll(T_NOTES, " tcategories_id = {$oCategory->id}");

        $aResult[] = [
            'id' => $oCategory->id,
            'name' => $oCategory->name,
            'children' => $aTreeChildren,
            'children_notes' => $aNotes,
        ];
    }
}

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