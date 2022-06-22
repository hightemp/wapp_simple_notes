<!-- Изображения -->
<div title="<i class='fa fa-image' aria-hidden='true'></i>" style="padding:0px" id="files-left-panel">
    <div class="easyui-layout" data-options="fit:true">
        <div data-options="region:'north',split:true,border:false" title="" style="height:400px;">
            <div 
                class="easyui-panel images-list-panel" 
                title="Изображения" 
                style="padding:0px;"
                data-options="tools:'#images-tt', fit:true"
            >
                <div>
                    <input 
                        id="images-filter-textbox" 
                        class="easyui-textbox" 
                        type="text" 
                        value=""
                        data-options="fit:true"
                    />
                </div>
                <table id="images-list" class="easyui-datagrid" data-options="fit:true"></table>
            </div>
            <div style="position:fixed">
                <div id="images-tt">
                    <a href="javascript:void(0)" class="icon-add" id="images-add-btn"></a>
                    <a href="javascript:void(0)" class="icon-edit" id="images-edit-btn"></a>
                    <a href="javascript:void(0)" class="icon-remove" id="images-remove-btn"></a>
                    <a href="javascript:void(0)" class="icon-reload" id="images-reload-btn"></a>
                </div>
            </div>
        </div>
        <div data-options="region:'center',title:'',iconCls:'icon-ok',border:false">
            <div 
                class="easyui-panel files-list-panel" 
                title="Файлы" 
                style="padding:0px;"
                data-options="tools:'#files-tt', fit:true"
            >
                <div>
                    <input 
                        id="files-filter-textbox" 
                        class="easyui-textbox" 
                        type="text" 
                        value=""
                        data-options="fit:true"
                    />
                </div>
                <table id="files-list" class="easyui-datagrid" data-options="fit:true"></table>
            </div>
            <div style="position:fixed">
                <div id="files-tt">
                    <a href="javascript:void(0)" class="icon-add" id="files-add-btn"></a>
                    <a href="javascript:void(0)" class="icon-edit" id="files-edit-btn"></a>
                    <a href="javascript:void(0)" class="icon-remove" id="files-remove-btn"></a>
                    <a href="javascript:void(0)" class="icon-reload" id="files-reload-btn"></a>
                </div>
            </div>
        </div>
    </div>

    <div style="position:fixed">
        <div id="images-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#images-dlg-buttons'">
            <form id="images-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
                <div style="margin-bottom:10px">
                    <label>Имя:</label>
                    <input name="name" class="easyui-textbox" required="true" style="width:100%">
                </div>
                <div style="margin-bottom:10px">
                    <label>Тип:</label>
                    <input name="type" class="easyui-textbox" style="width:100%">
                </div>
                <div style="margin-bottom:10px">
                    <label>Имя файла:</label>
                    <input name="filename" class="easyui-textbox" data-options="disabled:true" style="width:100%">
                </div>
            </form>
        </div>
        <div id="images-dlg-buttons">
            <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="images-dlg-save-btn" style="width:auto">Сохранить</a>
            <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="images-dlg-cancel-btn" style="width:auto">Отмена</a>
        </div>

        <div id="files-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#files-dlg-buttons'">
            <form id="files-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
                <div style="margin-bottom:10px">
                    <label>Имя:</label>
                    <input name="name" class="easyui-textbox" required="true" style="width:100%">
                </div>
                <div style="margin-bottom:10px">
                    <label>Тип:</label>
                    <input name="type" class="easyui-textbox" style="width:100%">
                </div>
                <div style="margin-bottom:10px">
                    <label>Имя файла:</label>
                    <input name="filename" class="easyui-textbox" data-options="disabled:true" style="width:100%">
                </div>
            </form>
        </div>
        <div id="files-dlg-buttons">
            <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="files-dlg-save-btn" style="width:auto">Сохранить</a>
            <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="files-dlg-cancel-btn" style="width:auto">Отмена</a>
        </div>

        <div id="images-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'edit'">Радактировать</div>
            <div data-options="id:'delete'">Удалить</div>
        </div>

        <div id="files-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'edit'">Радактировать</div>
            <div data-options="id:'delete'">Удалить</div>
        </div>
    </div>
</div>