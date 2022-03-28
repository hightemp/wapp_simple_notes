import { tpl, fnAlertMessage } from "./lib.js"

export class Tags {
    static sURL = ``

    static oURLs = {
        create: 'ajax.php?method=create_tag',
        update: tpl`ajax.php?method=update_tag&id=${0}`,
        delete: 'ajax.php?method=delete_tag',
        list: `ajax.php?method=list_tags`,
    }
    static oWindowTitles = {
        create: 'Новая заметка',
        update: 'Редактировать заметку'
    }
    static oEvents = {
        tags_save: "tags:save",
        tags_item_click: "tags:item_click",
        categories_select: "categories:select",
        notes_create_new_click: "notes:create_new_click",
        notes_edit_click: "notes:edit_click",
        notes_save: "notes:save",
        notes_item_click: "notes:item_click",
        fav_notes_add_note: "fav_notes:add_note",
        fav_notes_remove_note: "fav_notes:remove_note",
    }

    static get oDialog() {
        return $('#tags-dlg');
    }
    static get oDialogForm() {
        return $('#tags-dlg-fm');
    }
    static get oComponent() {
        return $("#tags-list");
    }
    static get oContextMenu() {
        return $("#tags-mm");
    }

    static get oEditDialogSaveBtn() {
        return $('#tags-dlg-save-btn');
    }
    static get oEditDialogCancelBtn() {
        return $('#tags-dlg-cancel-btn');
    }

    static get oPanelAddButton() {
        return $('#tags-add-btn');
    }
    static get oPanelEditButton() {
        return $('#tags-edit-btn');
    }
    static get oPanelRemoveButton() {
        return $('#tags-remove-btn');
    }
    static get oPanelReloadButton() {
        return $('#tags-reload-btn');
    }

    static get fnComponent() {
        return this.oComponent.datalist.bind(this.oComponent);
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

        if (this.oSelectedCategory && this.oSelectedCategory.id) {
            oData = {
                category_id: this.oSelectedCategory.id,
                category: this.oSelectedCategory.text
            }
        }

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
        $(document).trigger(this.oEvents.tags_save);
    }

    static fnFireEvent_ItemClick(oRow) {
        $(document).trigger(this.oEvents.tags_item_click, [ oRow ]);
    }

    static fnInitComponent()
    {
        this.fnComponent({
            url: this.oURLs.list,

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