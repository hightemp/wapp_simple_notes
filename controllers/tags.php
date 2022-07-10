<?php

if ($sMethod == 'list_tags') {
    $aResult = MetaTags::fnList($aRequest);
    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'list_tag_children') {
    $aResult = MetaTags::fnListForTag($aRequest);
    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'list_tags_notes') {
    $aResult = MetaTags::fnListNotesForTag($aRequest);
    die(json_encode(array_values($aResult)));
}