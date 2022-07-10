import { tpl, fnAlertMessage } from "./lib.js"

export class TagsChildrenList {
    static sURL = ``

    static _oSelectedTag = null;
    static _bPressedCtrlKey = false;

    static oURLs = {
        create: 'ajax.php?method=create_tag_children',
        update: tpl`ajax.php?method=update_tag_children&id=${0}`,
        delete: 'ajax.php?method=delete_tag_children',
        list: tpl`ajax.php?method=list_tag_children&tag_id=${0}`,
        list_tag_children: 'ajax.php?method=list_tag_children',
        get_tag_children: 'ajax.php?method=get_tag_children',
    }
    static oWindowTitles = {
        create: 'Новая',
        update: 'Редактировать'
    }
    static oEvents = {
        categories_select: "categories:select",

        tag_children_create_new_click: "tag_children:create_new_click",
        tag_children_edit_click: "tag_children:edit_click",
        tag_children_delete_click: "tag_children:delete_click",
        tag_children_reload_click: "tag_children:reload_click",
        tag_children_save: "tag_children:save",
        tag_children_create: "tag_children:create",
        tag_children_item_click: "tag_children:item_click",
        tag_children_item_dblclick: "tag_children:item_dblclick",
        tag_children_init: "tag_children:init",

        tags_item_click: "tags:item_click",
        tags_item_dblclick: "tags:item_dblclick",
    }

    static get oDialog() {
        return $('#tag-children-dlg');
    }
    static get oDialogForm() {
        return $('#tag-children-dlg-fm');
    }
    static get oComponent() {
        return $("#tag-children-list");
    }
    static get oContextMenu() {
        return $("#tag-children-mm");
    }

    static get oNoteCategoryIDComboTree() {
        return $('#tag-children-dlg-category_id-combotree');
    }
    static get oTagsTagBox() {
        return $('#tag-children-tag-children-box');
    }

    static get oEditDialogCategoryCleanBtn() {
        return $('#tag-children-category-clean-btn');
    }
    static get oEditDialogSaveBtn() {
        return $('#tag-children-dlg-save-btn');
    }
    static get oEditDialogCancelBtn() {
        return $('#tag-children-dlg-cancel-btn');
    }

    static get oPanelAddButton() {
        return $('#tag-children-add-btn');
    }
    static get oPanelPageAddButton() {
        return $('#tag-children-page-add-btn');
    }
    static get oPanelEditButton() {
        return $('#tag-children-edit-btn');
    }
    static get oPanelRemoveButton() {
        return $('#tag-children-remove-btn');
    }
    static get oPanelReloadButton() {
        return $('#tag-children-reload-btn');
    }

    static get fnComponent() {
        return this.oComponent.datagrid.bind(this.oComponent);
    }

    static fnShowDialog(sTitle) {
        this.oDialog.dialog('open').dialog('center').dialog('setTitle', sTitle);
    }
    static fnDialogFormLoad(oRows={}) {
        this.oNoteCategoryIDComboTree.combotree('reload');
        this.oTagsTagBox.tagbox('reload');
        this.oDialogForm.form('clear');
        this.oDialogForm.form('load', oRows);
    }

    static fnShowCreateWindow() {
        this.sURL = this.oURLs.create;
        var oData = {}

        if (this._oSelectedTag && this._oSelectedTag.id) {
            oData = {
                tag_id: this._oSelectedTag ? this._oSelectedTag.id : null,
            }
        }

        this.fnShowDialog(this.oWindowTitles.create);
        this.fnDialogFormLoad(oData);
        this.oTagsTagBox.tagbox('setValues', []);
    }

    static fnShowEditWindow(oRow) {
        this.sURL = this.oURLs.update(oRow.id);
        this.fnShowDialog(this.oWindowTitles.update);
        this.fnDialogFormLoad(oRow);
        if (!oRow.tags) {
            this.oTagsTagBox.tagbox('setValues', []);
        }
    }

