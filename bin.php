<?php 

include_once("./database.php");

use RedBeanPHP\Logger as Logger;

if ($argv[1] == "nuke") {
    R::nuke();
    die();
}

if ($argv[1] == "wipe_all") {
    r::wipeAll();
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

if ($argv[1] == "create_folders") {
    mkdir("data/notes");
    mkdir("data/resources/files");
    mkdir("data/resources/images");
    mkdir("data/tables");

    die('ok');
}

if ($argv[1] == "create_database") {
    class MigrationLogger implements Logger {

        private $file;
    
        public function __construct( $file ) {
            $this->file = $file;
        }
    
        public function log() {
            $query = func_get_arg(0);
            if (preg_match( '/^(CREATE|ALTER)/', $query )) {
                file_put_contents( $this->file, "{$query};\n",  FILE_APPEND );
            }
        }
    }
    
    $ml = new MigrationLogger( sprintf( __DIR__.'/sql/migration_%s.sql', date('Y_m_d__H_i_s') ) );
    
    R::getDatabaseAdapter()
        ->getDatabase()
        ->setLogger($ml)
        ->setEnableLogging(TRUE);

    R::nuke();

    $aCategories = [];
    $aNotes = [];

    function generateRandomString($length = 10) {
        $characters = ' 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    for ($i=0; $i<50; $i++) {
        $oCategory = R::dispense(T_CATEGORIES);

        $oCategory->name = generateRandomString(random_int(5, 20));
        $oCategory->description = generateRandomString(random_int(5, 20));
        $oParent = @$aCategories[random_int(0, count($aCategories))];
        if ($oParent) {
            $oCategory->tcategories = $oParent;
        } else {
            $oCategory->tcategories_id = null;
        }

        $aCategories[] = $oCategory;

        R::store($oCategory);
    }

    for ($i=0; $i<1000; $i++) {
        $oNote = R::dispense(T_NOTES);

        $oNote->created_at = date("Y-m-d H:i:s");
        $oNote->updated_at = date("Y-m-d H:i:s");
        $oNote->timestamp = time();
        $oNote->name = generateRandomString(random_int(5, 20));
        $oNote->description = generateRandomString(random_int(5, 20));
        $oNote->content = generateRandomString(random_int(1000, 3000));
        $oParent = @$aCategories[random_int(0, count($aCategories))];
        if ($oParent) {
            $oNote->tcategories = $oParent;
        } else {
            $oNote->tcategories_id = null;
        }

        $aNotes[] = $oNote;

        R::store($oNote);
    }


    // $oImage = R::dispense(T_IMAGES);

    // $oImage->created_at = date("Y-m-d H:i:s");
    // $oImage->updated_at = date("Y-m-d H:i:s");
    // $oImage->timestamp = time();
    // $oImage->name = 'test';
    // $oImage->type = 'image/png';
    // $oImage->filename = $oImage->timestamp.".png";

    // R::store($oImage);


    // $oFile = R::dispense(T_FILES);

    // $oFile->created_at = date("Y-m-d H:i:s");
    // $oFile->updated_at = date("Y-m-d H:i:s");
    // $oFile->timestamp = time();
    // $oFile->name = 'test';
    // $oFile->type = 'text';
    // $oFile->filename = $oImage->timestamp.".txt";

    // R::store($oFile);


    // R::trashBatch(T_NOTES, [$oNote->id]);
    // R::trashBatch(T_CATEGORIES, [$oCategory->id]);
    // R::trashBatch(T_IMAGES, [$oImage->id]);
    // R::trashBatch(T_FILES, [$oFile->id]);
    // R::trashBatch(T_TAGS, [$oTag->id]);
    // R::trashBatch(T_TAGS_TO_OBJECTS, [$oTagToObjects->id]);

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

