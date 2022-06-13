<?php

function fnGetTagsIDs($iContentID, $sContentType) {
    $aTags = R::findAll(T_TAGS_TO_OBJECTS, 'content_id = ? AND content_type = ?', [$iContentID, $sContentType]);
    return array_map(function($oI) { return $oI->id; }, $aTags);
}

function fnGetTags($iContentID, $sContentType) {
    $aTags = R::findAll(T_TAGS_TO_OBJECTS, 'content_id = ? AND content_type = ?', [$iContentID, $sContentType]);
    return array_map(function($oI) { return $oI->ttags->name; }, $aTags);
}

function fnGetTagsAsStringList($iContentID, $sContentType) {
    return join(",", fnGetTags($iContentID, $sContentType));
}

function fnSetTags($iContentID, $sContentType, $aTags) {
    $aTagsIDs = [];
    foreach ($aTags as $sTag) {
        if (!trim($sTag)) continue;

        $oTag = R::findOrCreate(T_TAGS, [
            'name' => $sTag, 
        ]);

        R::store($oTag);

        $aTagsIDs[] = $oTag->id;
    }

    fnSetTagsByIDs($iContentID, $sContentType, $aTagsIDs);
}

function fnSetTagsByIDs($iContentID, $sContentType, $aTags) {
    R::exec("DELETE ? WHERE content_id='?' AND content_type='?'", [T_TAGS_TO_OBJECTS, $iContentID, $sContentType]);
    foreach ($aTags as $iTagID) {
        $oRelation = R::findOrCreate(T_TAGS_TO_OBJECTS, [
            'ttags_id' => $iTagID,
            'content_id' => $iContentID,
            'content_type' => $sContentType,
        ]);

        R::store($oRelation);
    }
}