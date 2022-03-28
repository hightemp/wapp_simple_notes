<?php

if ($sMethod == 'list_last_fav_notes') {
    $aFavNotes = R::findAll(T_FAVORIETES, "ORDER BY id DESC");
    $aResult = [];

    foreach ($aFavNotes as $oFavNote) {
        $aResult[] = [
            'id' => $oFavNote->id,
            'note_id' => $oFavNote->tnotes->id,
            'created_at' => $oFavNote->tnotes->created_at,
            'text' => $oFavNote->tnotes->name,
            'category_id' => $oFavNote->tnotes->tcategories_id,
            'category' => $oFavNote->tnotes->tcategories->name
        ];
    }

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'get_fav_note') {
    $oFavNote = R::findOne(T_FAVORIETES, "id = ?", [$aRequest['id']]);
    $oNote = $oFavNote->tnotes;
    $oNote["content"] = "".file_get_contents("{$sNP}/{$oNote->timestamp}.md");
    die(json_encode($oNote));
}

if ($sMethod == 'delete_fav_note') {
    R::trashBatch(T_FAVORIETES, [$aRequest['id']]);
    die(json_encode([]));
}

if ($sMethod == 'create_fav_note') {    
    $oFavNote = R::dispense(T_FAVORIETES);

    $oNote = R::findOne(T_NOTES, 'id = ?', [$aRequest['id']]);
    $oFavNote->tnotes = $oNote;

    R::store($oFavNote);

    die(json_encode([
        "id" => $oFavNote->id, 
        "name" => $oFavNote->tnotes->name
    ]));
}