<?php

include_once("./config.php");

function fnFindImagesURLs($sContent)
{
    $aResult = [];
    
    if (preg_match_all("@<img[^>]*?src\s*=\s*[\"']([^>]*?)[\"'][^>]*?>@", $sContent, $aM)) {
        $aResult = array_merge($aResult, $aM[1]);
    }

    if (preg_match_all("@!\\[[^\\]]*?\\]\\(([^\\)]*?)\\)@", $sContent, $aM)) {
        $aResult = array_merge($aResult, $aM[1]);
    }

    return $aResult;
}

function fnDownloadFileFromURL($sURL, $sFilePath)
{
    if (ini_get('allow_url_fopen')) {
        copy($sURL, $sFilePath);
    } else {
        //This is the file where we save the    information
        $fp = fopen ($sFilePath, 'w+');
        //Here is the file we are downloading, replace spaces with %20
        $ch = curl_init(str_replace(" ","%20",$url));
        // make sure to set timeout to a high enough value
        // if this is too low the download will be interrupted
        curl_setopt($ch, CURLOPT_TIMEOUT, 600);
        // write curl response to file
        curl_setopt($ch, CURLOPT_FILE, $fp); 
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        // get curl response
        curl_exec($ch); 
        curl_close($ch);
        fclose($fp);
    }
}

function fnUploadImages($aImages)
{
    $aResult = [];

    foreach ($aImages as $sURL) {
        $sFileName = basename($sURL);
        preg_match("/\\.(\w+)$/", $sFileName, $aM);
        $sExt = $aM[1];

        $oFile = R::dispense(T_IMAGES);

        $oFile->created_at = date("Y-m-d H:i:s");
        $oFile->updated_at = date("Y-m-d H:i:s");
        $oFile->timestamp = time();
        $oFile->name = $sFileName;
        $oFile->type = $sExt;
        $oFile->filename = $oFile->timestamp.".".$sExt;
    
        R::store($oFile);

        $sFilePath = P_FIP."/".$oFile->filename;
        $sRelFilePath = P_BIP."/".$oFile->filename;

        $aResult[$sURL] = $sRelFilePath;

        fnDownloadFileFromURL($sURL, $sFilePath);
    }

    return $aResult ;
}

function fnUploadFromContent(&$sContent)
{
    $aImages = fnFindImagesURLs($sContent);
    $aImages = fnUploadImages($aImages);
    
    foreach ($aImages as $sURL => $sPath) {
        $sContent = str_replace($sURL, $sPath, $sContent);
    }
}

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