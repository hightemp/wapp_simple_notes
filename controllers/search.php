<?php

if ($sMethod == 'search') {
    $sQ = $aRequest['query'];
    $aNotes = [];
    if ($sQ) {
        if ($aRequest['type']=="all") {
            $aNotes = R::findAll(T_NOTES, "name LIKE ? OR content LIKE ? ORDER BY id DESC", ['%'.$sQ.'%', '%'.$sQ.'%']);
        }
        
        if ($aRequest['type']=="title") {
            $aNotes = R::findAll(T_NOTES, "name LIKE ? ORDER BY id DESC", ['%'.$sQ.'%']);
        }

        if ($aRequest['type']=="content") {
            $aNotes = R::findAll(T_NOTES, "content LIKE ? ORDER BY id DESC", ['%'.$sQ.'%']);
        }

        foreach ($aNotes as $oNote) {
            $aResult[] = [
                'id' => $oNote->id,
                'text' => $oNote->name,
                'name' => $oNote->name,
                'description' => $oNote->description,
                'created_at' => $oNote->created_at,
                'category_id' => $oNote->tcategories ? $oNote->tcategories->id : 0,
                'category' => $oNote->tcategories ? $oNote->tcategories->name : "",
                // 'tags' => fnGetTabsAsStringList($oNote->id, T_NOTES) ?: null
            ];
        }
    }

    die(json_encode(array_values($aResult)));
}