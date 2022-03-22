<?php 

include_once("./database.php");

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" type="text/css" href="<?php echo $sB ?>/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="<?php echo $sB ?>/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="<?php echo $sBA ?>/styles_index.css">
    <script type="text/javascript" src="<?php echo $sB ?>/jquery.min.js"></script>
    <script type="text/javascript" src="<?php echo $sB ?>/jquery.easyui.min.js"></script>

    <link rel="stylesheet" type="text/css" href="<?php echo $sBA ?>/easymde.min.css">
    <script type="text/javascript" src="<?php echo $sBA ?>/easymde.min.js"></script>
    <script type="text/javascript" src="<?php echo $sBA ?>/all.js"></script>

    <script src="https://cdn.jsdelivr.net/highlight.js/latest/highlight.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/highlight.js/latest/styles/github.min.css">
</head>
<body>
    <!-- <div id="top-panel">
        <div class="easyui-panel" style="padding:5px;display: flex; gap: 5px">
            <b>Заметки</b>
            <div style="margin-left: auto;"></div>
            <a href="#" class="easyui-linkbutton" id="help-btn" onclick="fnShowHelpDialog()">Помощь</a>
        </div>
    </div> -->
    <div id="main-panel">
        <div class="easyui-layout" style="" data-options="fit:true">
            <div data-options="region:'west',split:true" title="" style="width:500px;">
                <div class="easyui-tabs" style="" data-options="fit:true">
                    <!-- Заметки -->
                    <div title="<i class='fa fa-sticky-note' aria-hidden='true'></i>" style="padding:0px" id="notes-tab">
                        <div class="easyui-layout" data-options="fit:true">
                            
                            <div data-options="region:'west',split:true" title="" style="width:150px;">
                                <div 
                                    class="easyui-panel" 
                                    title="  " 
                                    style="padding:0px;"
                                    data-options="tools:'#notes-categories-tt', fit:true"
                                >
                                    <ul id="categories-tree" class="easyui-tree" data-options="fit:true"></ul>
                                </div>
                                <div id="notes-categories-tt">
                                    <a href="javascript:void(0)" class="icon-add" id="notes-add-category-btn"></a>
                                    <a href="javascript:void(0)" class="icon-edit" id="notes-edit-category-btn"></a>
                                    <a href="javascript:void(0)" class="icon-remove" id="notes-remove-category-btn"></a>
                                    <a href="javascript:void(0)" class="icon-reload" id="notes-reload-category-btn"></a>
                                </div>
                            </div>
                            <div data-options="region:'center',title:'',iconCls:'icon-ok'">
                                <div 
                                    class="easyui-panel" 
                                    title="  " 
                                    style="padding:0px;"
                                    data-options="tools:'#notes-list-tt', fit:true"
                                >
                                    <ul id="notes-list" class="easyui-datalist" title="" lines="true" data-options="fit:true"></ul>
                                </div>
                                <div id="notes-list-tt">
                                    <a href="javascript:void(0)" class="icon-add" id="notes-add-note-btn"></a>
                                    <a href="javascript:void(0)" class="icon-edit" id="notes-edit-note-btn"></a>
                                    <a href="javascript:void(0)" class="icon-remove" id="notes-remove-note-btn"></a>
                                    <a href="javascript:void(0)" class="icon-reload" id="notes-reload-note-btn"></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Заметки -->
                    <div title="<i class='fa fa-table' aria-hidden='true'></i>" style="padding:0px" id="tables-tab">
                        <div class="easyui-layout" style="" data-options="fit:true">
                            <div data-options="region:'west',split:true" title="" style="width:150px;">
                                <ul id="tables-categories-tree" class="easyui-tree" data-options="fit:true"></ul>
                            </div>
                            <div data-options="region:'center',title:'',iconCls:'icon-ok'">
                                <ul id="tables-list" class="easyui-datalist" title="" lines="true" data-options="fit:true"></ul>
                            </div>
                        </div>
                    </div>
                    <!-- Последние -->
                    <div title="<i class='fa fa-history' aria-hidden='true'></i>" style="padding:0px">
                        <table class="easyui-datagrid" id="last-notes-list"></table>
                        <!-- <ul id="last-notes-list" class="easyui-datalist" title="" lines="true" data-options="fit:true"></ul> -->
                    </div>
                    <!-- Избранное -->
                    <div title="<i class='fa fa-star' aria-hidden='true'></i>" style="padding:0px">
                        <ul id="fav-notes-list" class="easyui-datalist" title="" lines="true" data-options="fit:true"></ul>
                    </div>
                    <!-- Тэги -->
                    <div title="<i class='fa fa-tags' aria-hidden='true'></i>" style="padding:0px">
                        <ul id="tags-notes-list" class="easyui-datalist" title="" lines="true" data-options="fit:true"></ul>
                    </div>
                    <!-- Рандомные заметки -->
                    <div title="<i class='fa fa-book' aria-hidden='true'></i>" style="padding:0px">
                        <ul id="random-notes-list" class="easyui-datagrid" data-options="fit:true"></ul>
                    </div>
                    <!-- Задачник -->
                    <div title="<i class='fa fa-check' aria-hidden='true'></i>" style="padding:0px" id="todo-list-panel">
                        <ul id="todo-list" class="easyui-datagrid" data-options="fit:true"></ul>
                        <ul id="done-todo-list" class="easyui-datagrid" data-options="fit:true"></ul>
                    </div>
                    <!-- Поиск -->
                    <div title="<i class='fa fa-search' aria-hidden='true'></i>" style="padding:0px" id="search-left-panel">
                        <div id="search-left-panel-header">
                            <div>
                                <input 
                                    id="search-fitler-textbox" 
                                    class="easyui-textbox" 
                                    type="text" 
                                />
                            </div>
                        </div>
                        <ul id="search-list" class="easyui-datagrid" data-options="fit:true"></ul>
                    </div>
                    <!-- Изображения -->
                    <div title="<i class='fa fa-image' aria-hidden='true'></i>" style="padding:0px" id="images-left-panel">
                        <div id="images-left-panel-header">
                            <div>
                                <input 
                                    id="images-filter-textbox" 
                                    class="easyui-textbox" 
                                    type="text" 
                                />
                            </div>
                            <a href="javascript:void(0)" id="images-home-btn" class="easyui-menubutton" data-options="iconCls:'icon-more',menu:'#images-home-btn-mm'"></a>
                            <div id="images-home-btn-mm" style="display:none">
                                <div id="add-diagram-btn" href="#" data-options="iconCls:'icon-add'">Добавить</div>
                                <div id="delete-diagram-btn" href="#" data-options="iconCls:'icon-remove'">Удалить</div>
                            </div>
                        </div>
                        <ul id="images-list" class="easyui-datagrid" data-options="fit:true"></ul>
                    </div>
                </div>
            </div>
            <div data-options="region:'center',title:'',iconCls:'icon-ok'">
                <div id="notes-tt" class="easyui-tabs" data-options="fit:true" style="">
            </div>
        </div>
    </div>

    <div id="random-notes-list-tb" style="height:auto">
        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-add',plain:true" onclick="fnCreateRandomNote()">Добавить</a>
        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-remove',plain:true" onclick="fnDeleteRandomNote()">Удалить</a>
    </div>

    <div id="todo-list-tb" style="height:auto">
        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-add',plain:true" onclick="fnCreateTask()">Добавить</a>
        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-remove',plain:true" onclick="fnDeleteTask()">Удалить</a>
    </div>

    <div id="category-select-mm" class="easyui-menu" style="width:auto;">
        <div data-options="id:'create_category'">Создать категорию</div>
        <div data-options="id:'create_note'">Создать заметку</div>
        <div data-options="id:'edit'">Радактировать</div>
        <div data-options="id:'delete'">Удалить</div>
    </div>

    <div id="category-mm" class="easyui-menu" style="width:auto;">
        <div data-options="id:'create_category'">Создать категорию</div>
    </div>

    <div id="note-mm" class="easyui-menu" style="width:auto;">
        <div data-options="id:'edit'">Радактировать</div>
        <div data-options="id:'delete'">Удалить</div>
    </div>

    <div id="random-note-mm" class="easyui-menu" style="width:auto;">
        <div data-options="id:'edit'">Радактировать</div>
        <div data-options="id:'delete'">Удалить</div>
    </div>

    <div id="task-mm" class="easyui-menu" style="width:auto;">
        <div data-options="id:'check'">Выполнено</div>
        <div data-options="id:'uncheck'">Не выполнено</div>
        <div data-options="id:'edit'">Радактировать</div>
        <div data-options="id:'delete'">Удалить</div>
    </div>

    <div style="position:fixed">
        <div id="category-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#category-dlg-buttons'">
            <form id="category-fm" method="post" novalidate style="margin:0;padding:5px">
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
            <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" onclick="fnSaveCategory()" style="width:auto">Сохранить</a>
            <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" onclick="$('#category-dlg').dialog('close')" style="width:auto">Отмена</a>
        </div>
    </div>

    <div style="position:fixed">
        <div id="note-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#note-dlg-buttons'">
            <form id="note-fm" method="post" novalidate style="margin:0;padding:5px">
                <input name="category_id" type="hidden">
                <div style="margin-bottom:10px">
                    <label>Категория:</label>
                    <input name="category" class="easyui-textbox" required="true" style="width:100%" readonly="true">
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
        <div id="note-dlg-buttons">
            <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" onclick="fnSaveNote()" style="width:auto">Сохранить</a>
            <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" onclick="$('#note-dlg').dialog('close')" style="width:auto">Отмена</a>
        </div>
    </div>

    <div style="position:fixed">
        <div id="random-note-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#random-note-dlg-buttons'">
            <form id="random-note-fm" method="post" novalidate style="margin:0;padding:5px">
                <div style="margin-bottom:10px">
                    <label>Текст:</label>
                    <input name="text" class="easyui-textbox" style="width:100%;height:200px" multiline="true">
                </div>
            </form>
        </div>
        <div id="random-note-dlg-buttons">
            <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" onclick="fnSaveRandomNote()" style="width:auto">Сохранить</a>
            <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" onclick="$('#note-dlg').dialog('close')" style="width:auto">Отмена</a>
        </div>
    </div>

    <div style="position:fixed">
        <div id="todo-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#todo-dlg-buttons'">
            <form id="todo-fm" method="post" novalidate style="margin:0;padding:5px">
                <div style="margin-bottom:10px">
                    <label>Текст:</label>
                    <input name="text" class="easyui-textbox" style="width:100%;height:200px" multiline="true">
                </div>
            </form>
        </div>
        <div id="todo-dlg-buttons">
            <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" onclick="fnSaveTask()" style="width:auto">Сохранить</a>
            <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" onclick="$('#note-dlg').dialog('close')" style="width:auto">Отмена</a>
        </div>
    </div>

    <div id="help-dlg" class="easyui-dialog" title="Помощь" style="width:600px;height:500px;padding:10px" data-options="closed:true" >
        <table>
            <thead>
            <tr>
            <th align="left">Shortcut (Windows / Linux)</th>
            <th align="left">Shortcut (macOS)</th>
            <th align="left">Action</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td align="left"><em>Ctrl-'</em></td>
            <td align="left"><em>Cmd-'</em></td>
            <td align="left">"toggleBlockquote"</td>
            </tr>
            <tr>
            <td align="left"><em>Ctrl-B</em></td>
            <td align="left"><em>Cmd-B</em></td>
            <td align="left">"toggleBold"</td>
            </tr>
            <tr>
            <td align="left"><em>Ctrl-E</em></td>
            <td align="left"><em>Cmd-E</em></td>
            <td align="left">"cleanBlock"</td>
            </tr>
            <tr>
            <td align="left"><em>Ctrl-H</em></td>
            <td align="left"><em>Cmd-H</em></td>
            <td align="left">"toggleHeadingSmaller"</td>
            </tr>
            <tr>
            <td align="left"><em>Ctrl-I</em></td>
            <td align="left"><em>Cmd-I</em></td>
            <td align="left">"toggleItalic"</td>
            </tr>
            <tr>
            <td align="left"><em>Ctrl-K</em></td>
            <td align="left"><em>Cmd-K</em></td>
            <td align="left">"drawLink"</td>
            </tr>
            <tr>
            <td align="left"><em>Ctrl-L</em></td>
            <td align="left"><em>Cmd-L</em></td>
            <td align="left">"toggleUnorderedList"</td>
            </tr>
            <tr>
            <td align="left"><em>Ctrl-P</em></td>
            <td align="left"><em>Cmd-P</em></td>
            <td align="left">"togglePreview"</td>
            </tr>
            <tr>
            <td align="left"><em>Ctrl-Alt-C</em></td>
            <td align="left"><em>Cmd-Alt-C</em></td>
            <td align="left">"toggleCodeBlock"</td>
            </tr>
            <tr>
            <td align="left"><em>Ctrl-Alt-I</em></td>
            <td align="left"><em>Cmd-Alt-I</em></td>
            <td align="left">"drawImage"</td>
            </tr>
            <tr>
            <td align="left"><em>Ctrl-Alt-L</em></td>
            <td align="left"><em>Cmd-Alt-L</em></td>
            <td align="left">"toggleOrderedList"</td>
            </tr>
            <tr>
            <td align="left"><em>Shift-Ctrl-H</em></td>
            <td align="left"><em>Shift-Cmd-H</em></td>
            <td align="left">"toggleHeadingBigger"</td>
            </tr>
            <td align="left"><em>Ctrl-Alt-K</em></td>
            <td align="left"><em></em></td>
            <td align="left">"toggleOrderedList"</td>
            </tr>
            <td align="left"><em>Ctrl-Alt-T</em></td>
            <td align="left"><em></em></td>
            <td align="left">"drawTable"</td>
            </tr>
            <tr>
            <td align="left"><em>F9</em></td>
            <td align="left"><em>F9</em></td>
            <td align="left">"toggleSideBySide"</td>
            </tr>
            <tr>
            <td align="left"><em>F11</em></td>
            <td align="left"><em>F11</em></td>
            <td align="left">"toggleFullScreen"</td>
            </tr>
            </tbody>
        </table>
    </div>
