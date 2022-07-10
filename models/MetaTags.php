<?php

require_once("BaseModel.php");
require_once("Notes.php");

class MetaTags extends BaseModel
{
    static $sTableName = T_TAGS;
    static $sRelationsTableName = T_TAGS_TO_OBJECTS;

    static function fnCreate($aParams=[])
    {
        $oTag = static::findOrCreate([
            'name' => $aParams["name"], 
        ]);
    
        R::store($oTag);

        // NotesHistory::fnCreateCreateEvent($oTag);

        return $oTag;
    }

    static function fnCreateChild($aParams=[])
    {
        $oTag = static::findOrCreate([
            'name' => $aParams["name"], 
        ]);

        // $oParentTag = static::findOne("id = ?", [$aParams['tag_id']]);
        $oRelation = R::findOrCreate(static::$sRelationsTableName, [
            'ttags_id' => $aParams['tag_id'],
            'content_id' => $oTag->id,
            'content_type' => static::$sTableName,
        ]);
    
        // R::store($oTag);

        // NotesHistory::fnCreateCreateEvent($oTag);

        return $oTag;
    }

    static function fnUpdate($aParams=[])
    {
        $oTag = static::findOne("id = ?", [$aParams['id']]);

        $oTag->name = $aParams["name"];
    
        R::store($oTag);

        // NotesHistory::fnCreateUpdateEvent($oTag);

        return $oTag;
    }

    static function fnDelete($aIDs)
    {
        static::fnDelete($aIDs);

        foreach ($aIDs as $iID) {
            static::fnDeleteRelations($iID);
        }
    }

    static function fnDeleteRelations($iID)
    {
        $aRelations = R::findAll(static::$sRelationsTableName, "ttags_id = ?", [$iID]);

        R::trashAll($aRelations);
    }

    static function fnDeleteChildren($aIDs)
    {
        static::fnDelete($aIDs);

        foreach ($aIDs as $iID) {
            static::fnDeleteParentRelations($iID);
        }
    }

    static function fnDeleteParentRelations($iID)
    {
        $aRelations = R::findAll(static::$sRelationsTableName, "content_type = ? AND content_id = ?", [static::$sTableName, $iID]);

        R::trashAll($aRelations);
    }

    static function fnList($aParams=[])
    {
        $aNotes = static::findAll("ORDER BY name ASC, id DESC");

        return $aNotes;
    }

    static function fnListForTag($aParams=[])
    {
        $sRelTable = static::$sRelationsTableName;
        $sTable = static::$sTableName;

        $aTags = R::getAll("
            SELECT t.* FROM {$sTable} AS t
            INNER JOIN {$sRelTable} AS r ON t.id = r.content_id AND r.content_type = ? AND r.ttags_id = ?
        ", [$sTable, $aParams["tag_id"]]);

        return $aTags;
    }

    static function fnListNotesForTag($aParams=[])
    {
        $sTable = static::$sRelationsTableName;
        $sNotesTable = Notes::$sTableName;
        
        $aNotes = R::getAll("
            SELECT n.* FROM {$sNotesTable} AS n
            INNER JOIN {$sTable} AS t ON n.id = t.content_id AND t.content_type = ? AND t.ttags_id = ?
        ", [$sNotesTable, $aParams["tag_id"]]);

        return $aNotes;
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