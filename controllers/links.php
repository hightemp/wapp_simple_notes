<?php

if ($sMethod == 'list_last_links') {
    $aLinks = R::findAll(T_LINKS, "ORDER BY id DESC");
    $aResult = [];

    foreach ($aLinks as $oLink) {
        $aResult[] = [
            'id' => $oLink->id,
            'name' => $oLink->name,
            'url' => $oLink->url,
            'created_at' => $oLink->created_at,
        ];
    }

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'delete_link') {
    R::trashBatch(T_LINKS, [$aRequest['id']]);
    die(json_encode([]));
}

if ($sMethod == 'update_link') {
    $oLink = R::findOne(T_LINKS, "id = ?", [$aRequest['id']]);

    $oLink->updated_at = date("Y-m-d H:i:s");
    $oLink->name = $aRequest['name'];
    $oLink->url = $aRequest['url'];

    R::store($oLink);

    die(json_encode([
        "id" => $oLink->id, 
        "text" => $oLink->name
    ]));
}

if ($sMethod == 'create_link') {    
    $oLink = R::dispense(T_LINKS);

    $oLink->created_at = date("Y-m-d H:i:s");
    $oLink->updated_at = date("Y-m-d H:i:s");
    $oLink->timestamp = time();

    $oLink->name = $aRequest['name'];
    $oLink->url = $aRequest['url'];

    R::store($oLink);

    die(json_encode([
        "id" => $oLink->id, 
        "text" => $oLink->name
    ]));
}