</body>
</html>

<script>
var oStorage = {};

var oSelectedCategory = {};
var sCategoryURL;
var sNoteURL;
var sRandomNoteURL;
var sTaskURL;

function fnShowHelpDialog() {
    $('#help-dlg').dialog('open').dialog('center');
}

function fnCheckTask(row) {
    $.post(
        'ajax.php?method=check_task',
        {id:row.id},
        function(result){
            $('#todo-list').datagrid('reload');
            $('#done-todo-list').datagrid('reload');
        },
        'json'
    );
}
function fnUncheckTask(row) {
    $.post(
        'ajax.php?method=uncheck_task',
        {id:row.id},
        function(result){
            $('#todo-list').datagrid('reload');
            $('#done-todo-list').datagrid('reload');
        },
        'json'
    );
}
function fnCreateTask() {
    sTaskURL = 'ajax.php?method=create_task';
    $('#todo-dlg').dialog('open').dialog('center').dialog('setTitle','Новая задача');
    $('#todo-fm').form('clear');
}
function fnEditTask(row) {
    if (row){
        sTaskURL = 'ajax.php?method=update_task&id='+row.id;
        $('#todo-dlg').dialog('open').dialog('center').dialog('setTitle','Редактировать задачу');
        $('#todo-fm').form('load',row);
    }
}
function fnSaveTask() {
    $('#todo-fm').form('submit',{
        url: sTaskURL,
        iframe: false,
        onSubmit: function(){
            return $(this).form('validate');
        },
        success: function(result){
            $('#todo-dlg').dialog('close');
            $('#todo-list').datagrid('reload'); 
            $('#done-todo-list').datagrid('reload');
        }
    });
}
function fnDestroyTask(row) {
    if (row){
        $.messager.confirm('Confirm','Удалить?',function(r){
            if (r){
                $.post(
                    'ajax.php?method=delete_task',
                    {id:row.id},
                    function(result){
                        $('#todo-list').datagrid('reload');
                        $('#done-todo-list').datagrid('reload');
                    },
                    'json'
                );
            }
        });
    }
}
function fnDeleteTask() {
    var oRow = $('#todo-list').datagrid('getSelected');
    fnDestroyTask(oRow);
}


