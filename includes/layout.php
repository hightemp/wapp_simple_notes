<div class="easyui-layout" data-options="fit:true">
    <div data-options="region:'west',split:true" title="" style="width:700px;">
        <div class="easyui-tabs" id="left-panel-tabs" data-options="fit:true">
            <?php include "left_panel/notes.php" ?>
            <?php include "left_panel/search.php" ?>
            <?php include "left_panel/files.php" ?>
        </div>
    </div>
    <div data-options="region:'center',title:'',iconCls:'icon-ok'">
        <div id="notes-tt" class="easyui-tabs"></div>
    </div>
</div>