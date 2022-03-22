<?php 

include_once("./database.php");

if ($argv[1] == "nuke") {
    R::nuke();
    die();
}

if ($argv[1] == "truncate_category") {
    R::wipe(T_CATEGORIES);
    die();
}

function fnBuildRecursiveCategoriesTree(&$aResult, $aCategories) 
{
    $aResult = [];

    foreach ($aCategories as $oCategory) {
        $aTreeChildren = [];

        $aChildren = R::children($oCategory, " id != {$oCategory->id}");
        fnBuildRecursiveCategoriesTree($aTreeChildren, $aChildren);

        $aResult[] = [
            'id' => $oCategory->id,
            'text' => $oCategory->name,
            'children' => $aTreeChildren,
            'notes_count' => $oCategory->countOwn(T_NOTES)
        ];
    }
}

if ($argv[1] == "get_category_children") {
    $oCategory = R::findOne(T_CATEGORIES, 'name = ?', [$argv[2]]);

    $aChildren = R::children($oCategory, " id != {$oCategory->id}");

    die(json_encode(array_values($aChildren)));
}

if ($argv[1] == "list_category") {
    $aCategories = R::findAll(T_CATEGORIES, 'tcategories_id IS NULL');
    $aResult = [];

    fnBuildRecursiveCategoriesTree($aResult, $aCategories);

    die(json_encode(array_values($aResult)));
}

if ($argv[1] == "create_category_json") {
    $oCategory = R::dispense(T_CATEGORIES);

    $aR = json_decode($argv[2], true);
    foreach ($aR as $sK => $sV)  {
        $oCategory->$sK = $sV;
    }

    // Сохраняем таблицу
    R::store($oCategory);

    die(json_encode($oCategory));
}

if ($argv[1] == "create_category") {
    $oCategory = R::dispense(T_CATEGORIES);

    $oCategory->name = 'Разработка '.rand(1, 100);
    $oCategory->description = 'test';
    R::store($oCategory);

    if (isset($argv[2])) {
        $oParent = R::findOne(T_CATEGORIES, 'name = ?', [$argv[2]]);
        $oParent->{T_CATEGORIES_OWN_LIST}[] = $oCategory;
        R::store($oParent);
    } else {
        
    }

    die(json_encode($oCategory));
}

if ($argv[1] == "truncate_note") {
    R::wipe(T_NOTES);
    die();
}

if ($argv[1] == "create_note") {
    $oNote = R::dispense(T_NOTES);

    $oNote->created_at = date("Y-m-d H:i:s");
    $oNote->updated_at = date("Y-m-d H:i:s");
    $oNote->timestamp = time();
    $oNote->name = 'В проекте создаём файл db.php и подключаемся к БД MySQL '.rand(1, 100);
    $oNote->description = 'test';

    file_put_contents("{$sNP}/{$oNote->timestamp}.md", "");

    R::store($oNote);

    if (isset($argv[2])) {
        $oParent = R::findOne(T_CATEGORIES, 'name = ?', [$argv[2]]);
        $oParent->{T_CATEGORIES_OWN_LIST}[] = $oNote;
        R::store($oParent);
    } else {
        
    }

    die(json_encode($oNote));
}

if ($argv[1] == "create_random_note") {
    $oNote = R::dispense(T_RANDOM_NOTES);

    $oNote->created_at = date("Y-m-d H:i:s");
    $oNote->updated_at = date("Y-m-d H:i:s");
    $oNote->timestamp = time();
    $oNote->text = 'В проекте создаём файл db.php и подключаемся к БД MySQL '.rand(1, 100);

    R::store($oNote);

    die(json_encode($oNote));
}


if ($argv[1] == "list_notes") {
    $aNotes = R::findAll(T_NOTES);

    foreach ($aNotes as $oNote) {
        $oNote->tcategories;
    }

    die(json_encode($aNotes, JSON_PRETTY_PRINT));
}

if ($argv[1] == "create_fav_note") {
    $oNote = R::findOne(T_NOTES, 'name = ?', [$argv[2]]);

    $oFavNote = R::dispense(T_FAVORIETES);
    $oFavNote->{T_NOTES_OWN} = $oNote;

    R::store($oFavNote);

    die(json_encode($oFavNote));
}