function fnCreateRandomNote() {
    sRandomNoteURL = 'ajax.php?method=create_random_note';
    $('#random-note-dlg').dialog('open').dialog('center').dialog('setTitle','Новая заметка');
    $('#random-note-fm').form('clear');
}
function fnEditRandomNote(row) {
    if (row){
        sRandomNoteURL = 'ajax.php?method=update_random_note&id='+row.id;
        $('#random-note-dlg').dialog('open').dialog('center').dialog('setTitle','Редактировать заметку');
        $('#random-note-fm').form('load',row);
    }
}
function fnSaveRandomNote() {
    $('#random-note-fm').form('submit',{
        url: sRandomNoteURL,
        iframe: false,
        onSubmit: function(){
            return $(this).form('validate');
        },
        success: function(result){
            $('#random-note-dlg').dialog('close');        // close the dialog
            $('#random-notes-list').datagrid('reload');    // reload the user data
        }
    });
}
function fnDestroyRandomNote(row) {
    if (row){
        $.messager.confirm('Confirm','Удалить?',function(r){
            if (r){
                $.post(
                    'ajax.php?method=delete_random_note',
                    {id:row.id},
                    function(result){
                        $('#random-notes-list').datagrid('reload');    // reload the user data
                    },
                    'json'
                );
            }
        });
    }
}
function fnDeleteRandomNote() {
    var oRow = $('#random-notes-list').datagrid('getSelected');
    fnDestroyRandomNote(oRow);
}


