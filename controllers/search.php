<?php

if ($sMethod == 'search') {
    $sQ = $aRequest['query'];
    $aNotes = [];
    $aResult = [];
    if ($sQ) {
        if ($aRequest['type']=="all") {
            $aNotes = (array) R::findMulti(T_NOTES, 
            "
                SELECT
                    tnotes.*
                FROM
                    tnotes
                LEFT JOIN ttagstoobjectss AS ttto ON ttto.content_type = 'tnotes' AND ttto.content_id = tnotes.id
                LEFT JOIN ttags AS tt ON ttto.ttags_id = tt.id
                LEFT JOIN tcategories AS tc ON tnotes.tcategories_id = tc.id
                WHERE
                    tnotes.name LIKE ? 
                    OR tnotes.content LIKE ? 
                    OR tt.name LIKE ?
                    OR tc.name LIKE ?
                GROUP BY tnotes.id
                ORDER BY tnotes.id DESC
            ", ['%'.$sQ.'%', '%'.$sQ.'%', '%'.$sQ.'%', '%'.$sQ.'%']);
            $aNotes = (array) $aNotes['tnotes'];
        }
        
        if ($aRequest['type']=="title") {
            $aNotes = R::findAll(T_NOTES, "name LIKE ? ORDER BY id DESC", ['%'.$sQ.'%']);
        }

        if ($aRequest['type']=="content") {
            $aNotes = R::findAll(T_NOTES, "content LIKE ? ORDER BY id DESC", ['%'.$sQ.'%']);
        }

        if ($aRequest['type']=="tags") {
            $aNotes = (array) R::findMulti(T_NOTES, 
            "
                SELECT
                    tnotes.*
                FROM
                    tnotes
                LEFT JOIN ttagstoobjectss AS ttto ON ttto.content_type = 'tnotes' AND ttto.content_id = tnotes.id
                LEFT JOIN ttags AS tt ON ttto.ttags_id = tt.id
                WHERE
                    tt.name LIKE ?
                GROUP BY tnotes.id
                ORDER BY tnotes.id DESC
            ", ['%'.$sQ.'%']);
            $aNotes = (array) $aNotes['tnotes'];
        }

        if ($aRequest['type']=="categories") {
            $aNotes = (array) R::findMulti(T_NOTES, 
            "
                SELECT
                    tnotes.*
                FROM
                    tnotes
                LEFT JOIN tcategories AS tc ON tnotes.tcategories_id = tc.id
                WHERE
                    tc.name LIKE ?
                GROUP BY tnotes.id
                ORDER BY tnotes.id DESC
            ", ['%'.$sQ.'%']);
            $aNotes = (array) $aNotes['tnotes'];
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
                'tags' => fnGetTagsAsStringList($oNote->id, T_NOTES) ?: null
            ];
        }
    }

    die(json_encode(array_values($aResult)));
}