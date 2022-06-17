<?php

if ($sMethod == 'get_archived_data') {
    $sFilePath = fnZipDataFolder();

    if (file_exists($sFilePath)) {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($sFilePath) . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($sFilePath));
        readfile($sFilePath);
        exit;
    }

    header("HTTP/1.1 404 Not Found");
    die();
}