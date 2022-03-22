<?php

$sBA = "/static/app";
$sB = "/static/app/jquery-easyui-1.10.2";
$sNP = "/data/notes";
$sFNP = __DIR__."/data/notes";
$sFFP = __DIR__."/data/resources/files";
$sIP = "/data/resources/images";
$sFIP = __DIR__."/data/resources/images";

class Config {
    public static $aOptions = [];

    public static function fnLoad()
    {
        static::$aOptions = json_decode(file_get_contents("./config.json"), true) ?: [];
    }

    public static function fnSave()
    {
        file_put_contents("./config.json", json_encode(static::$aOptions));
    }
}

Config::fnLoad();