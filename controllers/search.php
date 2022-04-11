<?php

if ($sMethod == 'search') {
    $sQ = $aRequest['query'];
    $aResult = [];

    $aObjects = [
        [T_NOTES, $sFNP, ".md"], 
        [T_TABLES, $sFTP, ".json"]
    ];

    foreach ($aObjects as $aObject) {
        $aFiles = glob($aObject[1]."/*".$aObject[2]);
        foreach ($aFiles as $sFilePath) {
            $sContent = file_get_contents($sFilePath);

            if (preg_match("/".preg_quote($sQ)."/ui", $sContent, $aM)) {
                $sRelPath = str_replace(PROJECT_PATH, "", $sFilePath);
                $sTimestamp = basename($sFilePath, $aObject[2]);
                $sType = $aObject[0];
                
                $oObject = R::findOne($sType, "timestamp = ?", [$sTimestamp]);
                if ($oObject) {
                    $aResult[] = [ 
                        "fullpath" => $sFilePath, 
                        "relpath" => $sRelPath, 
                        "content_id" => $oObject->id, 
                        "text" => $oObject->name, 
                        "created_at" => $oObject->created_at, 
                        "content_type" => $sType, 
                        "match" => $aM 
                    ];
                } else {
                    $aResult[] = [ 
                        "fullpath" => $sFilePath, 
                        "relpath" => $sRelPath, 
                        "content_id" => 0, 
                        "text" => "[ОШИБКА - УДАЛЕН]", 
                        "created_at" => "", 
                        "content_type" => $sType, 
                        "match" => $aM 
                    ];
                }
            }
        }
    }

    die(json_encode(array_values($aResult)));
}