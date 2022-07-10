<?php

class BaseModel
{
    static $sTableName = "";
    static $sCategoriesTableName = "";

    static function dispense($num = 1, $alwaysReturnArray = FALSE)
    {
        return R::dispense(static::$sTableName, $num, $alwaysReturnArray);
    }

    static function findOne($sql = NULL, $bindings = array())
    {
        return R::findOne(static::$sTableName, $sql, $bindings);
    }

    static function findAll($sql = NULL, $bindings = array())
    {
        return R::findAll(static::$sTableName, $sql, $bindings);
    }

    static function findOrCreate($like = array(), $sql = '', &$hasBeenCreated = false)
    {
        return R::findOrCreate(static::$sTableName, $like, $sql, $hasBeenCreated);
    }

    static function findOneCategory($sql = NULL, $bindings = array())
    {
        return R::findOne(static::$sCategoriesTableName, $sql, $bindings);
    }

    static function fnDelete($aIDs)
    {
        R::trashBatch(static::$sTableName, $aIDs);
    }

    static function fnSetTags($iContentID, $aTags)
    {
        fnSetTags($iContentID, static::$sTableName, $aTags);
    }

    static function fnGetTagsAsStringList($iContentID)
    {
        return fnGetTagsAsStringList($iContentID, static::$sTableName)  ?: '';
    }

    static function fnGetCurrentDateTime()
    {
        return date("Y-m-d H:i:s");
    }

    static function fnGetCurrentTimestamp()
    {
        return time();
    }
}