function fnCreateCategory() {
    sCategoryURL = 'ajax.php?method=create_category';
    $('#category-dlg').dialog('open').dialog('center').dialog('setTitle','Новая категория');
    $('#category-fm').form('clear');
}
function fnEditCategory(row) {
    if (row){
        sCategoryURL = 'ajax.php?method=update_category&id='+row.id;
        $('#category-dlg').dialog('open').dialog('center').dialog('setTitle','Редактировать категорию');
        $('#category-fm').form('load',row);
    }
}
function fnSaveCategory() {
    $('#category-fm').form('submit',{
        url: sCategoryURL,
        iframe: false,
        onSubmit: function(){
            return $(this).form('validate');
        },
        success: function(result){
            $('#category-dlg').dialog('close');        // close the dialog
            $('#categories-tree').tree('reload');    // reload the user data
        }
    });
}
function fnDestroyCategory(row) {
    if (row){
        $.messager.confirm('Confirm','Удалить?',function(r){
            if (r){
                $.post(
                    'ajax.php?method=delete_category',
                    {id:row.id},
                    function(result){
                        $('#category-dg').datagrid('reload');    // reload the user data
                    },
                    'json'
                );
            }
        });
    }
}


function fnCreateNote() {
    if (!oSelectedCategory.id) {
        alert('Не выбрана категория');
        return;
    }
    sNoteURL = 'ajax.php?method=create_note';
    $('#note-dlg').dialog('open').dialog('center').dialog('setTitle','Новая заметка');
    $('#note-fm').form('clear');
    $('#note-fm').form('load',{
        category_id: oSelectedCategory.id,
        category: oSelectedCategory.text
    });
}
function fnEditNote(row) {
    if (row){
        sNoteURL = 'ajax.php?method=update_note&id='+row.id;
        $('#note-dlg').dialog('open').dialog('center').dialog('setTitle','Редактировать заметку');
        $('#note-fm').form('load',row);
    }
}
function fnSaveNote() {
    $('#note-fm').form('submit',{
        url: sNoteURL,
        iframe: false,
        onSubmit: function(){
            return $(this).form('validate');
        },
        success: function(result){
            $('#note-dlg').dialog('close');        // close the dialog
            $('#notes-list').datagrid('reload');    // reload the user data
        }
    });
}
function fnDestroyNote(row) {
    if (row){
        $.messager.confirm('Confirm','Удалить?',function(r){
            if (r){
                $.post(
                    'ajax.php?method=delete_note',
                    {id:row.id},
                    function(result){
                        $('#notes-list').datagrid('reload');    // reload the user data
                    },
                    'json'
                );
            }
        });
    }
}



