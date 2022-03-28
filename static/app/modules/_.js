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
            $('#note-dlg').dialog('close');
            $('#notes-list').datagrid('reload');
            $("#last-notes-list").datagrid('reload');
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
                        $('#notes-list').datagrid('reload');
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
            "toggleOrderedList": "Ctrl-Alt-K",
            "drawTable": "Ctrl-Alt-T",
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
        fit: true,
        columns:[[
            {field:'created_at',title:'Создано',width:100},
            {field:'name',title:'Название'},
        ]],
        singleSelect: true,
        onClickRow: (iIndex, oItem) => {
            console.log(oItem);
            fnOpenNote(oItem.id);
        },
        onRowContextMenu: function(e, index, node) {
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
    $("#left-panel-tabs").tabs({
        tools:[
            {
                iconCls:'icon-help',
                handler:function(){
                    fnShowHelpDialog();
                }
            }
        ]
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
    fnPrepareTabs();
    fnPrepareCategoriesButtons();
    fnPrepareRandomNotes();
    fnPrepareTasksList();
    fnPrepareSearchList();
    fnPrepareImagesList();
    fnBindKeys();
})