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

if ($argv[1] == "list_fields") {
    $fields = R::inspect($argv[2]);
    die(json_encode($fields));
}

if ($argv[1] == "tmp__create_scheme") {
    R::nuke();

    $oCategory = R::dispense(T_CATEGORIES);

    $oCategory->name = 'Тестовая категория';
    $oCategory->description = 'Тестовая категория';

    $oCategory2 = R::dispense(T_CATEGORIES);
    $oCategory2->name = 'Тестовая категория 2';
    $oCategory2->description = 'Тестовая категория 2';
    // R::store($oCategory2);

    $oCategory->tcategories = $oCategory2;

    R::store($oCategory);


    $oNote = R::dispense(T_NOTES);

    $oNote->created_at = date("Y-m-d H:i:s");
    $oNote->updated_at = date("Y-m-d H:i:s");
    $oNote->timestamp = time();
    $oNote->name = 'Тестовая заметка';
    $oNote->description = 'Тестовая заметка';

    $oNote->tcategories = $oCategory;

    R::store($oNote);


    $oTag = R::dispense(T_TAGS);

    $oTag->created_at = date("Y-m-d H:i:s");
    $oTag->updated_at = date("Y-m-d H:i:s");
    $oTag->timestamp = time();
    $oTag->name = 'Тестовый тэг';

    R::store($oTag);

    $oTagToObjects = R::dispense(T_TAGS_TO_OBJECTS);

    $oTagToObjects->ttags = $oTag;
    $oTagToObjects->content_id = $oNote->id;
    $oTagToObjects->content_type = 'tnotes';
    $oTagToObjects->poly('contentType');

    R::store($oTagToObjects);


    $oTablesCategory = R::dispense(T_TABLES_CATEGORIES);

    $oTablesCategory->name = 'Тестовая категория';
    $oTablesCategory->description = 'Тестовая категория';

    $oTablesCategory2 = R::dispense(T_TABLES_CATEGORIES);
    $oTablesCategory2->name = 'Тестовая категория 2';
    $oTablesCategory2->description = 'Тестовая категория 2';
    // R::store($oTablesCategory2);

    $oTablesCategory->ttablescategories = $oTablesCategory2;

    R::store($oTablesCategory);


    $oTable = R::dispense(T_TABLES);

    $oTable->created_at = date("Y-m-d H:i:s");
    $oTable->updated_at = date("Y-m-d H:i:s");
    $oTable->timestamp = time();
    $oTable->name = 'Тестовая таблица';
    $oTable->description = 'Тестовая таблица';

    $oTable->ttablescategories = $oTablesCategory;

    R::store($oTable);


    $oRandomNote = R::dispense(T_RANDOM_NOTES);

    $oRandomNote->created_at = date("Y-m-d H:i:s");
    $oRandomNote->updated_at = date("Y-m-d H:i:s");
    $oRandomNote->timestamp = time();
    $oRandomNote->text = 'Случайная заметка';

    R::store($oRandomNote);


    $oFavNote = R::dispense(T_FAVORIETES);

    $oFavNote->tnotes = $oNote;

    R::store($oFavNote);


    $oLink = R::dispense(T_LINKS);

    $oLink->created_at = date("Y-m-d H:i:s");
    $oLink->updated_at = date("Y-m-d H:i:s");
    $oLink->timestamp = time();

    $oLink->name = 'test';
    $oLink->url = 'test';

    R::store($oLink);


    $oTask = R::dispense(T_TASKS);

    $oTask->created_at = date("Y-m-d H:i:s");
    $oTask->updated_at = date("Y-m-d H:i:s");
    $oTask->timestamp = time();
    $oTask->text = 'Задача';
    $oTask->is_ready = false;

    R::store($oTask);


    $oImage = R::dispense(T_IMAGES);

    $oImage->created_at = date("Y-m-d H:i:s");
    $oImage->updated_at = date("Y-m-d H:i:s");
    $oImage->timestamp = time();
    $oImage->name = 'test';
    $oImage->type = 'image/png';
    $oImage->filename = $oImage->timestamp.".png";

    R::store($oImage);


    $oFile = R::dispense(T_FILES);

    $oFile->created_at = date("Y-m-d H:i:s");
    $oFile->updated_at = date("Y-m-d H:i:s");
    $oFile->timestamp = time();
    $oFile->name = 'test';
    $oFile->type = 'text';
    $oFile->filename = $oImage->timestamp.".txt";

    R::store($oFile);


    R::trashBatch(T_NOTES, [$oNote->id]);
    R::trashBatch(T_CATEGORIES, [$oCategory->id]);
    R::trashBatch(T_CATEGORIES, [$oCategory2->id]);
    R::trashBatch(T_TABLES, [$oTable->id]);
    R::trashBatch(T_TABLES_CATEGORIES, [$oTablesCategory->id]);
    R::trashBatch(T_TABLES_CATEGORIES, [$oTablesCategory2->id]);
    R::trashBatch(T_RANDOM_NOTES, [$oRandomNote->id]);
    R::trashBatch(T_FAVORIETES, [$oFavNote->id]);
    R::trashBatch(T_LINKS, [$oLink->id]);
    R::trashBatch(T_TASKS, [$oTask->id]);
    R::trashBatch(T_IMAGES, [$oImage->id]);
    R::trashBatch(T_FILES, [$oFile->id]);
    R::trashBatch(T_TAGS, [$oTag->id]);
    R::trashBatch(T_TAGS_TO_OBJECTS, [$oTagToObjects->id]);

    die(json_encode([]));
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

if ($argv[1] == "tmp__create_table_category") {
    $oCategory = R::dispense(T_TABLES_CATEGORIES);

    $oCategory->name = 'Тестовая категория';
    $oCategory->description = 'Тестовая категория';
    $oCategory->ttablescategories_id = NULL;
    $oCategory->ttablescategories = NULL;

    // if (isset($argv[2])) {
    //     $oCategory->ttablescategories = R::findOne(T_TABLES_CATEGORIES, "id = ?", [$argv[2]]);
    // }

    R::store($oCategory);
    R::trashBatch(T_TABLES_CATEGORIES, [$oCategory->id]);

    die(json_encode([]));
}

