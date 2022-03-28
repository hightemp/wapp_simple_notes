import { tpl, fnAlertMessage } from "./lib.js"

export class TablesCategories {
    static sURL = ``

    static oURLs = {
        create: 'ajax.php?method=create_tables_category',
        update: tpl`ajax.php?method=update_tables_category&id=${0}`,
        delete: 'ajax.php?method=delete_tables_category',
        list: `ajax.php?method=list_tree_tables_categories`,
    }
    static oWindowTitles = {
        create: 'Новая категория',
        update: 'Редактировать категорию'
    }
    static oEvents = {
        tables_category_save: 'tables_category:save',
        tables_category_item_click: 'tables_category:item_click',
        tables_category_select: 'tables_category:select',
    }

    static get oDialog() {
        return $('#tables-category-dlg');
    }
    static get oDialogForm() {
        return $('#tables-category-dlg-fm');
    }
    static get oComponent() {
        return $("#tables-categories-tree");
    }
    static get oContextMenu() {
        return $("#tables-category-mm");
    }

    static get oEditDialogSaveBtn() {
        return $('#tables-category-dlg-save-btn');
    }
    static get oEditDialogCancelBtn() {
        return $('#tables-category-dlg-cancel-btn');
    }

    static get oPanelAddButton() {
        return $('#tables-categories-tree-add-btn');
    }
    static get oPanelEditButton() {
        return $('#tables-categories-tree-edit-btn');
    }
    static get oPanelRemoveButton() {
        return $('#tables-categories-tree-remove-btn');
    }
    static get oPanelReloadButton() {
        return $('#tables-categories-tree-reload-btn');
    }


    static get fnComponent() {
        return this.oComponent.tree.bind(this.oComponent);
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
        $(document).trigger(this.oEvents.tables_category_save);
    }

    static fnFireEvent_ItemClick(oRow) {
        $(document).trigger(this.oEvents.tables_category_item_click, [ oRow ]);
    }

    static fnFireEvent_Select(oRow) {
        $(document).trigger(this.oEvents.tables_category_select, [ oRow ]);
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
        this.fnInitComponent();
    }
}