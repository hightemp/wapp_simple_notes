<?php

// Таблицы
function fnBuildRecursiveTablesCategoriesTree(&$aResult, $aCategories) 
{
    $aResult = [];

    foreach ($aCategories as $oCategory) {
        $aTreeChildren = [];

        $aChildren = R::children($oCategory, " id != {$oCategory->id}");
        fnBuildRecursiveCategoriesTree($aTreeChildren, $aChildren);

        $aResult[] = [
            'id' => $oCategory->id,
            'text' => $oCategory->name,
            'name' => $oCategory->name,
            'description' => $oCategory->description,
            'children' => $aTreeChildren,
            'notes_count' => $oCategory->countOwn(T_TABLES)
        ];
    }
}

if ($sMethod == 'list_tree_tables_categories') {
    $aCategories = R::findAll(T_TABLES_CATEGORIES, 'ttablescategories_id IS NULL');
    $aResult = [];

    fnBuildRecursiveTablesCategoriesTree($aResult, $aCategories);

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'list_tables_categories') {
    $aResponse = R::findAll(T_TABLES_CATEGORIES);
    die(json_encode(array_values($aResponse)));
}

if ($sMethod == 'get_tables_category') {
    $aResponse = R::findOne(T_TABLES_CATEGORIES, "id = ?", [$aRequest['id']]);
    die(json_encode($aResponse));
}

if ($sMethod == 'delete_tables_category') {
    R::trashBatch(T_TABLES_CATEGORIES, [$aRequest['id']]);
    die(json_encode([]));
}

if ($sMethod == 'update_tables_category') {
    $oCategory = R::findOne(T_TABLES_CATEGORIES, "id = ?", [$aRequest['id']]);

    $oCategory->name = $aRequest['name'];
    $oCategory->description = $aRequest['description'];
    // $oCategory->ttablescategories = NULL;

    if (isset($aRequest['category_id']) && !empty($aRequest['category_id'])) {
        $oCategory->ttablescategories = R::findOne(T_TABLES_CATEGORIES, "id = ?", [$aRequest['category_id']]);
    }

    R::store($oCategory);

    die(json_encode([
        "id" => $oCategory->id, 
        "name" => $oCategory->name
    ]));
}

if ($sMethod == 'create_tables_category') {
    $oCategory = R::dispense(T_TABLES_CATEGORIES);

    $oCategory->name = $aRequest['name'];
    $oCategory->description = $aRequest['description'];
    // $oCategory->ttablescategories = NULL;

    if (isset($aRequest['category_id']) && !empty($aRequest['category_id'])) {
        $oCategory->ttablescategories = R::findOne(T_TABLES_CATEGORIES, "id = ?", [$aRequest['category_id']]);
    }

    R::store($oCategory);

    die(json_encode([
        "id" => $oCategory->id, 
        "name" => $oCategory->name
    ]));
}