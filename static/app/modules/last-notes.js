import { tpl, fnAlertMessage } from "./lib.js"

export class LastNotes {
    static sURL = ``

    static oURLs = {
        create: 'ajax.php?method=create_note',
        update: tpl`ajax.php?method=update_note&id=${0}`,
        delete: 'ajax.php?method=delete_note',
        list: `ajax.php?method=list_last_notes`,
    }
    static oWindowTitles = {
        create: 'Новая заметка',
        update: 'Редактировать заметку'
    }
    static oEvents = {
        notes_save: "notes:save",
        notes_item_click: "notes:item_click",
    }

    static get oComponent() {
        return $("#last-notes-list");
    }
    static get oContextMenu() {
        return $("#note-mm");
    }

    static get oPanelAddButton() {
        return $('#last-notes-add-btn');
    }
    static get oPanelEditButton() {
        return $('#last-notes-edit-btn');
    }
    static get oPanelRemoveButton() {
        return $('#last-notes-remove-btn');
    }
    static get oPanelReloadButton() {
        return $('#last-notes-reload-btn');
    }


    static get fnComponent() {
        return this.oComponent.datagrid.bind(this.oComponent);
    }

    // static fnShowDialog(sTitle) {
    //     this.oDialog.dialog('open').dialog('center').dialog('setTitle', sTitle);
    // }
    // static fnDialogFormLoad(oRows={}) {
    //     this.oDialogForm.form('clear');
    //     this.oDialogForm.form('load', oRows);
    // }

    // static fnShowCreateWindow() {
    //     this.sURL = this.oURLs.create;
    //     var oData = {}
    //     this.fnShowDialog(this.oWindowTitles.create);
    //     this.fnDialogFormLoad(oData);
    // }

    // static fnShowEditWindow(oRow) {
    //     if (oRow) {
    //         this.sURL = this.oURLs.update(oRow.id);
    //         this.fnShowDialog(this.oWindowTitles.update);
    //         this.fnDialogFormLoad(oRow);
    //     }
    // }

    static fnReload() {
        this.fnComponent('reload');
    }

    // static fnSave() {
    //     this.oDialogForm.form('submit', {
    //         url: this.sURL,
    //         iframe: false,
    //         onSubmit: function(){
    //             return $(this).form('validate');
    //         },
    //         success: (function(result){
    //             this.oDialog.dialog('close');
    //             this.fnReload();

    //             this.fnFireEvent_Save();
    //         }).bind(this)
    //     });
    // }

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
        $(document).on(this.oEvents.notes_save, ((oEvent, oItem) => {
            this.fnReload();
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
        $(document).trigger(this.oEvents.notes_save);
    }

    static fnFireEvent_ItemClick(oRow) {
        $(document).trigger(this.oEvents.notes_item_click, [ oRow ]);
    }

    static fnInitComponent()
    {
        this.oComponent.datagrid({
            url: this.oURLs.list,

            fit: true,
            columns:[[
                {field:'created_at',title:'Создано',width:100},
                {field:'text',title:'Название',width:400},
            ]],
            singleSelect: true,

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
        this.fnInitComponent();
    }
}