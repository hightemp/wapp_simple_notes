import { tpl, fnAlertMessage } from "./lib.js"

export class LastNotes {
    static sURL = ``

    static oURLs = {
        create: 'ajax.php?method=create_note',
        update: tpl`ajax.php?method=update_note&id=${0}`,
        delete: 'ajax.php?method=delete_note',
        list: `ajax.php?method=list_last_notes`,
    }
    static oWindowTitles = {
        create: 'Новая заметка',
        update: 'Редактировать заметку'
    }
    static oEvents = {
        notes_save: "notes:save",
        notes_item_click: "notes:item_click",
        notes_edit_click: "notes:edit_click",
        notes_delete_click: "notes:delete_click"
    }

    static get oComponent() {
        return $("#last-notes-list");
    }
    static get oContextMenu() {
        return $("#last-note-mm");
    }

    static get oPanelAddButton() {
        return $('#last-notes-add-btn');
    }
    static get oPanelEditButton() {
        return $('#last-notes-edit-btn');
    }
    static get oPanelRemoveButton() {
        return $('#last-notes-remove-btn');
    }
    static get oPanelReloadButton() {
        return $('#last-notes-reload-btn');
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
        $(document).on(this.oEvents.notes_save, ((oEvent, oItem) => {
            this.fnReload();
        }).bind(this))

        // this.oPanelAddButton.click((() => {
        //     this.fnShowCreateWindow();
        // }).bind(this))
        this.oPanelEditButton.click((() => {
            this.fnFireEvent_ItemEditClick(this.fnGetSelected());
        }).bind(this))
        this.oPanelRemoveButton.click((() => {
            this.fnFireEvent_ItemDeleteClick(this.fnGetSelected());
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

    static fnFireEvent_ItemEditClick(oRow) {
        $(document).trigger(this.oEvents.notes_edit_click, [ oRow.id ]);
    }

    static fnFireEvent_ItemDeleteClick(oRow) {
        $(document).trigger(this.oEvents.notes_delete_click, [ oRow.id ]);
    }

    static fnInitComponent()
    {
        this.fnComponent({
            url: this.oURLs.list,

            fit: true,
            columns:[[
                {field:'created_at',title:'Создано'},
                {field:'text',title:'Название'},
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
                                this.fnFireEvent_ItemEditClick(oNode);
                            }
                            if (item.id == 'delete') {
                                this.fnFireEvent_ItemDeleteClick(oNode);
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