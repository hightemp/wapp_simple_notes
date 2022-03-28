import { tpl, fnAlertMessage } from "./lib.js"
import { CategoriesNotes } from "./notes-categories.js"

export class Tasks {
    static sURL = ``

    static oURLs = {
        create: 'ajax.php?method=create_task',
        update: tpl`ajax.php?method=update_task&id=${0}`,
        delete: 'ajax.php?method=delete_task',
        list: tpl`ajax.php?method=list_notes&category_id=${0}`,

        list_undone: `ajax.php?method=list_last_undone_tasks`,
        list_done: `ajax.php?method=list_last_done_tasks`,

        check_task: 'ajax.php?method=check_task',
        uncheck_task: 'ajax.php?method=uncheck_task',
    }
    static oWindowTitles = {
        create: 'Новая задача',
        update: 'Редактировать задачу'
    }
    static oEvents = {
        tasks_save: "tasks:save",
        tasks_item_click: "tasks:item_click",
    }

    static get sTodoListToolbar() {
        return `#todo-list-tb`;
    }

    static get oDialog() {
        return $('#todo-dlg');
    }
    static get oDialogForm() {
        return $('#todo-dlg-fm');
    }

    static get oComponentUndone() {
        return $("#todo-list");
    }
    static get oComponentDone() {
        return $("#done-todo-list");
    }
    static get oContextMenu() {
        return $("#todo-mm");
    }

    static get oEditDialogSaveBtn() {
        return $('#todo-dlg-save-btn');
    }
    static get oEditDialogCancelBtn() {
        return $('#todo-dlg-cancel-btn');
    }

    static get oPanelAddButton() {
        return $('#todo-add-btn');
    }
    static get oPanelEditButton() {
        return $('#todo-edit-btn');
    }
    static get oPanelRemoveButton() {
        return $('#todo-remove-btn');
    }
    static get oPanelReloadButton() {
        return $('#todo-reload-btn');
    }

    static get fnComponentUndone() {
        return this.oComponentUndone.datagrid.bind(this.oComponent);
    }
    static get fnComponentDone() {
        return this.oComponentDone.datagrid.bind(this.oComponent);
    }

    static get oSelectedCategory() {
        return CategoriesNotes.oSelected;
    }

    static fnShowDialog(sTitle) {
        this.oDialog.dialog('open').dialog('center').dialog('setTitle', sTitle);
    }
    static fnDialogFormLoad(oRows={}) {
        this.oDialogForm.form('clear');
        this.oDialogForm.form('load', oRows);
    }

    static fnShowCreateWindow() {
        this.sURL = this.oURLs.create;
        var oData = {}
        this.fnShowDialog(this.oWindowTitles.create);
        this.fnDialogFormLoad(oData);
    }

    static fnShowEditWindow(oRow) {
        if (oRow) {
            this.sURL = this.oURLs.update(oRow.id);
            this.fnShowDialog(this.oWindowTitles.update);
            this.fnDialogFormLoad(oRow);
        }
    }

    static fnReload() {
        this.fnComponent('reload');
    }

    static fnSave() {
        this.oDialogForm.form('submit', {
            url: this.sURL,
            iframe: false,
            onSubmit: () => {
                return $(this).form('validate');
            },
            success: ((result) => {
                this.oDialog.dialog('close');
                this.fnReload();

                this.fnFireEvent_Save();
            }).bind(this)
        });
    }

    static fnDelete(oRow) {
        if (oRow){
            $.messager.confirm(
                'Confirm',
                'Удалить?',
                ((r) => {
                    if (r) {
                        $.post(
                            this.oURLs.delete,
                            { id: oRow.id },
                            ((result) => {
                                this.fnReload();
                            }).bind(this),
                            'json'
                        );
                    }
                }).bind(this)
            );
        }
    }

    static fnBindEvents()
    {
        this.oEditDialogSaveBtn.click((() => {
            console.log('test');
            this.fnSave();
        }).bind(this))
        this.oEditDialogCancelBtn.click((() => {
            this.oDialog.dialog('close');
        }).bind(this))

        this.oPanelAddButton.click((() => {
            this.fnShowCreateWindow();
        }).bind(this))
        this.oPanelEditButton.click((() => {
            this.fnShowEditWindow(this.fnGetSelected());
        }).bind(this))
        this.oPanelRemoveButton.click((() => {
            this.fnDelete(this.fnGetSelected());
        }).bind(this))
        this.oPanelReloadButton.click((() => {
            this.fnReload();
        }).bind(this))
    }

    static fnFireEvent_Save() {
        $(document).trigger(this.oEvents.tasks_save);
    }

    static fnFireEvent_ItemClick(oRow) {
        $(document).trigger(this.oEvents.tasks_item_click, [ oRow ]);
    }

    static fnInitComponent()
    {
        this.fnComponentUndone({
            singleSelect: true,

            url: this.oURLs.list_undone,
            method: 'get',

            columns:[[
                {field:'created_at',title:'Создано',width:100},
                {
                    field:'text',title:'Описание',width:400,
                    formatter: function(value,row,index){
                        return `<div class="wrapped-text">${value}</style>`
                    }
                },
            ]],

            onRowContextMenu: (function(e, index, node) {
                console.log(node);
                e.preventDefault();
                this.oContextMenu.menu('show', {
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
            }).bind(this),
        });

        this.fnComponentDone({
            singleSelect: true,

            url: this.oURLs.list_done,
            method: 'get',

            columns:[[
                {field:'created_at',title:'Создано',width:100},
                {
                    field:'text',title:'Описание',width:400,
                    formatter: function(value,row,index){
                        return `<div class="wrapped-text">${value}</style>`
                    }
                },
            ]],

            onRowContextMenu: (function(e, index, node) {
                console.log(node);
                e.preventDefault();
                this.oContextMenu.menu('show', {
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
            }).bind(this),
        });
    }

    static fnPrepare()
    {
        this.fnBindEvents();
        this.fnInitComponent();
    }
}