<!-- Таблицы -->
<div title="<i class='fa fa-table' aria-hidden='true'></i>" style="padding:0px" id="tables-tab">
    <div class="easyui-layout" data-options="fit:true">
        <div data-options="region:'west',split:true" title="" style="width:150px;">
            <div 
                class="easyui-panel" 
                title="  " 
                style="padding:0px;"
                data-options="tools:'#tables-categories-tree-tt', fit:true"
            >
                <ul id="tables-categories-tree" class="easyui-tree" data-options="fit:true"></ul>
            </div>
            <div id="tables-categories-tree-tt">
                <a href="javascript:void(0)" class="icon-add" id="tables-categories-tree-add-btn"></a>
                <a href="javascript:void(0)" class="icon-edit" id="tables-categories-tree-edit-btn"></a>
                <a href="javascript:void(0)" class="icon-remove" id="tables-categories-tree-remove-btn"></a>
                <a href="javascript:void(0)" class="icon-reload" id="tables-categories-tree-reload-btn"></a>
            </div>
        </div>
        <div data-options="region:'center',title:'',iconCls:'icon-ok'">
            <div 
                class="easyui-panel" 
                title="  " 
                style="padding:0px;"
                data-options="tools:'#tables-list-tt', fit:true"
            >
                <table id="tables-list" class="easyui-datalist" title="" lines="true" data-options="fit:true"></table>
            </div>
            <div id="tables-list-tt">
                <a href="javascript:void(0)" class="icon-add" id="tables-list-add-btn"></a>
                <a href="javascript:void(0)" class="icon-edit" id="tables-list-edit-btn"></a>
                <a href="javascript:void(0)" class="icon-remove" id="tables-list-remove-btn"></a>
                <a href="javascript:void(0)" class="icon-reload" id="tables-list-reload-btn"></a>
            </div>
        </div>
    </div>

    <div style="position:fixed">
        <!-- Категории -->
        <div id="tables-category-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#tables-category-dlg-buttons'">
            <form id="tables-category-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
                <div style="margin-bottom:10px">
                    <label>Категория:</label>
                    <input name="category_id" class="easyui-combotree" data-options="url:'ajax.php?method=list_tree_tables_categories',method:'get',labelPosition:'top'" style="width:100%">
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
        <div id="tables-category-dlg-buttons">
            <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="tables-category-dlg-save-btn" style="width:auto">Сохранить</a>
            <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="tables-category-dlg-cancel-btn" style="width:auto">Отмена</a>
        </div>

        <!-- Таблицы -->
        <div id="tables-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#tables-dlg-buttons'">
            <form id="tables-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
                <div style="margin-bottom:10px">
                    <label>Категория:</label>
                    <input name="category_id" class="easyui-combotree" data-options="url:'ajax.php?method=list_tree_tables_categories',method:'get',labelPosition:'top'" style="width:100%" required="true" id="tables-dlg-category_id-combotree">
                </div>
                <div style="margin-bottom:10px">
                    <label>Заголовок:</label>
                    <input name="name" class="easyui-textbox" required="true" style="width:100%">
                </div>
                <div style="margin-bottom:10px">
                    <label>Тэги:</label>
                    <input 
                        name="tags"
                        id="tables-tags-box"
                        class="easyui-tagbox" 
                        style="width:100%" 
                        data-options="
                            url: 'ajax.php?method=list_tags',
                            method: 'get',
                            value: '',
                            valueField: 'text',
                            textField: 'text',
                            limitToList: false,
                            hasDownArrow: true,
                            prompt: 'Тэги'
                        "
                    >
                </div>
                <div style="margin-bottom:10px">
                    <label>Описание:</label>
                    <input name="description" class="easyui-textbox" style="width:100%;height:200px" multiline="true">
                </div>
            </form>
        </div>
        <div id="tables-dlg-buttons">
            <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="tables-dlg-save-btn" style="width:auto">Сохранить</a>
            <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="tables-dlg-cancel-btn" style="width:auto">Отмена</a>
        </div>

        <div id="tables-category-select-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'create_category'">Создать категорию</div>
            <div data-options="id:'create_table'">Создать таблицу</div>
            <div data-options="id:'edit'">Радактировать</div>
            <div data-options="id:'delete'">Удалить</div>
        </div>

        <div id="tables-category-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'create_category'">Создать категорию</div>
        </div>

        <div id="tables-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'edit'">Радактировать</div>
            <div data-options="id:'delete'">Удалить</div>
        </div>
    </div>
</div>