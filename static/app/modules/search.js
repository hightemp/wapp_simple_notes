import { T_NOTES, T_TABLES } from "./_constants.js";
import { tpl, fnAlertMessage } from "./lib.js"

export class Search {
    static sURL = ``
    static _sSearchQuery = ``
    static _sSearchType = ``

    static _bPressedCtrlKey = false;

    static oURLs = {
        list: tpl`ajax.php?method=search&query=${0}&type=${1}`,
    }
    static oWindowTitles = {
        create: 'Новый поиск',
        update: 'Редактировать'
    }
    static oEvents = {
        search_save: "search:save",
        search_item_click: "search:item_click",
        search_select: "search:select",
        search_init: "search:init",

        notes_edit_click: "notes:edit_click",
        tables_edit_click: "tables:edit_click",
        
        notes_item_click: "notes:item_click",
        tables_item_click: "tables:item_click",

        notes_delete_click: "notes:delete_click",
        tables_delete_click: "tables:delete_click",

        notes_preview_click: "notes_preview_click",
        notes_tiny_edit_click: "notes_tiny_edit_click",
        notes_simple_edit_click: "notes_simple_edit_click",
    }

    static get oDialog() {
        return $('#search-dlg');
    }
    static get oDialogForm() {
        return $('#search-dlg-fm');
    }
    static get oComponent() {
        return $("#search-list");
    }
    static get oContextMenu() {
        return $("#search-mm");
    }

    static get oSearchTextbox() {
        return $("#search-fitler-textbox");
    }
    static get oClearBtn() {
        return $("#clear-btn");
    }
    static get oSearchBtn() {
        return $("#search-btn");
    }
    static get oSearchTypeCombo() {
        return $("#search-fitler-type");
    }

    static get oEditDialogSaveBtn() {
        return $('#search-dlg-save-btn');
    }
    static get oEditDialogCancelBtn() {
        return $('#search-dlg-cancel-btn');
    }

    static get oPanelAddButton() {
        return $('#search-list-add-btn');
    }
    static get oPanelEditButton() {
        return $('#search-list-edit-btn');
    }
    static get oPanelRemoveButton() {
        return $('#search-list-remove-btn');
    }
    static get oPanelReloadButton() {
        return $('#search-list-reload-btn');
    }


    static get fnComponent() {
        return this.oComponent.datagrid.bind(this.oComponent);
    }

    static fnReload() {
        this.fnComponent('reload');
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

        this.oPanelReloadButton.click((() => {
            this.fnReload();
        }).bind(this))
    }

    static fnFireEvent_Save() {
        $(document).trigger(this.oEvents.search_save);
    }

    // static fnFireEvent_ItemClick(oRow) {
    //     $(document).trigger(this.oEvents.search_item_click, [ oRow ]);
    // }

    static fnFireEvent_Select(oRow) {
        $(document).trigger(this.oEvents.search_select, [ oRow ]);
    }

    static fnFireEvent_ItemEditClick(oRow) {
        $(document).trigger(this.oEvents.notes_edit_click, [ oRow.id ]);
    }

    static fnFireEvent_ItemClick(oRow) {
        $(document).trigger(this.oEvents.notes_item_click, [ oRow ]);
    }

    static fnFireEvent_ItemDeleteClick(oRow) {
        $(document).trigger(this.oEvents.notes_delete_click, [ oRow.id ]);
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

    static fnInitButtons()
    {
        this.oClearBtn.linkbutton({
            onClick: (() => {
                this.oSearchTextbox.textbox('setValue', '');
            }).bind(this)
        });

        this.oSearchBtn.linkbutton({
            iconCls: 'icon-search',
            onClick: (() => {
                this._sSearchQuery = this.oSearchTextbox.textbox('getValue');
                this._sSearchType = this.oSearchTypeCombo.combobox('getValue');
                this.fnComponent('reload', this.oURLs.list(this._sSearchQuery, this._sSearchType));
            }).bind(this)
        });
    }

    static fnInitComponent()
    {
        this.fnComponent({
            url: 'ajax.php', // this.oURLs.list(this._sSearchQuery),

            fit: true,
            fitColumns:true,
            method:'get',
            animate:true,
            lines:true,
            dnd:true,
            nowrap:false,

            singleSelect: true,

            height: "100%",

            columns:[[
                {field:'created_at',title:'Создано',width:100},
                {field:'category',title:'Категория',width:100},
                {field:'name',title:'Название',width:200},
                {field:'tags',title:'Тэги',width:100}
            ]],

            onSelect: ((iIndex, oNode) => {
                this._oSelected = oNode;
                if (!oNode.is_broken) {
                    this.fnFireEvent_ItemClick(oNode);
                }
            }).bind(this),

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

            onRowContextMenu: (function(oEvent, index, oNode) {
                oEvent.preventDefault();
                // this.fnSelect(node.target);
                this.oContextMenu.menu('show', {
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

                        if (item.id == 'edit') {
                            this.fnFireEvent_ItemEditClick(oNode);
                        }
                        if (item.id == 'delete') {
                            this.fnFireEvent_ItemDeleteClick(oNode);
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

    static fnInit()
    {
        this.fnBindEvents();
        this.fnInitButtons();
        this.fnInitComponent();

        $(document).trigger(this.oEvents.search_init);
    }
}

Search.fnInit();