<!-- Ссылки -->
<div title="<i class='fa fa-link' aria-hidden='true'></i>" style="padding:0px">
    <div 
        class="easyui-panel" 
        title="  " 
        style="padding:0px;"
        data-options="tools:'#links-tt', fit:true"
    >
        <table id="links-list" class="easyui-datagrid"></table>
    </div>
    <div id="links-tt">
        <a href="javascript:void(0)" class="icon-add" id="links-add-btn"></a>
        <a href="javascript:void(0)" class="icon-edit" id="links-edit-btn"></a>
        <a href="javascript:void(0)" class="icon-remove" id="links-remove-btn"></a>
        <a href="javascript:void(0)" class="icon-reload" id="links-reload-btn"></a>
    </div>

    <div style="position:fixed">
        <div id="links-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#links-dlg-buttons'">
            <form id="links-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
                <div style="margin-bottom:10px">
                    <label>Название:</label>
                    <input name="name" class="easyui-textbox" style="width:100%;">
                </div>
                <div style="margin-bottom:10px">
                    <label>URL:</label>
                    <input name="url" class="easyui-textbox" style="width:100%;">
                </div>
            </form>
        </div>
        <div id="links-dlg-buttons">
            <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="links-dlg-save-btn" style="width:auto">Сохранить</a>
            <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="links-dlg-cancel-btn" style="width:auto">Отмена</a>
        </div>

        <div id="links-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'edit'">Радактировать</div>
            <div data-options="id:'delete'">Удалить</div>
        </div>
    </div>
</div>
