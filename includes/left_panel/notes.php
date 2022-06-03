<!-- Заметки -->
<div title="<i class='fa fa-sticky-note' aria-hidden='true'></i>" style="padding:0px" id="notes-tab">
    <div class="easyui-layout" data-options="fit:true">
        
        <div data-options="region:'west',split:true" title="" style="width:300px;">
            <div 
                class="easyui-panel" 
                title="  " 
                style="padding:0px;"
                data-options="tools:'#categories-tt', fit:true"
            >
                <ul id="categories-tree" class="easyui-treegrid" data-options="fit:true"></ul>
            </div>
            <div id="categories-tt">
                <a href="javascript:void(0)" class="icon-add" id="category-add-btn"></a>
                <a href="javascript:void(0)" class="icon-edit" id="category-edit-btn"></a>
                <a href="javascript:void(0)" class="icon-remove" id="category-remove-btn"></a>
                <a href="javascript:void(0)" class="icon-reload" id="category-reload-btn"></a>
            </div>
        </div>
        <div data-options="region:'center',title:'',iconCls:'icon-ok'">
            <div 
                class="easyui-panel" 
                title="  " 
                style="padding:0px;"
                data-options="tools:'#notes-list-tt', fit:true"
            >
                <ul id="notes-list" class="easyui-datagrid" title="" lines="true" data-options="fit:true"></ul>
            </div>
            <div id="notes-list-tt">
                <a href="javascript:void(0)" class="icon-add" id="note-add-btn"></a>
                <a href="javascript:void(0)" class="icon-edit" id="note-edit-btn"></a>
                <a href="javascript:void(0)" class="icon-remove" id="note-remove-btn"></a>
                <a href="javascript:void(0)" class="icon-reload" id="note-reload-btn"></a>
            </div>
        </div>

        <!-- ######## КОМПОНЕНТЫ ######## -->
        <div style="position: fixed;">
            <!-- Меню - Категории -->
            <div id="category-select-mm" class="easyui-menu" style="width:auto;">
                <div data-options="id:'create_category'">Создать категорию</div>
                <div data-options="id:'create_note'">Создать заметку</div>
                <div data-options="id:'edit'">Радактировать</div>
                <div data-options="id:'delete'">Удалить</div>
            </div>

            <div id="category-mm" class="easyui-menu" style="width:auto;">
                <div data-options="id:'create_category'">Создать категорию</div>
            </div>

            <!-- Меню - Заметки -->
            <div id="note-mm" class="easyui-menu" style="width:auto;">
                <div data-options="id:'add_to_fav'">В избранное</div>
                <div data-options="id:'remove_from_fav'">Убрать из избранного</div>
                <div data-options="id:'edit'">Радактировать</div>
                <div data-options="id:'delete'">Удалить</div>
            </div>

            <!-- Категории -->
            <div id="category-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#category-dlg-buttons'">
                <form id="category-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
                    <div style="margin-bottom:10px">
                        <label>Категория:</label>
                        <input name="category_id" id="category-dlg-category_id-combotree" class="easyui-combotree" style="width:100%">
                    </div>
                    <div style="margin-bottom:10px">
                        <label>Заголовок:</label>
                        <input name="name" class="easyui-textbox" required="true" style="width:100%">
                    </div>
                    <div style="margin-bottom:10px">
                        <label>Описание:</label>
                        <input name="description" class="easyui-textbox" style="width:100%;height:200px" multiline="true">
                    </div>
                </form>
            </div>
            <div id="category-dlg-buttons">
                <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="category-dlg-save-btn" style="width:auto">Сохранить</a>
                <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="category-dlg-cancel-btn" style="width:auto">Отмена</a>
            </div>

            <!-- Заметки -->
            <div id="note-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#note-dlg-buttons'">
                <form id="note-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
                    <div style="margin-bottom:10px">
                        <label>Категория:</label>
                        <input name="category_id" id="note-dlg-category_id-combotree" class="easyui-combotree" style="width:100%" required="true">
                    </div>
                    <div style="margin-bottom:10px">
                        <label>Заголовок:</label>
                        <input name="name" class="easyui-textbox" required="true" style="width:100%">
                    </div>
                    <div style="margin-bottom:10px">
                        <label>Тэги:</label>
                        <input 
                            name="tags"
                            id="note-tags-box"
                            class="easyui-tagbox" 
                            style="width:100%" 
                        >
                    </div>
                    <div style="margin-bottom:10px">
                        <label>Описание:</label>
                        <input name="description" class="easyui-textbox" style="width:100%;height:200px" multiline="true">
                    </div>
                </form>
            </div>
            <div id="note-dlg-buttons">
                <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="note-dlg-save-btn" style="width:auto">Сохранить</a>
                <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="note-dlg-cancel-btn" style="width:auto">Отмена</a>
            </div>
        </div>
    </div>
</div>

