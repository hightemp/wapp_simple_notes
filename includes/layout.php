<div class="easyui-layout" data-options="fit:true">
    <div data-options="region:'west',split:true" title="" style="width:500px;">
        <div class="easyui-tabs" id="left-panel-tabs" data-options="fit:true">
            <?php include "left_panel/notes.php" ?>
            <?php include "left_panel/tables.php" ?>
            <?php include "left_panel/last_notes.php" ?>
            <?php include "left_panel/favorietes.php" ?>
            <?php include "left_panel/tags.php" ?>
            <?php include "left_panel/links.php" ?>
            <?php include "left_panel/random_notes.php" ?>
            <?php include "left_panel/tasks.php" ?>
            <?php include "left_panel/search.php" ?>
            <?php include "left_panel/images.php" ?>
        </div>
    </div>
    <div data-options="region:'center',title:'',iconCls:'icon-ok'">
        <div id="notes-tt" class="easyui-tabs"></div>
    </div>
</div>