<?php

include_once("./database.php");

$sContent = "";
$sTitle = "";
$iID = (int) @$_GET["id"];
if (isset($_GET["id"]) && $_GET["id"]) {
    $oNote = R::findOne(T_NOTES, "id = ?", [$iID]);

    if (isset($_GET["content"]) && $_GET["content"]) {
        $oNote->content = $_GET["content"];
        R::store($oNote);
    }

    $sContent = $oNote->content;
    $sTitle = $oNote->name;
}

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="robots" content="noindex, nofollow">

    <title><?php echo $sTitle ?></title>

    <script type="text/javascript" src="<?php echo $sB ?>/jquery.min.js"></script>
    <script type="text/javascript" src="<?php echo $sBA ?>/tinymce/js/tinymce/tinymce.min.js"></script>
</head>

<body onload="">
<textarea id="note-<?php echo $iID; ?>" style="width:100%;height:100%"></textarea>
</body>

</html>

<script>
window.content = <?php echo json_encode($sContent); ?>;
window.note_id = "<?php echo $iID; ?>";
window.editor_id = "note-<?php echo $iID; ?>";
</script>

<script type="module">
import { fnCreateEditor } from "./static/app/modules/lib.js";

window.oEditor = fnCreateEditor(
    document.querySelector(`#${window.editor_id}`), 
    window.content,
    {

    },
    (() => {
        // this.fnSetDirtyNote(this.oTabsNotesIDs[iI]);
        window.parent.postMessage({action:"set_dirty",id:window.note_id})
    }).bind(this),
    (() => {
        // $(".icon-save:visible").click();
        fnActionSaveNoteContent(window.note_id);
    })
);

function fnActionSaveNoteContent(iID)
{
    $.post(
        `ajax.php?method=update_note_content`,
        {
            id: iID,
            content: window.oEditor.getContent()
        }
    ).done((() => {
        window.parent.postMessage({action:"unset_dirty",id:iID})
        window.parent.postMessage({action:"note_saved",id:iID})
    }).bind(this))
}

window.addEventListener("message", (oE)=>{
    if (oE.data.action) {
        if (oE.data.action=="save") {
            fnActionSaveNoteContent(window.note_id);
        }
    }
}, false);

$(document).on('keydown', (oEvent => {
    if (oEvent.ctrlKey && (oEvent.key === 's' || oEvent.key === 'ы')) {
        oEvent.preventDefault();
        fnActionSaveNoteContent(window.note_id);
    }
}));
</script>

<style>
/*Container, container body, iframe*/
.tox-tinymce, .tox-editor-container {
    min-height: 100% !important;
}

.tox-sidebar-wrap {
    margin-top: 40px !important;
}

/*Container body*/
.tox-sidebar-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}

/*Editing area*/
.tox-edit-area {
    position: absolute;
}

/*Footer*/
.tox-tinymce .tox-statusbar {
    position: static !important;
    bottom: 0px;
    left: 0px;
    right: 0px;
}

.tox-editor-header {
    position: fixed !important;
    width: 780px !important;
}
</style>