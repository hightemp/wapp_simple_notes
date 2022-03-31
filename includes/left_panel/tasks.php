<!-- Задачник -->
<div title="<i class='fa fa-check' aria-hidden='true'></i>" style="padding:0px" id="todo-list-panel">
    <div 
        class="easyui-panel" 
        title="  " 
        style="padding:0px;display: grid;grid-template-rows: 1fr 1fr;"
        data-options="tools:'#todo-tt', fit:true"
    >
        <table id="undone-todo-list" class="easyui-datagrid" data-options="fit:true"></table>
        <table id="done-todo-list" class="easyui-datagrid" data-options="fit:true"></table>
    </div>
    <div id="todo-tt">
        <a href="javascript:void(0)" class="icon-add" id="todo-add-btn"></a>
        <a href="javascript:void(0)" class="icon-edit" id="todo-edit-btn"></a>
        <a href="javascript:void(0)" class="icon-remove" id="todo-remove-btn"></a>
        <a href="javascript:void(0)" class="icon-reload" id="todo-reload-btn"></a>
    </div>

    <div style="position:fixed">
        <div id="todo-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#todo-dlg-buttons'">
            <form id="todo-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
                <div style="margin-bottom:10px">
                    <label>Текст:</label>
                    <input name="text" class="easyui-textbox" style="width:100%;height:200px" multiline="true">
                </div>
            </form>
        </div>
        <div id="todo-dlg-buttons">
            <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="todo-dlg-save-btn" style="width:auto">Сохранить</a>
            <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="todo-dlg-cancel-btn" style="width:auto">Отмена</a>
        </div>

        <div id="todo-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'check'">Выполнено</div>
            <div data-options="id:'uncheck'">Не выполнено</div>
            <div data-options="id:'edit'">Радактировать</div>
            <div data-options="id:'delete'">Удалить</div>
        </div>

    </div>
</div>