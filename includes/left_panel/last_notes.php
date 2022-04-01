<!-- Последние -->
<div title="<i class='fa fa-history' aria-hidden='true'></i>" style="padding:0px">
    <div 
        class="easyui-panel" 
        title="  " 
        style="padding:0px;"
        data-options="tools:'#last-notes-tt', fit:true"
    >
        <table class="easyui-datagrid" id="last-notes-list" data-options="fit:true"></table>
    </div>
    <div id="last-notes-tt">
        <!-- <a href="javascript:void(0)" class="icon-add" id="last-notes-add-btn"></a> -->
        <a href="javascript:void(0)" class="icon-edit" id="last-notes-edit-btn"></a>
        <a href="javascript:void(0)" class="icon-remove" id="last-notes-remove-btn"></a>
        <a href="javascript:void(0)" class="icon-reload" id="last-notes-reload-btn"></a>
    </div>

    <!-- ######## КОМПОНЕНТЫ ######## -->
    <div style="position: fixed;">
        <!-- Меню - Заметки -->
        <div id="last-note-mm" class="easyui-menu" style="width:auto;">
            <!-- <div data-options="id:'add_to_fav'">В избранное</div>
            <div data-options="id:'remove_from_fav'">Убрать из избранного</div> -->
            <div data-options="id:'edit'">Радактировать</div>
            <div data-options="id:'delete'">Удалить</div>
        </div>
    </div>
</div>