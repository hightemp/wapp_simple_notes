<?php

if ($sMethod == 'list_files') {
    $aResult = R::findAll(T_FILES);

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'list_images') {
    $aResult = R::findAll(T_IMAGES);

    die(json_encode(array_values($aResult)));
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

    R::store($oImage);

    die(json_encode([
        "id" => $oImage->id, 
        "name" => $oImage->name
    ]));
}

if ($sMethod == 'create_image') {
    $oImage = R::dispense(T_IMAGES);

    $oImage->created_at = date("Y-m-d H:i:s");
    $oImage->updated_at = date("Y-m-d H:i:s");
    $oImage->timestamp = time();
    $oImage->name = $aRequest['name'];
    $oImage->type = $aRequest['type'];
    $oImage->filename = $aRequest['filename'];

    R::store($oImage);

    die(json_encode([
        "id" => $oImage->id, 
        "name" => $oImage->name
    ]));
}

if ($sMethod == 'upload_files') {
    $oFile = R::dispense(T_FILES);

    preg_match("/(\w+)$/", $_FILES['file']['type'], $aM);

    $oFile->created_at = date("Y-m-d H:i:s");
    $oFile->updated_at = date("Y-m-d H:i:s");
    $oFile->timestamp = time();
    $oFile->name = $_FILES['file']['name'];
    $oFile->type = $_FILES['file']['type'];
    $oFile->filename = $oFile->timestamp.".".@$aM[1];

    R::store($oFile);

    $sFilePath = $sFIP."/".$oFile->filename;
    $sRelFilePath = $sIP."/".$oFile->filename;
    copy($_FILES['file']['tmp_name'], $sFilePath);
    
    die(json_encode(["data" => [ "filePath" => $sRelFilePath ]]));
}

if ($sMethod == 'upload_image') {
    $oImage = R::dispense(T_IMAGES);

    preg_match("/(\w+)$/", $_FILES['image']['type'], $aM);

    $oImage->created_at = date("Y-m-d H:i:s");
    $oImage->updated_at = date("Y-m-d H:i:s");
    $oImage->timestamp = time();
    $oImage->name = $_FILES['image']['name'];
    $oImage->type = $_FILES['image']['type'];
    $oImage->filename = $oImage->timestamp.".".@$aM[1];

    R::store($oImage);

    $sFilePath = $sFIP."/".$oImage->filename;
    $sRelFilePath = $sIP."/".$oImage->filename;
    copy($_FILES['image']['tmp_name'], $sFilePath);
    
    die(json_encode(["data" => [ "filePath" => $sRelFilePath ]]));
}