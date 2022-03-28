<!-- Изображения -->
<div title="<i class='fa fa-image' aria-hidden='true'></i>" style="padding:0px" id="images-left-panel">
    <div id="images-left-panel-header">
        <div>
            <input 
                id="images-filter-textbox" 
                class="easyui-textbox" 
                type="text" 
            />
        </div>
        <a href="javascript:void(0)" id="images-home-btn" class="easyui-menubutton" data-options="iconCls:'icon-more',menu:'#images-home-btn-mm'"></a>
        <div id="images-home-btn-mm" style="display:none">
            <div id="add-diagram-btn" href="#" data-options="iconCls:'icon-add'">Добавить</div>
            <div id="delete-diagram-btn" href="#" data-options="iconCls:'icon-remove'">Удалить</div>
        </div>
    </div>
    <ul id="images-list" class="easyui-datagrid" data-options="fit:true"></ul>
</div>