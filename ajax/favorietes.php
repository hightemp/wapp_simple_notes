<?php

if ($sMethod == 'list_last_fav_notes') {
    $aFavNotes = R::findAll(T_FAVORIETES, "ORDER BY id DESC");
    $aResult = [];

    foreach ($aFavNotes as $oFavNote) {
        $aResult[] = [
            'id' => $oFavNote->{T_NOTES_OWN}->id,
            'text' => $oFavNote->{T_NOTES_OWN}->name,
            'category_id' => $oFavNote->{T_NOTES_OWN}->tcategories_id,
            'category' => $oFavNote->{T_NOTES_OWN}->{T_CATEGORIES_OWN}->name
        ];
    }

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'get_fav_note') {
    $oFavNote = R::findOne(T_FAVORIETES, "id = ?", [$aRequest['id']]);
    $oNote = $oFavNote->{T_NOTES_OWN};
    $oNote["content"] = "".file_get_contents("{$sNP}/{$oNote->timestamp}.md");
    die(json_encode($oNote));
}

if ($sMethod == 'delete_note') {
    R::trashBatch(T_FAVORIETES, [$aRequest['id']]);
    die();
}

if ($sMethod == 'create_note') {    
    $oFavNote = R::dispense(T_FAVORIETES);

    $oNote = R::findOne(T_NOTES, 'id = ?', [$aRequest['id']]);
    $oFavNote->{T_NOTES_OWN} = $oNote;

    R::store($oFavNote);

    die(json_encode([
        "id" => $oFavNote->id, 
        "name" => $oFavNote->name
    ]));
}