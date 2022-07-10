<?php

require_once("BaseModel.php");

class NotesHistory extends BaseModel
{
    static $sTableName = T_NOTES_HISTORY;

    const ET_CREATE = "create";
    const ET_OPEN = "open";
    const ET_UPDATE = "update";
    const ET_DELETE = "delete";

    static function fnCreateCreateEvent($oNote, $sComment="")
    {
        return static::fnCreate($oNote, static::ET_CREATE, $sComment);
    }

    static function fnCreateOpenEvent($oNote, $sComment="")
    {
        return static::fnCreate($oNote, static::ET_OPEN, $sComment);
    }

    static function fnCreateUpdateEvent($oNote, $sComment="")
    {
        return static::fnCreate($oNote, static::ET_UPDATE, $sComment);
    }

    static function fnCreateDeleteEvent($oNote, $sComment="")
    {
        return static::fnCreate($oNote, static::ET_DELETE, $sComment);
    }

    static function fnGetClientIP()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $IP = $_SERVER['HTTP_CLIENT_IP'];
        } else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $IP = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $IP = $_SERVER['REMOTE_ADDR']; 
        }

        return $IP;
    }

    static function fnCreate($oNote, $sType, $sComment="")
    {
        $oEvent = static::dispense();

        $oEvent->created_at = static::fnGetCurrentDateTime();
        $oEvent->timestamp = static::fnGetCurrentTimestamp();
        $oEvent->event_type = $sType;
        $oEvent->tnotes = $oNote;
        $oEvent->ip_addr = static::fnGetClientIP();
        
        R::store($oEvent);

        return $oEvent;
    }

    static function fnList($aParams=[])
    {
        $aEvents = static::findAll("ORDER BY name ASC, id DESC");

        return $aEvents;
    }

    static function fnGetOne($aParams=[], $bAddAdditionalFields=true)
    {
        $oEvent = static::findOne("id = ?", [$aParams['id']]);

        return $oEvent;
    }
}