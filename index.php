<?php 

include_once("./database.php");

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title></title>

    <link rel="shortcut icon" href="<?php echo $sBase ?>/static/app/favicon.png" type="image/png">

    <link rel="stylesheet" type="text/css" href="<?php echo $sB ?>/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="<?php echo $sB ?>/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="<?php echo $sBA ?>/styles_index.css">
    <script type="text/javascript" src="<?php echo $sB ?>/jquery.min.js"></script>
    <script type="text/javascript" src="<?php echo $sB ?>/jquery.easyui.min.js"></script>

    <link rel="stylesheet" type="text/css" href="<?php echo $sBA ?>/easymde.min.css">
    <!-- <script type="text/javascript" src="<?php echo $sBA ?>/easymde.min.js"></script> -->
    <script type="text/javascript" src="<?php echo $sBA ?>/all.js"></script>
    <script type="text/javascript" src="<?php echo $sBA ?>/speadsheet.js"></script>

    <script type="text/javascript" src="<?php echo $sBA ?>/datagrid-filter.js"></script>
    <script type="text/javascript" src="<?php echo $sBA ?>/datagrid-cellediting.js"></script>

    <script type="text/javascript" src="<?php echo $sBA ?>/tinymce/js/tinymce/tinymce.min.js"></script>

    <script src="https://cdn.jsdelivr.net/highlight.js/latest/highlight.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/highlight.js/latest/styles/github.min.css">

    <link rel="stylesheet" href="<?php echo $sBA ?>/icons.css">
</head>
<body>
    <div id="main-panel">
        <?php include "includes/layout.php" ?>
        <?php include "includes/components.php" ?>
    </div>
</body>
</html>

<script>
window.BASE_PATH = '<?php echo $sBase ?>';
window.IMAGES_PATH = '<?php echo $sBIP ?>';
window.FILES_PATH = '<?php echo $sBFP ?>';
</script>

<script type="module">
import "./static/app/dist/lib.client.js";
import * as m from "./static/app/modules/__init__.js";
</script>