function fnPrepareTree()
{
    $("#categories-tree").tree({
        url:'/ajax.php?method=list_tree_categories',
        method:'get',
        animate:true,
        lines:true,
        dnd:true,
        onSelect: (node) => {
            oSelectedCategory = node;
            $("#notes-list").datalist({
                url: '/ajax.php?method=list_notes&category_id='+node.id,
                onClickRow: (index,row) => {
                    console.log([index,row]);
                    fnOpenNote(row.id);
                },
                onRowContextMenu: function(e, iIndex, oNoteNode) {
                    console.log(['>>', oNoteNode]);
                    e.preventDefault();
                    $('#note-mm').menu('show', {
                        left: e.pageX,
                        top: e.pageY,
                        onClick: (item) => {
                            if (item.id == 'edit') {
                                fnEditNote(oNoteNode);
                            }
                            if (item.id == 'delete') {
                                fnDestroyNote(oNoteNode);
                            }
                        }
                    });
                },
            })
        },
        onContextMenu: function(e, node) {
            e.preventDefault();
            $('#categories-tree').tree('select', node.target);
            $('#category-select-mm').menu('show', {
                left: e.pageX,
                top: e.pageY,
                onClick: (item) => {
                    console.log(node);
                    if (item.id == 'create_category') {
                        fnCreateCategory();
                    }
                    if (item.id == 'create_note') {
                        fnCreateNote();
                    }
                    if (item.id == 'edit') {
                        fnEditCategory(node);
                    }
                    if (item.id == 'delete') {
                        fnDestroyCategory(node);
                    }
                }
            });
        },
        formatter:function(node) {
            var s = node.text;
            if (node.children){
                s += '&nbsp;<span style=\'color:blue\'>(' + node.notes_count + ')</span>';
            }
            return s;
        }
    })
}

