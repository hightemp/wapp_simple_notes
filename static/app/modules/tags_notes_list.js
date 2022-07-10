import { tpl, fnAlertMessage } from "./lib.js"

export class TagsNotesList {
    static sURL = ``

    static _oSelectedTag = null;
    static _bPressedCtrlKey = false;

    static oURLs = {
        create: 'ajax.php?method=create_note',
        update: tpl`ajax.php?method=update_note&id=${0}`,
        delete: 'ajax.php?method=delete_note',
        list: tpl`ajax.php?method=list_tags_notes&tag_id=${0}`,
        list_tags: 'ajax.php?method=list_tags_notes',
        get_note: 'ajax.php?method=get_note',
    }
    static oWindowTitles = {
        create: 'Новая заметка',
        update: 'Редактировать заметку'
    }
    static oEvents = {
        categories_select: "categories:select",

        tags_create_new_click: "tags:create_new_click",
        tags_edit_click: "tags:edit_click",
        tags_delete_click: "tags:delete_click",
        tags_reload_click: "tags:reload_click",
        tags_save: "tags:save",
        tags_create: "tags:create",
        tags_init: "tags:init",

        notes_item_click: "notes:item_click",
        notes_item_dblclick: "notes:item_dblclick",
        notes_preview_click: "notes_preview_click",
        notes_tiny_edit_click: "notes_tiny_edit_click",
        notes_simple_edit_click: "notes_simple_edit_click",

        tag_children_item_click: "tag_children:item_click",

        fav_tags_click_add_tag: "fav_tags:click_add_tag",
        fav_tags_click_remove_tag: "fav_tags:click_remove_tag",

        tags_item_click: "tags:item_click",
    }

    static get oDialog() {
        return $('#tags-notes-dlg');
    }
    static get oDialogForm() {
        return $('#tags-notes-dlg-fm');
    }
    static get oComponent() {
        return $("#tags-notes-list");
    }
    static get oContextMenu() {
        return $("#tags-notes-mm");
    }

    static get oNoteCategoryIDComboTree() {
        return $('#tags-notes-dlg-category_id-combotree');
    }
    static get oTagsTagBox() {
        return $('#tags-notes-box');
    }

    static get oEditDialogCategoryCleanBtn() {
        return $('#tags-notes-category-clean-btn');
    }
    static get oEditDialogSaveBtn() {
        return $('#tags-notes-dlg-save-btn');
    }
    static get oEditDialogCancelBtn() {
        return $('#tags-notes-dlg-cancel-btn');
    }

    static get oPanelAddButton() {
        return $('#tags-notes-add-btn');
    }
    static get oPanelPageAddButton() {
        return $('#tags-notes-page-add-btn');
    }
    static get oPanelEditButton() {
        return $('#tags-notes-edit-btn');
    }
    static get oPanelRemoveButton() {
        return $('#tags-notes-remove-btn');
    }
    static get oPanelReloadButton() {
        return $('#tags-notes-reload-btn');
    }

    static get fnComponent() {
        return this.oComponent.datagrid.bind(this.oComponent);
    }

    static fnShowDialog(sTitle) {
        this.oDialog.dialog('open').dialog('center').dialog('setTitle', sTitle);
    }
    static fnDialogFormLoad(oRows={}) {
        this.oNoteCategoryIDComboTree.combotree('reload');
        // if (this._oSelectedTag) {
        //     this.oNoteCategoryIDComboTree.combotree('setValue', this._oSelectedTag.id);
        // }
        this.oTagsTagBox.tagbox('reload');
        this.oDialogForm.form('clear');
        this.oDialogForm.form('load', oRows);
    }

    static fnShowCreateWindow() {
        this.sURL = this.oURLs.create;
        var oData = {}

        if (this._oSelectedTag && this._oSelectedTag.id) {
            oData = {
                category_id: this._oSelectedTag ? this._oSelectedTag.id : null,
                category: this._oSelectedTag ? this._oSelectedTag.text : ""
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

        $(document).on(this.oEvents.tag_children_item_click, ((oEvent, oItem) => {
            this._oSelectedTag = oItem;
            this.fnInitComponent(oItem.id);
        }).bind(this))

        $(document).on(this.oEvents.tags_item_click, ((oEvent, oItem) => {
            this._oSelectedTag = oItem;
            this.fnInitComponent(oItem.id);
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

    static fnFireEvent_PreviewClick(oRow) {
        $(document).trigger(this.oEvents.notes_preview_click, [ oRow ]);
    }

    static fnFireEvent_TinyEditClick(oRow) {
        $(document).trigger(this.oEvents.notes_tiny_edit_click, [ oRow ]);
    }

    static fnFireEvent_SimpleEditClick(oRow) {
        $(document).trigger(this.oEvents.notes_simple_edit_click, [ oRow ]);
    }

    static fnFireEvent_ItemClick(oRow) {
        $(document).trigger(this.oEvents.notes_item_click, [ oRow ]);
    }

    static fnFireEvent_ItemDblClick(oRow) {
        $(document).trigger(this.oEvents.notes_item_dblclick, [ oRow ]);
    }

    static fnFireEvent_ItemDeleteClick(oRow) {
        $(document).trigger(this.oEvents.tags_delete_click, [ oRow.id ]);
    }

    static fnFireEvent_FavAddItemClick(oRow) {
        $(document).trigger(this.oEvents.fav_tags_click_add_tag, [ oRow ]);
    }

    static fnFireEvent_FavRemoveItemClick(oRow) {
        $(document).trigger(this.oEvents.fav_tags_click_remove_tag, [ oRow ]);
    }

    static fnInitCombo(iCategoryID)
    {
        this.oNoteCategoryIDComboTree.combotree({
            fit: true,

            url: `ajax.php?method=list_tree_categories`,
            idField:'id',
            treeField:'name',
        })
    }

    static fnInitComponentTagBox(iCategoryID)
    {
        this.oTagsTagBox.tagbox({
            url: this.oURLs.list_tags,
            method: 'get',
            value: [],
            valueField: 'name',
            textField: 'name',
            limitToList: false,
            hasDownArrow: true,
            prompt: 'Тэги'
        });
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
                    title:'Название',field:'name',width:280
                },
            ]],

            onClickRow: ((index, oRow) => {
                this.fnFireEvent_PreviewClick(oRow);
            }).bind(this),

            onDblClickRow: ((index, oRow) => {
                if (this._bPressedCtrlKey) {
                    this.fnFireEvent_SimpleEditClick(oRow);
                } else {
                    this.fnFireEvent_TinyEditClick(oRow);
                }
            }).bind(this),

            onRowContextMenu: ((oEvent, iIndex, oNode) => {
                oEvent.preventDefault();
                this.oContextMenu.menu(
                    'show', 
                    {
                        left: oEvent.pageX,
                        top: oEvent.pageY,
                        onClick: ((item) => {
                            if (item.id == 'preview') {
                                this.fnFireEvent_PreviewClick(oNode);
                            }
                            if (item.id == 'edit_with_tiny') {
                                this.fnFireEvent_TinyEditClick(oNode);
                            }
                            if (item.id == 'edit_with_simple_editor') {
                                this.fnFireEvent_SimpleEditClick(oNode);
                            }

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
        this.fnInitCombo();
        this.fnInitComponentTagBox();
        // this.fnInitComponent();

        $(document).trigger(this.oEvents.tags_init);
    }
}

TagsNotesList.fnInit();