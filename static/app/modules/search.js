import { T_NOTES, T_TABLES } from "./_constants.js";
import { tpl, fnAlertMessage } from "./lib.js"

export class SearchList {
    static sURL = ``
    static _sSearchQuery = ``

    static oURLs = {
        list: tpl`ajax.php?method=search&query=${0}`,
    }
    static oWindowTitles = {
        create: 'Новый поиск',
        update: 'Редактировать'
    }
    static oEvents = {
        search_save: "search:save",
        search_item_click: "search:item_click",
        search_select: "search:select",

        notes_edit_click: "notes:edit_click",
        tables_edit_click: "tables:edit_click",
        
        notes_item_click: "notes:item_click",
        tables_item_click: "tables:item_click",

        notes_delete_click: "notes:delete_click",
        tables_delete_click: "tables:delete_click",
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
        this.oPanelReloadButton.click((() => {
            this.fnReload();
        }).bind(this))
    }

    static fnFireEvent_Save() {
        $(document).trigger(this.oEvents.search_save);
    }

    static fnFireEvent_ItemClick(oRow) {
        $(document).trigger(this.oEvents.search_item_click, [ oRow ]);
    }

    static fnFireEvent_Select(oRow) {
        $(document).trigger(this.oEvents.search_select, [ oRow ]);
    }

    static fnFireEvent_ItemEditClick(oRow) {
        if (oRow.content_type == T_NOTES) {
            $(document).trigger(this.oEvents.notes_edit_click, [ oRow.content_id ]);
        }
        if (oRow.content_type == T_TABLES) {
            $(document).trigger(this.oEvents.tables_edit_click, [ oRow.content_id ]);
        }
    }

    static fnFireEvent_ItemClick(oRow) {
        if (oRow.content_type == T_NOTES) {
            $(document).trigger(this.oEvents.notes_item_click, [ oRow.content_id ]);
        }
        if (oRow.content_type == T_TABLES) {
            $(document).trigger(this.oEvents.tables_item_click, [ oRow.content_id ]);
        }
    }

    static fnFireEvent_ItemDeleteClick(oRow) {
        if (oRow.content_type == T_NOTES) {
            $(document).trigger(this.oEvents.notes_delete_click, [ oRow.content_id ]);
        }
        if (oRow.content_type == T_TABLES) {
            $(document).trigger(this.oEvents.tables_delete_click, [ oRow.content_id ]);
        }
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
                this.fnComponent('reload', this.oURLs.list(this._sSearchQuery));
                console.log('test');
            }).bind(this)
        });
    }

    static fnInitComponent()
    {
        this.fnComponent({
            url: this.oURLs.list(this._sSearchQuery),

            fit: true,
            fitColumns:true,
            method:'get',
            animate:true,
            lines:true,
            dnd:true,

            singleSelect: true,

            height: "100%",

            columns:[[
                {field:'created_at',title:'Создано',width:100},
                {field:'text',title:'Название',width:300},
                {field:'content_type',title:'Тип'},
            ]],

            onSelect: ((oNode) => {
                this._oSelected = oNode;
                this.fnFireEvent_ItemClick(oNode);
            }).bind(this),
            onRowContextMenu: (function(oEvent, node) {
                oEvent.preventDefault();
                // this.fnSelect(node.target);
                this.oContextMenu.menu('show', {
                    left: oEvent.pageX,
                    top: oEvent.pageY,
                    onClick: ((item) => {
                        if (item.id == 'edit') {
                            this.fnFireEvent_ItemEditClick(node);
                        }
                        if (item.id == 'delete') {
                            this.fnFireEvent_ItemDeleteClick(node);
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
        this.fnInitButtons();
        this.fnInitComponent();
    }
}