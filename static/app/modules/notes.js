import { tpl, fnAlertMessage } from "./lib.js"
import { CategoriesNotes } from "./notes-categories.js"

export class Notes {
    static sURL = ``

    static oURLs = {
        create: 'ajax.php?method=create_note',
        update: tpl`ajax.php?method=update_note&id=${0}`,
        delete: 'ajax.php?method=delete_note',
        list: tpl`ajax.php?method=list_notes&category_id=${0}`,
        list_tags: 'ajax.php?method=list_tags',
        get_note: 'ajax.php?method=get_note',
    }
    static oWindowTitles = {
        create: 'Новая заметка',
        update: 'Редактировать заметку'
    }
    static oEvents = {
        categories_select: "categories:select",
        notes_create_new_click: "notes:create_new_click",
        notes_edit_click: "notes:edit_click",
        notes_save: "notes:save",
        notes_item_click: "notes:item_click",
        fav_notes_click_add_note: "fav_notes:click_add_note",
        fav_notes_click_remove_note: "fav_notes:click_remove_note",
    }

    static get oDialog() {
        return $('#note-dlg');
    }
    static get oDialogForm() {
        return $('#note-dlg-fm');
    }
    static get oComponent() {
        return $("#notes-list");
    }
    static get oContextMenu() {
        return $("#note-mm");
    }

    static get oCategoryIDComboTree() {
        return $('#category-dlg-category_id-combotree');
    }
    static get oNoteCategoryIDComboTree() {
        return $('#note-dlg-category_id-combotree');
    }
    static get oTagsTagBox() {
        return $('#note-tags-box');
    }

    static get oEditDialogSaveBtn() {
        return $('#note-dlg-save-btn');
    }
    static get oEditDialogCancelBtn() {
        return $('#note-dlg-cancel-btn');
    }

    static get oPanelAddButton() {
        return $('#notes-add-note-btn');
    }
    static get oPanelEditButton() {
        return $('#notes-edit-note-btn');
    }
    static get oPanelRemoveButton() {
        return $('#notes-remove-note-btn');
    }
    static get oPanelReloadButton() {
        return $('#notes-reload-note-btn');
    }

    static get fnComponent() {
        return this.oComponent.datalist.bind(this.oComponent);
    }

    static get oSelectedCategory() {
        return CategoriesNotes.oSelected;
    }

    static fnShowDialog(sTitle) {
        this.oDialog.dialog('open').dialog('center').dialog('setTitle', sTitle);
    }
    static fnDialogFormLoad(oRows={}) {
        this.oCategoryIDComboTree.combotree('reload');
        this.oNoteCategoryIDComboTree.combotree('reload');
        this.oTagsTagBox.tagbox('reload');
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
            queryParams: {
                'tags_list': this.oTagsTagBox.tagbox('getValues').join(',')
            },
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
        $(document).on(this.oEvents.categories_select, ((oEvent, oItem) => {
            console.log([oItem]);
            this.fnInitComponent(oItem.id);
        }).bind(this))

        $(document).on(this.oEvents.notes_edit_click, ((oEvent, iID) => {
            $.post(
                this.oURLs.get_note,
                { id: iID },
                ((oR) => {
                    this.fnShowEditWindow(oR);
                }).bind(this),
                'json'
            );
        }).bind(this))
        $(document).on(this.oEvents.notes_create_new_click, ((oEvent) => {
            this.fnShowCreateWindow();
        }).bind(this))


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
        $(document).trigger(this.oEvents.notes_save);
    }

    static fnFireEvent_ItemClick(oRow) {
        $(document).trigger(this.oEvents.notes_item_click, [ oRow.id ]);
    }

    static fnFireEvent_FavAddItemClick(oRow) {
        $(document).trigger(this.oEvents.fav_notes_click_add_note, [ oRow ]);
    }

    static fnFireEvent_FavRemoveItemClick(oRow) {
        $(document).trigger(this.oEvents.fav_notes_click_remove_note, [ oRow ]);
    }

    static fnInitComponent(iCategoryID)
    {
        this.oTagsTagBox.tagbox({
            url: this.oURLs.list_tags,
            method: 'get',
            value: [],
            valueField: 'text',
            textField: 'text',
            limitToList: false,
            hasDownArrow: true,
            prompt: 'Тэги'
        });

        this.fnComponent({
            url: this.oURLs.list(iCategoryID),

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
                            if (item.id == 'add_to_fav') {
                                this.fnFireEvent_FavAddItemClick(oNode);
                            }
                            if (item.id == 'remove_from_fav') {
                                this.fnFireEvent_FavRemoveItemClick(oNode);
                            }
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
    }
}