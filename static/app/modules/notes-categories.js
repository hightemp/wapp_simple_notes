import { tpl, fnAlertMessage } from "./lib.js"

export class CategoriesNotes {
    static sURL = ``

    static _oSelected = null;
    
    static oURLs = {
        create: 'ajax.php?method=create_category',
        update: tpl`ajax.php?method=update_category&id=${0}`,
        delete: 'ajax.php?method=delete_category',
        list: `ajax.php?method=list_tree_categories`,
    }
    static oWindowTitles = {
        create: 'Новая категория',
        update: 'Редактировать категория'
    }
    static oEvents = {
        categories_save: "categories:save",
        categories_select: "categories:select",
    }

    static get oDialog() {
        return $('#category-dlg');
    }
    static get oDialogForm() {
        return $('#category-dlg-fm');
    }
    static get oComponent() {
        return $("#categories-tree");
    }
    static get oContextMenu() {
        return $("#category-select-mm");
    }

    static get oEditDialogSaveBtn() {
        return $('#category-dlg-save-btn');
    }
    static get oEditDialogCancelBtn() {
        return $('#category-dlg-cancel-btn');
    }

    static get oPanelAddButton() {
        return $('#notes-add-category-btn');
    }
    static get oPanelEditButton() {
        return $('#notes-edit-category-btn');
    }
    static get oPanelRemoveButton() {
        return $('#notes-remove-category-btn');
    }
    static get oPanelReloadButton() {
        return $('#notes-reload-category-btn');
    }

    static get fnComponent() {
        return this.oComponent.tree.bind(this.oComponent);
    }

    static get oSelectedCategory() {
        return this._oSelected;
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
                                console.log('test');
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
        $(document).trigger(this.oEvents.categories_save);
    }

    static fnFireEvent_Select(oNode) {
        $(document).trigger(this.oEvents.categories_select, [oNode])
    }

    static fnInitComponent()
    {
        this.fnComponent({
            url: this.oURLs.list,
            method:'get',
            animate:true,
            lines:true,
            dnd:true,
            onSelect: ((oNode) => {
                this._oSelected = oNode;
                this.fnFireEvent_Select(oNode);
            }).bind(this),
            onContextMenu: (function(oEvent, node) {
                oEvent.preventDefault();
                this.fnSelect(node.target);
                this.oContextMenu.menu('show', {
                    left: e.pageX,
                    top: e.pageY,
                    onClick: ((item) => {
                        if (item.id == 'create_category') {
                            this.fnShowCreateWindow();
                        }
                        if (item.id == 'create_note') {
                            this.fnCreateNote();
                        }
                        if (item.id == 'edit') {
                            this.fnShowEditWindow(node);
                        }
                        if (item.id == 'delete') {
                            this.fnDelete(node);
                        }
                    }).bind(this)
                });
            }).bind(this),
            formatter: function(node) {
                var s = node.text;
                if (node.children){
                    s += '&nbsp;<span style=\'color:blue\'>(' + node.notes_count + ')</span>';
                }
                return s;
            }
        })
    }

    static fnPrepare()
    {
        this.fnBindEvents();
        this.fnInitComponent()
    }
}