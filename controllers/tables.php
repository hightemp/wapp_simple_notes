<?php

if ($sMethod == 'list_last_tables') {
    $aTables = R::findAll(T_TABLES, "ORDER BY id DESC");
    $aResult = [];

    foreach ($aTables as $oTable) {
        $aResult[] = [
            'id' => $oTable->id,
            'text' => $oTable->name,
            'name' => $oTable->name,
            'description' => $oTable->description,
            'created_at' => $oTable->created_at,
            'category_id' => $oTable->ttablescategories->id,
            'category' => $oTable->ttablescategories->name,
            'tags' => R::tag($oTable)
        ];
    }

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'list_tables') {
    $aTables = R::findAll(T_TABLES, "ttablescategories_id = ?", [$aRequest['category_id']]);
    $aResult = [];

    foreach ($aTables as $oTable) {
        $aResult[] = [
            'id' => $oTable->id,
            'text' => $oTable->name,
            'name' => $oTable->name,
            'description' => $oTable->description,
            'created_at' => $oTable->created_at,
            'category_id' => $oTable->ttablescategories->id,
            'category' => $oTable->ttablescategories->name,
            'tags' => R::tag($oTable)
        ];
    }

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'get_table') {
    $oTable = R::findOne(T_TABLES, "id = ?", [$aRequest['id']]);
    $sFilePath = "{$sFTP}/{$oTable->timestamp}.json";
    if (!is_file($sFilePath)) {
        file_put_contents($sFilePath, json_encode((Object) []));
    }
    $oTable["content"] = "".file_get_contents($sFilePath);
    die(json_encode($oTable));
}

if ($sMethod == 'delete_table') {
    R::trashBatch(T_TABLES, [$aRequest['id']]);
    die(json_encode([]));
}

if ($sMethod == 'update_table_content') {
    $oTable = R::findOne(T_TABLES, "id = ?", [$aRequest['id']]);
    $oTable->updated_at = date("Y-m-d H:i:s");

    if (!$oTable->timestamp) {
        $oTable->timestamp = time();
        R::store($oTable);
    }
    
    file_put_contents("{$sFTP}/{$oTable->timestamp}.json", $aRequest['content']);
    die(json_encode([]));
}

if ($sMethod == 'update_table') {
    var_export($_REQUEST);
    die();
    $oTable = R::findOne(T_TABLES, "id = ?", [$aRequest['id']]);

    $oTable->updated_at = date("Y-m-d H:i:s");
    $oTable->name = $aRequest['name'];
    $oTable->description = $aRequest['description'];
    // $oTable->ttablescategories = R::findOne(T_CATEGORIES, "id = ?", $aRequest['category_id']);

    R::tag($oTable, explode(",", $aRequest['tags_list']));

    R::store($oTable);

    die(json_encode([
        "id" => $oTable->id, 
        "name" => $oTable->name
    ]));
}

if ($sMethod == 'create_table') {    
    $oTable = R::dispense(T_TABLES);

    $oTable->created_at = date("Y-m-d H:i:s");
    $oTable->updated_at = date("Y-m-d H:i:s");
    $oTable->timestamp = time();
    $oTable->name = $aRequest['name'];
    $oTable->description = $aRequest['description'];
    $oTable->ttablescategories = R::findOne(T_TABLES_CATEGORIES, "id = ?", [$aRequest['category_id']]);

    file_put_contents("{$sFTP}/{$oTable->timestamp}.json", "");

    R::tag($oTable, explode(",", $aRequest['tags_list']));

    R::store($oTable);

    die(json_encode([
        "id" => $oTable->id, 
        "name" => $oTable->name
    ]));
}