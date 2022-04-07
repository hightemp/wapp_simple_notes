import { tpl, fnAlertMessage } from "./lib.js"
import { CategoriesNotes } from "./notes-categories.js"

export class RandomNotes {
    static sURL = ``

    static oURLs = {
        create: 'ajax.php?method=create_random_note',
        update: tpl`ajax.php?method=update_random_note&id=${0}`,
        delete: 'ajax.php?method=delete_random_note',
        list: `ajax.php?method=list_last_random_notes`,
    }
    static oWindowTitles = {
        create: 'Новая случайная заметка',
        update: 'Редактировать случайную заметку'
    }
    static oEvents = {
        random_notes_save: "random_notes:save",
        random_notes_item_click: "random_notes:item_click",
    }

    static get oDialog() {
        return $('#random-note-dlg');
    }
    static get oDialogForm() {
        return $('#random-note-dlg-fm');
    }
    static get oComponent() {
        return $("#random-notes-list");
    }
    static get oContextMenu() {
        return $("#random-note-mm");
    }

    static get oEditDialogSaveBtn() {
        return $('#random-note-dlg-save-btn');
    }
    static get oEditDialogCancelBtn() {
        return $('#random-note-dlg-cancel-btn');
    }

    static get oPanelAddButton() {
        return $('#random-notes-add-btn');
    }
    static get oPanelEditButton() {
        return $('#random-notes-edit-btn');
    }
    static get oPanelRemoveButton() {
        return $('#random-notes-remove-btn');
    }
    static get oPanelReloadButton() {
        return $('#random-notes-reload-btn');
    }

    static get fnComponent() {
        return this.oComponent.datagrid.bind(this.oComponent);
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
            onSubmit: function(){
                return $(this).form('validate');
            },
            success: (function(result){
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
                (function(r) {
                    if (r) {
                        $.post(
                            this.oURLs.delete,
                            { id: oRow.id },
                            (function(result) {
                                this.fnReload();
                            }).bind(this),
                            'json'
                        );
                    }
                }).bind(this)
            );
        }
    }

    static fnGetSelected() {
        return this.fnComponent('getSelected');
    }

    static fnSelect(oTarget) {
        this.fnComponent('select', oTarget);
    }

    static fnBindEvents()
    {
        this.oEditDialogSaveBtn.click((() => {
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
        $(document).trigger(this.oEvents.random_notes_save);
    }

    static fnFireEvent_ItemClick(oRow) {
        $(document).trigger(this.oEvents.random_notes_item_click, [ oRow ]);
    }

    static fnInitComponent()
    {
        this.fnComponent({
            url: this.oURLs.list,

            fit: true,
            singleSelect: true,
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

            onClickRow: ((index, oRow) => {
                this.fnFireEvent_ItemClick(oRow);
            }).bind(this),

            onRowContextMenu: ((oEvent, iIndex, oNode) => {
                oEvent.preventDefault();
                this.oContextMenu.menu(
                    'show', 
                    {
                        left: oEvent.pageX,
                        top: oEvent.pageY,
                        onClick: ((item) => {
                            if (item.id == 'edit') {
                                this.fnShowEditWindow(oNode);
                            }
                            if (item.id == 'delete') {
                                this.fnDelete(oNode);
                            }
                        }).bind(this)
                    }
                );
            }).bind(this),
        })
    }

    static fnPrepare()
    {
        this.fnBindEvents();
        this.fnInitComponent()
    }
}