function fnDeleteTask()
{

}

var oTabsIndexes = {};
var oTabsIDs = {};
var oEditors = {};

function fnSaveContent()
{
    var tab = $('#notes-tt').tabs('getSelected');
    var index = $('#notes-tt').tabs('getTabIndex',tab);

    $.post(
        'ajax.php?method=update_note_content',
        {
            id: oTabsIDs[index],
            content: oEditors[oTabsIDs[index]].editor.value()
        }
    ).done(() => {
        $.messager.alert('Сохранено', 'ОК');
    })
}

function fnCreateEditor(oElement, sContent)
{
    var oEditor = new EasyMDE({
        autoDownloadFontAwesome: false,
        shortcuts: {
            "toggleOrderedList": "Ctrl-Alt-K", // alter the shortcut for toggleOrderedList
            "drawTable": "Ctrl-Alt-T", // bind Cmd-Alt-T to drawTable action, which doesn't come with a default shortcut
        },
        // toolbar: [],
        renderingConfig: {
            singleLineBreaks: false,
            codeSyntaxHighlighting: true,
        },
        uploadImage: true,
        imageUploadEndpoint: 'ajax.php?method=upload_image',
        element: oElement,
        minHeight: "100%",
        initialValue: sContent
    });

    oEditor.togglePreview();
    return oEditor;
}

function fnOpenNote(id)
{
    if ($(`#note-${id}`).length) {
        $('#notes-tt').tabs('select', oTabsIndexes[id]);
        return;
    }
    $.post(
        'ajax.php?method=get_note',
        {id},
        function(result){
            console.log(result);

            $('#notes-tt').tabs('add',{
                title: result.name,
                content: `<textarea id="note-${result.id}" style="width:100%;height:100%"></textarea>`,
                closable: true,
            });

            var tab = $('#notes-tt').tabs('getSelected');
            var index = $('#notes-tt').tabs('getTabIndex',tab);

            oTabsIndexes[id] = index;
            oTabsIDs[index] = id;

            oEditors[id] = { editor: null, title: result.name, id: id };
            var oE = document.getElementById(`note-${result.id}`);
            var sC = result.content;
            oEditors[id].editor = fnCreateEditor(oE, sC);
        },
        'json'
    );
}

function fnPrepareHistory()
{
    $("#last-notes-list").datagrid({
        url: '/ajax.php?method=list_last_notes',
        columns:[[
            {field:'created_at',title:'created_at',width:100},
            {field:'name',title:'name'},
        ]],
        singleSelect: true,
        onClickRow: (iIndex, oItem) => {
            console.log(oItem);
            fnOpenNote(oItem.id);
        },
        onRowContextMenu: function(e, node) {
            console.log(node);
            e.preventDefault();
            $('#note-mm').menu('show', {
                left: e.pageX,
                top: e.pageY,
                onClick: (item) => {
                    if (item.id == 'edit') {
                        fnEditNote(node);
                    }
                    if (item.id == 'delete') {
                        fnDestroyNote(node);
                    }
                }
            });
        },
    })
}

function fnPrepareTabs()
{
    $("#notes-tt").datalist({
        // url: '/ajax.php?method=list_last_notes',
        onClick: (oItem) => {
            fnOpenNote(oItem.id);
        }
    })
}

function fnPrepareCategoriesButtons()
{
    $(function(){
        $('#notes-add-category-btn').click(function() {
            fnCreateCategory();
        })
        $('#notes-edit-category-btn').click(function() {
            var node = $("#categories-tree").tree('getSelected');
            fnEditCategory(node);
        })
        $('#notes-remove-category-btn').click(function() {
            var node = $("#categories-tree").tree('getSelected');
            fnDestroyCategory(node);
        })
        $('#notes-reload-category-btn').click(function() {
            $("#categories-tree").tree('reload');
        })

        $('#notes-add-note-btn').click(function() {
            fnCreateNote();
        })
        $('#notes-edit-note-btn').click(function() {
            var node = $("#notes-list").datagrid('getSelected');
            fnEditNote(node);
        })
        $('#notes-remove-note-btn').click(function() {
            var node = $("#notes-list").datagrid('getSelected');
            fnDestroyNote(node);
        })
        $('#notes-reload-note-btn').click(function() {
            $('#notes-list').datagrid('reload');
        })
    })
}

