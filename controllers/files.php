<?php

if ($sMethod == 'list_files') {
}

if ($sMethod == 'list_images') {
}

if ($sMethod == 'upload_image') {
    $oImage = R::dispense(T_IMAGES);
    // var_export($_FILES['image']);

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