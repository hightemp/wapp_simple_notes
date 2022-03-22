<?php

if ($sMethod == 'list_last_random_notes') {
    $aNotes = R::findAll(T_RANDOM_NOTES, "ORDER BY id DESC");
    $aResult = [];

    foreach ($aNotes as $oNote) {
        $aResult[] = [
            'id' => $oNote->id,
            'text' => $oNote->text,
            'created_at' => $oNote->created_at,
        ];
    }

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'delete_random_note') {
    R::trashBatch(T_RANDOM_NOTES, [$aRequest['id']]);
    die(json_encode([]));
}

if ($sMethod == 'update_random_note') {
    $oNote = R::findOne(T_RANDOM_NOTES, "id = ?", [$aRequest['id']]);

    $oNote->updated_at = date("Y-m-d H:i:s");
    $oNote->text = $aRequest['text'];

    R::store($oNote);

    die(json_encode([
        "id" => $oNote->id, 
        "text" => $oNote->text
    ]));
}

if ($sMethod == 'create_random_note') {    
    $oNote = R::dispense(T_RANDOM_NOTES);

    $oNote->created_at = date("Y-m-d H:i:s");
    $oNote->updated_at = date("Y-m-d H:i:s");
    $oNote->timestamp = time();
    $oNote->text = $aRequest['text'];

    R::store($oNote);

    die(json_encode([
        "id" => $oNote->id, 
        "text" => $oNote->text
    ]));
}