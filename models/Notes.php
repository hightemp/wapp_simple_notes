<?php

require_once("BaseModel.php");
require_once("NotesHistory.php");

class Notes extends BaseModel
{
    static $sTableName = T_NOTES;
    static $sCategoriesTableName = T_CATEGORIES;

    static function fnCreate($aParams=[])
    {
        $oNote = static::dispense();

        $oNote->created_at = static::fnGetCurrentDateTime();
        $oNote->updated_at = static::fnGetCurrentDateTime();
        $oNote->timestamp = static::fnGetCurrentTimestamp();
        $oNote->name = $aParams['name'] ?: "";
        $oNote->description = $aParams['description'] ?: "";
    
        if (isset($aParams['content'])) {
            if (isset($aParams['option_upload_images'])) {
                fnUploadFromContent($aParams['content']);
            }
            $oNote->content = $aParams['content'] ?: "";
        }
    
        if (isset($aParams['category_id']) && !empty($aParams['category_id'])) {
            $oNote->tcategories = static::findOneCategory("id = ?", [$aParams['category_id']]);
        }
    
        R::store($oNote);
    
        if ($aParams['tags_list']) {
            static::fnSetTags($oNote->id, explode(",", $aParams['tags_list']));
        }

        NotesHistory::fnCreateCreateEvent($oNote);

        return $oNote;
    }

    static function fnUpdate($aParams=[])
    {
        $oNote = static::findOne("id = ?", [$aParams['id']]);

        $oNote->updated_at = static::fnGetCurrentDateTime();

        if (isset($aParams['name'])) $oNote->name = $aParams['name'] ?: "";
        if (isset($aParams['description'])) $oNote->description = $aParams['description'] ?: "";
        if (isset($aParams['content'])) $oNote->content = $aParams['content'] ?: "";
    
        if (isset($aParams['category_id']) && !empty($aParams['category_id'])) {
            $oNote->tcategories = static::findOneCategory("id = ?", [$aParams['category_id']]);
        }
    
        if ($aParams['tags_list']) {
            static::fnSetTags($aParams['id'], explode(",", $aParams['tags_list']));
        }
    
        R::store($oNote);

        NotesHistory::fnCreateUpdateEvent($oNote);

        return $oNote;
    }

    static function fnDelete($aIDs)
    {
        static::fnDelete($aIDs);

        foreach ($aIDs as $iID) {
            $oNote = static::fnGetOne(["id" => $iID]);
            NotesHistory::fnCreateDeleteEvent($oNote);
        }
    }

    static function fnPrepareNoteItem($oNote)
    {
        return [
            'id' => $oNote->id,
            'text' => $oNote->name,
            'name' => $oNote->name,
            'description' => $oNote->description,
            'created_at' => $oNote->created_at,
            'category_id' => $oNote->tcategories ? $oNote->tcategories->id : 0,
            'category' => $oNote->tcategories ? $oNote->tcategories->name : "",
            'tags' => static::fnGetTagsAsStringList($oNote->id)
        ];
    }

    static function fnList($aParams=[])
    {
        $aNotes = static::findAll("ORDER BY name ASC, id DESC");
        $aResult = [];
    
        foreach ($aNotes as $oNote) {
            $aResult[] = static::fnPrepareNoteItem($oNote);
        }

        return $aResult;
    }

    static function fnListForCategory($aParams=[])
    {
        if ($aParams['category_id']<1) {
            $aNotes = static::findAll("ORDER BY id DESC", []);
        } else {
            $aNotes = static::findAll("tcategories_id = ? ORDER BY name ASC, id DESC", [$aParams['category_id']]);
        }
        $aResult = [];
    
        foreach ($aNotes as $oNote) {
            $aResult[] = static::fnPrepareNoteItem($oNote);
        }

        return $aResult;
    }

    static function fnGetOne($aParams=[], $bAddAdditionalFields=true)
    {
        $oNote = static::findOne("id = ?", [$aParams['id']]);

        NotesHistory::fnCreateOpenEvent($oNote);

        $oNote = (object) $oNote->export();
        if ($bAddAdditionalFields) {
            $oNote->category = $oNote->tcategories->name;
            $oNote->category_id = $oNote->tcategories_id;
            // NOTE: Для tagcombobox возвращяем null
            $oNote->tags = static::fnGetTagsAsStringList($aParams['id']) ?: null;
        }

        return $oNote;
    }
}