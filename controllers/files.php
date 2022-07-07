<?php

if ($sMethod == 'list_files') {
    $sFilterRules = " 1 = 1";
    if (isset($aRequest['filterRules'])) {
        $aRequest['filterRules'] = json_decode($aRequest['filterRules']);
        $sFilterRules = fnGenerateFilterRules($aRequest['filterRules']);
    }

    $sOffset = fnPagination($aRequest['page'], $aRequest['rows']);
    $aResult = [];


    $aLinks = R::findAll(T_FILES, "{$sFilterRules} ORDER BY id DESC {$sOffset}", []);
    $aResult['total'] = R::count(T_FILES, "{$sFilterRules}");

    foreach ($aItems as $oItem) {
        $oItem->tags = fnGetTagsAsStringList($oItem->id, T_FILES) ?: '';
    }

    $aResult['rows'] = array_values((array) $aLinks);

    die(json_encode($aResult, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

    // $aResult = R::findAll(T_FILES, "ORDER BY id DESC");

    // foreach ($aResult as $oItem) {
    //     $oItem->tags = fnGetTagsAsStringList($oItem->id, T_FILES) ?: '';
    // }

    // die(json_encode(array_values($aResult)));
}

if ($sMethod == 'upload_files') {
    preg_match("/(\w+)$/", $_FILES['file']['type'], $aM);

    $oFile = R::dispense(T_FILES);

    $oFile->created_at = date("Y-m-d H:i:s");
    $oFile->updated_at = date("Y-m-d H:i:s");
    $oFile->timestamp = time();
    $oFile->name = $_FILES['file']['name'];
    $oFile->type = $_FILES['file']['type'];
    $oFile->filename = $oFile->timestamp.".".@$aM[1];

    R::store($oFile);

    $sFilePath = $sFFP."/".$oFile->filename;
    $sRelFilePath = $sFP."/".$oFile->filename;
    copy($_FILES['file']['tmp_name'], $sFilePath);
    
    die(json_encode(["data" => [ "filePath" => $sRelFilePath ]]));
}

if ($sMethod == 'delete_file') {
    $oFile = R::findOne(T_FILES, "id = ?", [$aRequest['id']]);
    $sFilePath = $sFIP."/".$oFile->filename;
    unlink($sFilePath);
    R::trashBatch(T_FILES, [$aRequest['id']]);
    die(json_encode([]));
}

if ($sMethod == 'update_file') {
    $oFile = R::findOne(T_FILES, "id = ?", [$aRequest['id']]);

    $oFile->updated_at = date("Y-m-d H:i:s");
    $oFile->name = $aRequest['name'];
    $oFile->type = $aRequest['type'];
    $oFile->filename = $aRequest['filename'];

    if ($aRequest['tags_list']) {
        fnSetTags($oFile->id, T_FILES, explode(",", $aRequest['tags_list']));
    }

    R::store($oFile);

    die(json_encode([
        "id" => $oFile->id, 
        "name" => $oFile->name
    ]));
}




if ($sMethod == 'list_images') {
    $sFilterRules = " 1 = 1";
    if (isset($aRequest['filterRules'])) {
        $aRequest['filterRules'] = json_decode($aRequest['filterRules']);
        $sFilterRules = fnGenerateFilterRules($aRequest['filterRules']);
    }

    $sOffset = fnPagination($aRequest['page'], $aRequest['rows']);
    $aResult = [];


    $aLinks = R::findAll(T_IMAGES, "{$sFilterRules} ORDER BY id DESC {$sOffset}", []);
    $aResult['total'] = R::count(T_IMAGES, "{$sFilterRules}");

    foreach ($aItems as $oItem) {
        $oItem->tags = fnGetTagsAsStringList($oItem->id, T_IMAGES) ?: '';
    }

    $aResult['rows'] = array_values((array) $aLinks);

    die(json_encode($aResult, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    // $aResult = R::findAll(T_IMAGES, "ORDER BY id DESC");

    // foreach ($aResult as $oItem) {
    //     $oItem->tags = fnGetTagsAsStringList($oItem->id, T_IMAGES) ?: '';
    // }

    // die(json_encode(array_values($aResult)));
}

if ($sMethod == 'get_image') {
    $aResponse = R::findOne(T_IMAGES, "id = ?", [$aRequest['id']]);
    die(json_encode($aResponse));
}

if ($sMethod == 'delete_image') {
    $oImage = R::findOne(T_IMAGES, "id = ?", [$aRequest['id']]);
    $sFilePath = $sFIP."/".$oImage->filename;
    unlink($sFilePath);
    R::trashBatch(T_IMAGES, [$aRequest['id']]);
    die(json_encode([]));
}

if ($sMethod == 'update_image') {
    $oImage = R::findOne(T_IMAGES, "id = ?", [$aRequest['id']]);

    $oImage->updated_at = date("Y-m-d H:i:s");
    $oImage->name = $aRequest['name'];
    $oImage->type = $aRequest['type'];
    $oImage->filename = $aRequest['filename'];

    if ($aRequest['tags_list']) {
        fnSetTags($oImage->id, T_IMAGES, explode(",", $aRequest['tags_list']));
    }

    R::store($oImage);

    die(json_encode([
        "id" => $oImage->id, 
        "name" => $oImage->name
    ]));
}

if ($sMethod == 'upload_image') {
    preg_match("/(\w+)$/", $_FILES['file']['type'], $aM);
    $sExt = @$aM[1];

    $sTable = T_FILES;
    $sF = $sFFP;
    $sR = $sBFP;

    if (in_array($sExt, ["jpg", "jpeg", "png", "gif", "webm"])) {
        $sTable = T_IMAGES;
        $sF = $sFIP;
        $sR = $sBIP;
    }

    $sHash = md5_file($_FILES['file']['tmp_name']);
    $sFileName = $sHash.".".$sExt;

    $oFile = R::findOne($sTable, "filename = ?", [$sFileName]);

    if (!$oFile) {
        $oFile = R::dispense($sTable);

        $oFile->created_at = date("Y-m-d H:i:s");
        $oFile->updated_at = date("Y-m-d H:i:s");
        $oFile->timestamp = time();
        $oFile->name = $_FILES['file']['name'];
        $oFile->type = $_FILES['file']['type'];
        $oFile->filename = $sFileName;

        R::store($oFile);

        $sFilePath = $sF."/".$oFile->filename;
        copy($_FILES['file']['tmp_name'], $sFilePath);
    }

    $sRelFilePath = $sR."/".$oFile->filename;
    
    die(json_encode(["location" => $sRelFilePath]));
    // die(json_encode(["data" => [ "filePath" => $sRelFilePath ]]));
}