<?php

if ($sMethod == 'list_last_notes') {
    $aResult = Notes::fnList($aRequest);
    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'list_notes') {
    $aResult = Notes::fnListForCategory($aRequest);
    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'list_tags') {
    $aResult = R::findAll(T_TAGS);
    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'get_note') {
    $oNote = Notes::fnGetOne($aRequest);
    die(json_encode($oNote));
}

if ($sMethod == 'delete_note') {
    Notes::fnDelete([$aRequest['id']]);
    die(json_encode([]));
}

if ($sMethod == 'update_note_content') {
    $oNote = Notes::fnUpdate($aRequest);
    die(json_encode([
        "id" => $oNote->id, 
        "name" => $oNote->name
    ]));
}

if ($sMethod == 'update_note') {
    $oNote = Notes::fnUpdate($aRequest);
    die(json_encode([
        "id" => $oNote->id, 
        "name" => $oNote->name
    ]));
}

if ($sMethod == 'create_note') {    
    $oNote = Notes::fnCreate($aRequest);
    die(json_encode([
        "id" => $oNote->id, 
        "name" => $oNote->name
    ]));
}

if ($sMethod == 'download_note_as_html') {  
    $oNote = Notes::fnGetOne($aRequest, false);

    header( 'Content-Type: text/html' ); 
    header("Content-disposition: attachment; filename={$oNote->name}-" .date("Y-m-d").".html");  

    $html = $oNote->content;
    $sURL = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://".$_SERVER['HTTP_HOST'];
    $html = preg_replace('%/[^\\s]+\\.(jpg|jpeg|png|gif)%i', $sURL.'\\0', $html);

    die($html);
}

if ($sMethod == 'download_note_as_word') {  
    $oNote = Notes::fnGetOne($aRequest, false);

    header( 'Content-Type: application/msword' ); 
    header("Content-disposition: attachment; filename={$oNote->name}-" .date("Y-m-d").".doc");  
    /*
    header("Content-type: application/vnd.ms-word");
    header("Content-disposition: attachment; filename=" .date("Y-m-d").".rtf");
    */

    $html = $oNote->content;
    $sURL = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://".$_SERVER['HTTP_HOST'];
    $html = preg_replace('%/[^\\s]+\\.(jpg|jpeg|png|gif)%i', $sURL.'\\0', $html);

print "<html xmlns:v=\"urn:schemas-microsoft-com:vml\"";
print "xmlns:o=\"urn:schemas-microsoft-com:office:office\"";
print "xmlns:w=\"urn:schemas-microsoft-com:office:word\"";
print "xmlns=\"http://www.w3.org/TR/REC-html40\">";
print "<xml>
 <w:WordDocument>
  <w:View>Print</w:View>
  <w:DoNotHyphenateCaps/>
  <w:PunctuationKerning/>
  <w:DrawingGridHorizontalSpacing>9.35 pt</w:DrawingGridHorizontalSpacing>
  <w:DrawingGridVerticalSpacing>9.35 pt</w:DrawingGridVerticalSpacing>
 </w:WordDocument>
</xml>
";

    die($html);
}