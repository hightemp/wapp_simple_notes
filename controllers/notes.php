<?php

if ($sMethod == 'list_last_notes') {
    $aNotes = R::findAll(T_NOTES, "ORDER BY id DESC");
    $aResult = [];

    foreach ($aNotes as $oNote) {
        $aResult[] = [
            'id' => $oNote->id,
            'text' => $oNote->name,
            'name' => $oNote->name,
            'description' => $oNote->description,
            'created_at' => $oNote->created_at,
            'category_id' => $oNote->tcategories ? $oNote->tcategories->id : 0,
            'category' => $oNote->tcategories ? $oNote->tcategories->name : "",
            'tags' => fnGetTagsAsStringList($oNote->id, T_NOTES) ?: ''
        ];
    }

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'list_notes') {
    $aNotes = R::findAll(T_NOTES, "tcategories_id = ?", [$aRequest['category_id']]);
    $aResult = [];

    foreach ($aNotes as $oNote) {
        $aResult[] = [
            'id' => $oNote->id,
            'text' => $oNote->name,
            'name' => $oNote->name,
            'description' => $oNote->description,
            'created_at' => $oNote->created_at,
            'category_id' => $oNote->tcategories ? $oNote->tcategories->id : 0,
            'category' => $oNote->tcategories ? $oNote->tcategories->name : "",
            'tags' => fnGetTagsAsStringList($oNote->id, T_NOTES) ?: ''
        ];
    }

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'list_tags') {
    $aResult = R::findAll(T_TAGS);

    die(json_encode($aResult));
}

if ($sMethod == 'get_note') {
    $oNote = R::findOne(T_NOTES, "id = ?", [$aRequest['id']]);
    $oNote->category = $oNote->tcategories->name;
    $oNote->category_id = $oNote->tcategories_id;
    // $oNote["content"] = "".file_get_contents("{$sFNP}/{$oNote->timestamp}.md");
    // $oNote["tags"] = fnGetTabsAsStringList($aRequest['id'], T_NOTES) ?: null;
    die(json_encode($oNote));
}

if ($sMethod == 'delete_note') {
    R::trashBatch(T_NOTES, [$aRequest['id']]);
    die(json_encode([]));
}

if ($sMethod == 'update_note_content') {
    $oNote = R::findOne(T_NOTES, "id = ?", [$aRequest['id']]);
    $oNote->updated_at = date("Y-m-d H:i:s");
    $oNote->content = $aRequest['content'];

    if (!$oNote->timestamp) {
        $oNote->timestamp = time();
    }

    R::store($oNote);
    
    // file_put_contents("{$sFNP}/{$oNote->timestamp}.md", $aRequest['content']);
    die();
}

if ($sMethod == 'update_note') {
    $oNote = R::findOne(T_NOTES, "id = ?", [$aRequest['id']]);

    $oNote->updated_at = date("Y-m-d H:i:s");
    $oNote->name = $aRequest['name'];
    $oNote->description = $aRequest['description'];

    if (isset($aRequest['category_id']) && !empty($aRequest['category_id'])) {
        $oNote->tcategories = R::findOne(T_CATEGORIES, "id = ?", [$aRequest['category_id']]);
    }

    if ($aRequest['tags_list']) {
        fnSetTags($aRequest['id'], T_NOTES, explode(",", $aRequest['tags_list']));
    }

    R::store($oNote);

    die(json_encode([
        "id" => $oNote->id, 
        "name" => $oNote->name
    ]));
}

if ($sMethod == 'create_note') {    
    $oNote = R::dispense(T_NOTES);

    $oNote->created_at = date("Y-m-d H:i:s");
    $oNote->updated_at = date("Y-m-d H:i:s");
    $oNote->timestamp = time();
    $oNote->name = $aRequest['name'];
    $oNote->description = $aRequest['description'];

    if (isset($aRequest['category_id']) && !empty($aRequest['category_id'])) {
        $oNote->tcategories = R::findOne(T_CATEGORIES, "id = ?", [$aRequest['category_id']]);
    }

    if ($aRequest['tags_list']) {
        fnSetTags($oNote->id, T_NOTES, explode(",", $aRequest['tags_list']));
    }

    file_put_contents("{$sFNP}/{$oNote->timestamp}.md", "");

    R::store($oNote);

    die(json_encode([
        "id" => $oNote->id, 
        "name" => $oNote->name
    ]));
}