import { tpl, fnAlertMessage } from "./lib.js"

export class FavNotes {
    static sURL = ``

    static oURLs = {
        create: 'ajax.php?method=create_fav_note',
        update: tpl`ajax.php?method=update_fav_note&id=${0}`,
        create_note: 'ajax.php?method=create_fav_note',
        update_note: tpl`ajax.php?method=update_note&id=${0}`,
        delete: 'ajax.php?method=delete_fav_note',
        list: `ajax.php?method=list_last_fav_notes`,
    }
    static oWindowTitles = {
        create: 'Новое избранное',
        update: 'Редактировать избранное'
    }
    static oEvents = {
        fav_notes_save: "fav_notes:save",
        fav_notes_item_click: "fav_notes:item_click",
        fav_notes_click_add_note: "fav_notes:click_add_note",
        fav_notes_add_note: "fav_notes:add_note",
        fav_notes_remove_note: "fav_notes:remove_note",
        notes_item_click: "notes:item_click",
        notes_create_new_click: "notes:create_new_click",
        notes_edit_click: "notes:edit_click",
        notes_save: "notes:save",
    }

    static get oDialog() {
        return $('#fav-notes-dlg');
    }
    static get oDialogForm() {
        return $('#fav-notes-dlg-fm');
    }
    static get oComponent() {
        return $("#fav-notes-list");
    }
    static get oContextMenu() {
        return $("#fav-notes-mm");
    }

    static get oEditDialogSaveBtn() {
        return $('#fav-notes-dlg-save-btn');
    }
    static get oEditDialogCancelBtn() {
        return $('#fav-notes-dlg-cancel-btn');
    }

    static get oPanelAddButton() {
        return $('#fav-notes-add-btn');
    }
    static get oPanelEditButton() {
        return $('#fav-notes-edit-btn');
    }
    static get oPanelRemoveButton() {
        return $('#fav-notes-remove-btn');
    }
    static get oPanelReloadButton() {
        return $('#fav-notes-reload-btn');
    }


    static get fnComponent() {
        return this.oComponent.datagrid.bind(this.oComponent);
    }

    static fnShowDialog(sTitle) {
        this.oDialog.dialog('open').dialog('center').dialog('setTitle', sTitle);
    }
    static fnDialogFormLoad(oRows={}) {
        this.oDialogForm.form('clear');
        this.oDialogForm.form('load', oRows);
    }

    static fnShowCreateWindow() {
        this.sURL = this.oURLs.create_note;
        var oData = {}
        this.fnShowDialog(this.oWindowTitles.create);
        this.fnDialogFormLoad(oData);
    }

    static fnShowEditWindow(oRow) {
        if (oRow) {
            this.sURL = this.oURLs.update_note(oRow.note_id);
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

    static fnAddNote(oRow) {
        $.ajax({
            url: this.oURLs.create,
            data: { id: oRow.id }
        }).done((() => {
            this.fnReload();
            this.fnFireEvent_AddNote(oRow);
        }).bind(this))
    }

    static fnRemoveNote(oRow) {
        $.ajax({
            url: this.oURLs.delete,
            data: { id: oRow.id }
        }).done((() => {
            this.fnReload();
            this.fnFireEvent_RemoveNote(oRow);
        }).bind(this))
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

        $(document).on(this.oEvents.fav_notes_click_add_note, ((oEvent, oRow) => {
            this.fnAddNote(oRow);
        }).bind(this))
        $(document).on(this.oEvents.fav_notes_click_remove_note, ((oEvent, oRow) => {
            this.fnRemoveNote(oRow);
        }).bind(this))

        this.oEditDialogSaveBtn.click((() => {
            this.fnSave();
        }).bind(this))
        this.oEditDialogCancelBtn.click((() => {
            this.oDialog.dialog('close');
        }).bind(this))

        this.oPanelAddButton.click((() => {
            $(document).trigger(this.oEvents.notes_create_new_click, []);
        }).bind(this))
        this.oPanelEditButton.click((() => {
            $(document).trigger(this.oEvents.notes_edit_click, [this.fnGetSelected().note_id]);
        }).bind(this))
        this.oPanelRemoveButton.click((() => {
            this.fnDelete(this.fnGetSelected());
        }).bind(this))
        this.oPanelReloadButton.click((() => {
            this.fnReload();
        }).bind(this))
    }

    static fnFireEvent_AddNote(oRow) {
        $(document).trigger(this.oEvents.fav_notes_add_note, [oRow]);
    }

    static fnFireEvent_RemoveNote(oRow) {
        $(document).trigger(this.oEvents.fav_notes_remove_note, [oRow]);
    }

    static fnFireEvent_Save() {
        $(document).trigger(this.oEvents.fav_notes_save);
    }

    static fnFireEvent_ItemClick(oRow) {
        $(document).trigger(this.oEvents.fav_notes_item_click, [ oRow.note_id ]);
    }

    static fnInitComponent()
    {
        this.oComponent.datagrid({
            url: this.oURLs.list,

            fit: true,
            columns:[[
                {field:'created_at',title:'Создано',width:100},
                {field:'text',title:'Имя',width:400},
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