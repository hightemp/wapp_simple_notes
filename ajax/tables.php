<?php

if ($sMethod == 'list_last_tables') {
    $aNotes = R::findAll(T_NOTES, "ORDER BY id DESC");
    $aResult = [];

    foreach ($aNotes as $oNote) {
        $aResult[] = [
            'id' => $oNote->id,
            'text' => $oNote->name,
            'name' => $oNote->name,
            'description' => $oNote->description,
            'created_at' => $oNote->created_at,
            'category_id' => $oNote->tcategories_id,
            'category' => $oNote->tcategories->name
        ];
    }

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'list_tables') {
    $aNotes = R::findAll(T_NOTES, "tcategories_id = ?", [$aRequest['category_id']]);
    $aResult = [];

    foreach ($aNotes as $oNote) {
        $aResult[] = [
            'id' => $oNote->id,
            'text' => $oNote->name,
            'name' => $oNote->name,
            'description' => $oNote->description,
            'created_at' => $oNote->created_at,
            'category_id' => $oNote->tcategories_id,
            'category' => $oNote->tcategories->name
        ];
    }

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'get_table') {
    $oNote = R::findOne(T_NOTES, "id = ?", [$aRequest['id']]);
    $oNote["content"] = "".file_get_contents("{$sFNP}/{$oNote->timestamp}.md");
    die(json_encode($oNote));
}

if ($sMethod == 'delete_table') {
    R::trashBatch(T_NOTES, [$aRequest['id']]);
    die();
}

if ($sMethod == 'update_table_content') {
    $oNote = R::findOne(T_NOTES, "id = ?", [$aRequest['id']]);
    $oNote->updated_at = date("Y-m-d H:i:s");

    if (!$oNote->timestamp) {
        $oNote->timestamp = time();
        R::store($oNote);
    }
    
    file_put_contents("{$sFNP}/{$oNote->timestamp}.md", $aRequest['content']);
    die();
}

if ($sMethod == 'update_table') {
    $oNote = R::findOne(T_NOTES, "id = ?", [$aRequest['id']]);

    $oNote->updated_at = date("Y-m-d H:i:s");
    $oNote->name = $aRequest['name'];
    $oNote->description = $aRequest['description'];
    // $oNote->tcategories = R::findOne(T_CATEGORIES, "id = ?", $aRequest['category_id']);

    R::store($oNote);

    die(json_encode([
        "id" => $oNote->id, 
        "name" => $oNote->name
    ]));
}

if ($sMethod == 'create_table') {    
    $oNote = R::dispense(T_NOTES);

    $oNote->created_at = date("Y-m-d H:i:s");
    $oNote->updated_at = date("Y-m-d H:i:s");
    $oNote->timestamp = time();
    $oNote->name = $aRequest['name'];
    $oNote->description = $aRequest['description'];
    $oNote->tcategories = R::findOne(T_CATEGORIES, "id = ?", [$aRequest['category_id']]);

    file_put_contents("{$sFNP}/{$oNote->timestamp}.md", "");

    R::store($oNote);

    die(json_encode([
        "id" => $oNote->id, 
        "name" => $oNote->name
    ]));
}