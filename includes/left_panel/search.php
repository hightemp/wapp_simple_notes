<!-- Поиск -->
<div title="<i class='fa fa-search' aria-hidden='true'></i>" style="padding:0px" id="search-left-panel">
    <div id="search-left-panel-header">
        <div>
            <input 
                id="search-fitler-textbox" 
                class="easyui-textbox" 
                type="text" 
                data-options="fit:true"
            />
        </div>
        <a href="#" class="easyui-linkbutton" id="clear-btn">Очистить</a>
        <a href="#" class="easyui-linkbutton" id="search-btn">Поиск</a>
    </div>
    <table id="search-list" class="easyui-datagrid" data-options="fit:true"></table>

    <div style="position:fixed">
        <div id="search-mm" class="easyui-menu" style="width:auto;">
            <div data-options="id:'edit'">Радактировать</div>
            <div data-options="id:'delete'">Удалить</div>
        </div>
    </div>
</div>