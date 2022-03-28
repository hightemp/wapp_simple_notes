<!-- Рандомные заметки -->
<div title="<i class='fa fa-book' aria-hidden='true'></i>" style="padding:0px">
    <div 
        class="easyui-panel" 
        title="  " 
        style="padding:0px;"
        data-options="tools:'#random-notes-tt', fit:true"
    >
        <table id="random-notes-list" class="easyui-datagrid"></table>
    </div>
    <div id="random-notes-tt">
        <a href="javascript:void(0)" class="icon-add" id="random-notes-add-btn"></a>
        <a href="javascript:void(0)" class="icon-edit" id="random-notes-edit-btn"></a>
        <a href="javascript:void(0)" class="icon-remove" id="random-notes-remove-btn"></a>
        <a href="javascript:void(0)" class="icon-reload" id="random-notes-reload-btn"></a>
    </div>

    <div style="position:fixed">
        <div id="random-note-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#random-note-dlg-buttons'">
            <form id="random-note-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
                <div style="margin-bottom:10px">
                    <label>Текст:</label>
                    <input name="text" class="easyui-textbox" style="width:100%;height:200px" multiline="true">
                </div>
            </form>
        </div>
        <div id="random-note-dlg-buttons">
            <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="random-note-dlg-save-btn" style="width:auto">Сохранить</a>
            <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="random-note-dlg-cancel-btn" style="width:auto">Отмена</a>
        </div>

        <div id="random-notes-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'edit'">Радактировать</div>
            <div data-options="id:'delete'">Удалить</div>
        </div>
    </div>
</div>