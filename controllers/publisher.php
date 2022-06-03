<?php

if ($sMethod == 'publish') {
    function fnBuildRecursiveCategoriesMDList(&$sList, $aCategories, $iS="") 
    {
        foreach ($aCategories as $oCategory) {
            $aTreeChildren = [];

            $aChildren = R::findAll(T_CATEGORIES, " tcategories_id = {$oCategory->id}");

            $sList .= "$iS- {$oCategory->name}\n";

            $aNotes = R::findAll(T_NOTES, " tcategories_id = {$oCategory->id}");

            foreach ($aNotes as $oNote) {
                $sList .= "$iS  * [{$oNote->name}](/pages/{$oNote->id}.md)\n";
                file_put_contents(PUBLIC_PATH."/pages/{$oNote->id}.md", $oNote->content);
            }

            fnBuildRecursiveCategoriesMDList($sList, $aChildren, $iS."  ");
        }
    }

    mkdir(PUBLIC_PATH."images");
    mkdir(PUBLIC_PATH."files");
    mkdir(PUBLIC_PATH."pages");

    $sIndexPage = "# Wiki\n\n";

    $aCategories = R::findAll(T_CATEGORIES, " tcategories_id IS NULL");

    fnBuildRecursiveCategoriesMDList($sIndexPage, $aCategories);

    file_put_contents(PUBLIC_PATH."index.md", $sIndexPage);

    die(json_encode([
        PUBLIC_PATH."index.md"
    ]));
}