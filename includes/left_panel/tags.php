<!-- Тэги -->
<div title="<i class='fa fa-tags' aria-hidden='true'></i>" style="padding:0px">
    <div class="easyui-layout" data-options="fit:true">
        <div data-options="region:'west',split:true" title="" style="width:150px;">
            <div 
                class="easyui-panel" 
                title="  " 
                style="padding:0px;"
                data-options="tools:'#tags-tt', fit:true"
            >
                <ul id="tags-list" class="easyui-datalist" lines="true" data-options="fit:true"></ul>
            </div>
            <div id="tags-tt">
                <a href="javascript:void(0)" class="icon-add" id="tags-add-btn"></a>
                <a href="javascript:void(0)" class="icon-edit" id="tags-edit-btn"></a>
                <a href="javascript:void(0)" class="icon-remove" id="tags-remove-btn"></a>
                <a href="javascript:void(0)" class="icon-reload" id="tags-reload-btn"></a>
            </div>
        </div>
        <div data-options="region:'center',title:'',iconCls:'icon-ok'">
            <div 
                class="easyui-panel" 
                title="  " 
                style="padding:0px;"
                data-options="tools:'#tags-items-list-tt', fit:true"
            >
                <ul id="tags-items-list" class="easyui-datalist" title="" lines="true" data-options="fit:true"></ul>
            </div>
            <div id="tags-items-list-tt">
                <a href="javascript:void(0)" class="icon-add" id="tags-items-list-add-btn"></a>
                <a href="javascript:void(0)" class="icon-edit" id="tags-items-list-edit-btn"></a>
                <a href="javascript:void(0)" class="icon-remove" id="tags-items-list-remove-btn"></a>
                <a href="javascript:void(0)" class="icon-reload" id="tags-items-list-reload-btn"></a>
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
        <div id="tags-items-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#tags-items-dlg-buttons'">
            <form id="tags-items-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
                <div style="margin-bottom:10px">
                    <label>Заголовок:</label>
                    <input name="name" class="easyui-textbox" required="true" style="width:100%">
                </div>
                <div style="margin-bottom:10px">
                    <label>Тэги:</label>
                    <input 
                        name="tags"
                        id="tags-items-tags-box"
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
            </form>
        </div>
        <div id="tags-items-dlg-buttons">
            <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="tags-items-dlg-save-btn" style="width:auto">Сохранить</a>
            <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="tags-items-dlg-cancel-btn" style="width:auto">Отмена</a>
        </div>

        <div id="tags-select-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'create_category'">Создать категорию</div>
            <div data-options="id:'create_table'">Создать таблицу</div>
            <div data-options="id:'edit'">Радактировать</div>
            <div data-options="id:'delete'">Удалить</div>
        </div>

        <div id="tags-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'create_category'">Создать категорию</div>
        </div>

        <div id="tags-items-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'edit'">Радактировать</div>
            <div data-options="id:'delete'">Удалить</div>
        </div>
    </div>
</div>