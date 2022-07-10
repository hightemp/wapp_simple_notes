<!-- Тэги -->
<div title="<i class='fa fa-tags' aria-hidden='true'></i>" style="padding:0px">
    <div class="easyui-layout" data-options="fit:true,border:false">
        <div data-options="region:'west',split:true" title="" style="width:200px;">
            <div 
                class="easyui-panel" 
                title="Тэги" 
                style="padding:0px;"
                data-options="tools:'#tags-tt', fit:true,border:false"
            >
                <ul id="tags-list" class="easyui-datagrid" lines="true" data-options="fit:true,border:false"></ul>
            </div>
            <div id="tags-tt">
                <div class="tools-panel-free-space"></div>
                <a href="javascript:void(0)" class="icon-add" id="tags-add-btn"></a>
                <a href="javascript:void(0)" class="icon-edit" id="tags-edit-btn"></a>
                <a href="javascript:void(0)" class="icon-remove" id="tags-remove-btn"></a>
                <a href="javascript:void(0)" class="icon-reload" id="tags-reload-btn"></a>
            </div>
        </div>
        <div data-options="region:'center',title:'',border:false">
            
            <div class="easyui-layout" data-options="fit:true,border:false">
                <div data-options="region:'west',split:true,border:false" title="" style="width:200px;">
                    <div 
                        class="easyui-panel" 
                        title="Подтэги" 
                        style="padding:0px;"
                        data-options="tools:'#tag-children-list-tt', fit:true"
                    >
                        <ul id="tag-children-list" class="easyui-datagrid" title="" lines="true" data-options="fit:true,border:false"></ul>
                    </div>
                    <div id="tag-children-list-tt">
                        <div class="tools-panel-free-space"></div>
                        <a href="javascript:void(0)" class="icon-add" id="tag-children-add-btn"></a>
                        <a href="javascript:void(0)" class="icon-edit" id="tag-children-edit-btn"></a>
                        <a href="javascript:void(0)" class="icon-remove" id="tag-children-remove-btn"></a>
                        <a href="javascript:void(0)" class="icon-reload" id="tag-children-reload-btn"></a>
                    </div>
                </div>
                <div data-options="region:'center',title:'',border:false">
                    <div 
                        class="easyui-panel" 
                        title="Заметки" 
                        style="padding:0px;"
                        data-options="tools:'#tags-notes-list-tt', fit:true,border:false"
                    >
                        <ul id="tags-notes-list" class="easyui-datagrid" title="" lines="true" data-options="fit:true,border:false"></ul>
                    </div>
                    <div id="tags-notes-list-tt">
                        <div class="tools-panel-free-space"></div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div style="position:fixed">
        <!-- Тэги -->
        <div id="tags-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#tags-dlg-buttons'">
            <form id="tags-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
                <div style="margin-bottom:10px">
                    <label>Заголовок:</label>
                    <input name="name" class="easyui-textbox" required="true" style="width:100%">
                </div>
            </form>
        </div>
        <div id="tags-dlg-buttons">
            <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="tags-dlg-save-btn" style="width:auto">Сохранить</a>
            <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="tags-dlg-cancel-btn" style="width:auto">Отмена</a>
        </div>

        <!-- Элементы -->
        <div id="tag-children-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#tag-children-dlg-buttons'">
            <form id="tag-children-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
                <div style="margin-bottom:10px">
                    <label>Заголовок:</label>
                    <input name="name" class="easyui-textbox" required="true" style="width:100%">
                </div>
            </form>
        </div>
        <div id="tag-children-dlg-buttons">
            <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="tag-children-dlg-save-btn" style="width:auto">Сохранить</a>
            <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="tag-children-dlg-cancel-btn" style="width:auto">Отмена</a>
        </div>

        <div id="tags-select-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'create_category'">Создать категорию</div>
            <div data-options="id:'create_table'">Создать таблицу</div>
            <div data-options="id:'edit'">Радактировать</div>
            <div data-options="id:'delete'">Удалить</div>
        </div>

        <div id="tags-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'edit'">Радактировать</div>
            <div data-options="id:'delete'">Удалить</div>
        </div>

        <!-- Меню - Заметки -->
        <div id="tags-notes-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'preview'">Превью</div>
            <div data-options="id:'edit_with_tiny'">Редактировать с помощью tinymce</div>
            <div data-options="id:'edit_with_simple_editor'">Редактировать с помощью простого редактора</div>

            <div data-options="id:'edit'">Изменить</div>
            <div data-options="id:'delete'">Удалить</div>

            <div data-options="id:'add_to_fav'">В избранное</div>
            <div data-options="id:'remove_from_fav'">Убрать из избранного</div>
        </div>

        <div id="tag-children-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'edit'">Радактировать</div>
            <div data-options="id:'delete'">Удалить</div>
        </div>
    </div>
</div>