    static fnReload() {
        this.fnComponent('reload');
    }

    static fnSave() {
        this.oDialogForm.form('submit', {
            url: this.sURL,
            queryParams: {
                tag_id: this._oSelectedTag ? this._oSelectedTag.id : null,
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

    static fnGetSelected() {
        return this.fnComponent('getSelected');
    }

    static fnSelect(oTarget) {
        this.fnComponent('select', oTarget);
    }

    static fnBindEvents()
    {
        $(document).on('keydown', (oEvent => {
            this._bPressedCtrlKey = oEvent.ctrlKey;
        }).bind(this));


        $(document).on(this.oEvents.tags_item_click, ((oEvent, oItem) => {
            this._oSelectedTag = oItem;
            this.fnInitComponent(oItem.id);
        }).bind(this))

        $(document).on(this.oEvents.tag_children_edit_click, ((oEvent, iID) => {
            // this.oTagsTagBox.tagbox('reload');
            $.post(
                this.oURLs.get_tag_children,
                { id: iID },
                ((oR) => {
                    this.fnShowEditWindow(oR);
                }).bind(this),
                'json'
            );
        }).bind(this))
        $(document).on(this.oEvents.tag_children_delete_click, ((oEvent, iID) => {
            $.messager.confirm(
                'Confirm',
                'Удалить?',
                (function(r) {
                    if (r) {
                        $.post(
                            this.oURLs.delete,
                            { id: iID },
                            (function(result) {
                                this.fnReload();
                            }).bind(this),
                            'json'
                        );
                    }
                }).bind(this)
            );
        }).bind(this))
        $(document).on(this.oEvents.tag_children_create_new_click, ((oEvent) => {
            this.fnShowCreateWindow();
        }).bind(this))

        this.oEditDialogCategoryCleanBtn.click((() => {
            this.oHTMLNoteNoteCategoryIDComboTree.combotree('clear');
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
        this.oPanelPageAddButton.click((() => {
            
        }).bind(this))
        this.oPanelEditButton.click((() => {
            this.fnShowEditWindow(this.fnGetSelected());
        }).bind(this))
        this.oPanelRemoveButton.click((() => {
            this.fnFireEvent_ItemDeleteClick(this.fnGetSelected());
        }).bind(this))
        this.oPanelReloadButton.click((() => {
            this.fnReload();
        }).bind(this))
    }

    static fnFireEvent_Save() {
        $(document).trigger(this.oEvents.tag_children_save);
    }

    static fnFireEvent_ItemClick(oRow) {
        $(document).trigger(this.oEvents.tag_children_item_click, [ oRow ]);
    }

    static fnFireEvent_ItemDblClick(oRow) {
        $(document).trigger(this.oEvents.tag_children_item_dblclick, [ oRow ]);
    }

    static fnFireEvent_ItemDeleteClick(oRow) {
        $(document).trigger(this.oEvents.tag_children_delete_click, [ oRow.id ]);
    }

    static fnInitComponent(iTagID)
    {
        this.fnComponent({
            url: this.oURLs.list(iTagID),

            border: false,
            singleSelect:true,

            nowrap: false,

            idField:'id',
            treeField:'name',
            columns:[[
                {
                    title:'Название',field:'name',width:180,
                    formatter: function(value,row,index) {
                        var s = row.name;

                        if (row.count_tags) {
                            s += `&nbsp;<br><span style=\'color:blue\'>тэгов: ${row.count_tags}</span>&nbsp;<span style=\'color:green\'>заметок: ${row.count_notes}</span>`;
                        }
                        return s;
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
                                this.fnFireEvent_ItemDeleteClick(oNode);
                            }
                        }).bind(this)
                    }
                );
            }).bind(this),
        })

        this.fnComponent('enableFilter', []);
    }

    static fnInit()
    {
        this.fnBindEvents();
        // this.fnInitComponent();

        $(document).trigger(this.oEvents.tag_children_init);
    }
}

TagsChildrenList.fnInit();