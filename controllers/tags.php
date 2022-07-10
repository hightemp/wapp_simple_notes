<?php

if ($sMethod == 'list_tags') {
    $aResult = MetaTags::fnList($aRequest);
    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'create_tag') {
    $oItem = MetaTags::fnCreate($aRequest);
    die(json_encode($oItem));
}

if ($sMethod == 'update_tag') {
    $oItem = MetaTags::fnUpdate($aRequest);
    die(json_encode($oItem));
}

if ($sMethod == 'delete_tag') {
    $oItem = MetaTags::fnDelete([$aRequest['id']]);
    die(json_encode($oItem));
}

if ($sMethod == 'list_tag_children') {
    $aResult = MetaTags::fnListForTag($aRequest);
    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'create_tag_children') {
    $oItem = MetaTags::fnCreateChild($aRequest);
    die(json_encode($oItem));
}

if ($sMethod == 'update_tag_children') {
    $oItem = MetaTags::fnUpdate($aRequest);
    die(json_encode($oItem));
}

if ($sMethod == 'delete_tag_children') {
    $oItem = MetaTags::fnDeleteChildren([$aRequest['id']]);
    die(json_encode($oItem));
}

if ($sMethod == 'list_tags_notes') {
    $aResult = MetaTags::fnListNotesForTag($aRequest);
    die(json_encode(array_values($aResult)));
}