import { tpl, fnAlertMessage } from "./lib.js"

export class TagsList {
    static sURL = ``

    static _oSelectedCategory = null;
    static _bPressedCtrlKey = false;

    static oURLs = {
        create: 'ajax.php?method=create_tag',
        update: tpl`ajax.php?method=update_tag&id=${0}`,
        delete: 'ajax.php?method=delete_tag',
        list: `ajax.php?method=list_tags`,
        get_tag: 'ajax.php?method=get_tag',
    }
    static oWindowTitles = {
        create: 'Новая',
        update: 'Редактировать'
    }
    static oEvents = {
        categories_select: "categories:select",

        tags_create_new_click: "tags:create_new_click",
        tags_edit_click: "tags:edit_click",
        tags_delete_click: "tags:delete_click",
        tags_reload_click: "tags:reload_click",
        tags_save: "tags:save",
        tags_create: "tags:create",
        tags_item_click: "tags:item_click",
        tags_item_dblclick: "tags:item_dblclick",
        tags_init: "tags:init",
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

    static get oNoteCategoryIDComboTree() {
        return $('#tags-dlg-category_id-combotree');
    }
    static get oTagsTagBox() {
        return $('#tags-tags-box');
    }

    static get oEditDialogCategoryCleanBtn() {
        return $('#tags-category-clean-btn');
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
    static get oPanelPageAddButton() {
        return $('#tags-page-add-btn');
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
        return this.oComponent.datagrid.bind(this.oComponent);
    }

    static fnShowDialog(sTitle) {
        this.oDialog.dialog('open').dialog('center').dialog('setTitle', sTitle);
    }
    static fnDialogFormLoad(oRows={}) {
        this.oNoteCategoryIDComboTree.combotree('reload');
        // if (this._oSelectedCategory) {
        //     this.oNoteCategoryIDComboTree.combotree('setValue', this._oSelectedCategory.id);
        // }
        this.oTagsTagBox.tagbox('reload');
        this.oDialogForm.form('clear');
        this.oDialogForm.form('load', oRows);
    }

    static fnShowCreateWindow() {
        this.sURL = this.oURLs.create;
        var oData = {}

        if (this._oSelectedCategory && this._oSelectedCategory.id) {
            oData = {
                category_id: this._oSelectedCategory ? this._oSelectedCategory.id : null,
                category: this._oSelectedCategory ? this._oSelectedCategory.text : ""
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

    static fnGetSelected() {
        return this.fnComponent('getSelected');
    }

    static fnSelect(oTarget) {
        this.fnComponent('select', oTarget);
    }

    static fnUploadHTMLFile() {
        $.post(
            this.oURLs.upload_html_file,
            { id: iID },
            ((oR) => {
                
            }).bind(this),
            'json'
        );
    }

    static fnBindEvents()
    {
        $(document).on('keydown', (oEvent => {
            this._bPressedCtrlKey = oEvent.ctrlKey;
        }).bind(this));

        $(document).on(this.oEvents.tags_edit_click, ((oEvent, iID) => {
            // this.oTagsTagBox.tagbox('reload');
            $.post(
                this.oURLs.get_tag,
                { id: iID },
                ((oR) => {
                    this.fnShowEditWindow(oR);
                }).bind(this),
                'json'
            );
        }).bind(this))
        $(document).on(this.oEvents.tags_delete_click, ((oEvent, iID) => {
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
        $(document).on(this.oEvents.tags_create_new_click, ((oEvent) => {
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
        $(document).trigger(this.oEvents.tags_save);
    }

    static fnFireEvent_ItemClick(oRow) {
        $(document).trigger(this.oEvents.tags_item_click, [ oRow ]);
    }

    static fnFireEvent_ItemDblClick(oRow) {
        $(document).trigger(this.oEvents.tags_item_dblclick, [ oRow ]);
    }

    static fnFireEvent_ItemDeleteClick(oRow) {
        $(document).trigger(this.oEvents.tags_delete_click, [ oRow.id ]);
    }

    static fnInitComponent()
    {
        this.fnComponent({
            url: this.oURLs.list,

            border: false,
            singleSelect:true,

            nowrap: false,

            idField:'id',
            treeField:'name',
            columns:[[
                {
                    title:'Название',field:'name',width:375
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

        // this.fnComponent('enableFilter', []);
    }

    static fnInit()
    {
        this.fnBindEvents();
        this.fnInitComponent();

        $(document).trigger(this.oEvents.tags_init);
    }
}

TagsList.fnInit();