function fnPrepareRandomNotes()
{
    $("#random-notes-list").datagrid({
        iconCls: 'icon-edit',
        singleSelect: true,
        toolbar: '#random-notes-list-tb',
        url: '/ajax.php?method=list_last_random_notes',
        method: 'get',
        columns:[[
            {field:'created_at',title:'created_at',width:100},
            {field:'text',title:'text',width:400},
        ]],
        onRowContextMenu: function(e, index, node) {
            console.log(node);
            e.preventDefault();
            $('#random-note-mm').menu('show', {
                left: e.pageX,
                top: e.pageY,
                onClick: (item) => {
                    if (item.id == 'edit') {
                        fnEditRandomNote(node);
                    }
                    if (item.id == 'delete') {
                        fnDestroyRandomNote(node);
                    }
                }
            });
        },
    });
}

function fnTaskFormatter(val, row) {
    if (val == 1){
        return '<input type="checkbox" disabled="true" checked="checked" />';
    } else {
        return '<input type="checkbox" disabled="true" />';
    }
}

function fnPrepareTasksList()
{
    $(function(){
        var udg = $("#todo-list").datagrid({
            iconCls: 'icon-edit',
            singleSelect: true,
            toolbar: '#todo-list-tb',
            url: '/ajax.php?method=list_last_undone_tasks',
            method: 'get',
            columns:[[
                {field:'created_at',title:'created_at',width:100},
                {field:'text',title:'text',width:400},
            ]],
            onRowContextMenu: function(e, index, node) {
                console.log(node);
                e.preventDefault();
                $('#task-mm').menu('show', {
                    left: e.pageX,
                    top: e.pageY,
                    onClick: (item) => {
                        if (item.id == 'check') {
                            fnCheckTask(node);
                        }
                        if (item.id == 'uncheck') {
                            fnUncheckTask(node);
                        }
                        if (item.id == 'edit') {
                            fnEditTask(node);
                        }
                        if (item.id == 'delete') {
                            fnDestroyTask(node);
                        }
                    }
                });
            },
        });
        // udg.datagrid('enableCellEditing').datagrid('gotoCell', {
        //     index: 0,
        //     field: 'id'
        // });

        var ddg = $("#done-todo-list").datagrid({
            iconCls: 'icon-edit',
            singleSelect: true,
            url: '/ajax.php?method=list_last_done_tasks',
            method: 'get',
            columns:[[
                {field:'created_at',title:'created_at',width:100},
                {field:'text',title:'text',width:400},
            ]],
            onRowContextMenu: function(e, index, node) {
                console.log(node);
                e.preventDefault();
                $('#task-mm').menu('show', {
                    left: e.pageX,
                    top: e.pageY,
                    onClick: (item) => {
                        if (item.id == 'check') {
                            fnCheckTask(node);
                        }
                        if (item.id == 'uncheck') {
                            fnUncheckTask(node);
                        }
                        if (item.id == 'edit') {
                            fnEditTask(node);
                        }
                        if (item.id == 'delete') {
                            fnDestroyTask(node);
                        }
                    }
                });
            },
        });
        // ddg.datagrid('enableCellEditing').datagrid('gotoCell', {
        //     index: 0,
        //     field: 'id'
        // });
    });
}

function fnBindKeys()
{
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            fnSaveContent();
        }
    });
}

function fnPrepareSearchList()
{
    $("#search-fitler-textbox").textbox({
        fit: true
    })
}

function fnPrepareImagesList()
{
    $("#images-fitler-textbox").textbox({
        fit: true
    })
}

$(document).ready(() => {
    fnPrepareTree();
    fnPrepareHistory();
    // fnPrepareTabs();
    fnPrepareCategoriesButtons();
    fnPrepareRandomNotes();
    fnPrepareTasksList();
    fnPrepareSearchList();
    fnPrepareImagesList();
    fnBindKeys();
})
</script>