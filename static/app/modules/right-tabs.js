import { tpl, fnAlertMessage, fnCreateEditor } from "./lib.js"
import { fnCreateSpeadsheet } from "../app_spreadsheet.js"

export class RightTabs {
    static sURL = ``

    static oTabsNotesIndexes = {};
    static oTabsNotesIDs = {};
    static oEditors = {};
    static oTabsTablesIndexes = {};
    static oTabsTablesIDs = {};
    static oSpreadsheets = {};

    static oEvents = {
        tabs_save_content: "tabs:save_content",
        notes_item_click: "notes:item_click",
        fav_notes_item_click: "fav_notes:item_click",
        tags_item_click: "tags:item_click",
        tables_item_click: "tables:item_click",
    }

    static oURLs = {
        get_note: 'ajax.php?method=get_note',
        get_table: 'ajax.php?method=get_table',
        update_note_content: `ajax.php?method=update_note_content`,
        update_table_content: `ajax.php?method=update_table_content`,
    }

    static get oComponent() {
        return $("#notes-tt");
    }

    static get fnComponent() {
        return this.oComponent.tabs.bind(this.oComponent);
    }

    static fnGetNote(iID) {
        return $(`#note-${iID}`);
    }

    static fnGetTable(iID) {
        return $(`#table-${iID}`);
    }

    static fnBindEvents()
    {
        $(document).on(this.oEvents.notes_item_click, ((oEvent, oRow) => {
            this.fnActionOpenNote(oRow.id);
        }).bind(this));

        $(document).on(this.oEvents.fav_notes_item_click, ((oEvent, oRow) => {
            this.fnActionOpenNote(oRow.note_id);
        }).bind(this));

        $(document).on(this.oEvents.tables_item_click, ((oEvent, oRow) => {
            this.fnActionOpenTable(oRow.id);
        }).bind(this));

        $(document).on('keydown', (oEvent => {
            if (oEvent.ctrlKey && oEvent.key === 's') {
                oEvent.preventDefault();
                var iI = this.fnGetSelectedTabIndex();
                if (this.oTabsNotesIDs[iI]) {
                    this.fnFireEvent_TabSaveContent();
                    this.fnActionSaveNoteContent();
                }
                if (this.oTabsTablesIDs[iI]) {
                    this.fnFireEvent_TabSaveContent();
                    this.fnActionSaveTableContent();
                }
            }
        }).bind(this));
    }

    static fnFireEvent_TabSaveContent() {
        $(document).trigger(this.oEvents.tabs_save_content);
    }

    static fnInitComponent()
    {
        console.log([this.oComponent.length, this.oComponent, this.fnComponent]);
        this.fnComponent({
            fit:true
        })
    }

    static fnGetSelected() {
        return this.fnComponent('getSelected');
    }

    static fnGetTabIndex(oTab) {
        return this.fnComponent('getTabIndex', oTab);
    }

    static fnGetSelectedTabIndex() {
        return this.fnComponent('getTabIndex', this.fnGetSelected());
    }

    static fnSelect(oTarget) {
        this.fnComponent('select', oTarget);
    }

    static fnAddTab(oOptions) {
        this.fnComponent('add', oOptions);
    }

    static fnActionSaveNoteContent()
    {
        var iI = this.fnGetSelectedTabIndex();

        $.post(
            this.oURLs.update_note_content,
            {
                id: this.oTabsNotesIDs[iI],
                content: this.oEditors[this.oTabsNotesIDs[iI]].editor.value()
            }
        ).done(() => {
            // $.messager.alert('Сохранено', 'ОК');
        })
    }

    static fnActionSaveTableContent()
    {
        var iI = this.fnGetSelectedTabIndex();

        $.post(
            this.oURLs.update_table_content,
            {
                id: this.oTabsTablesIDs[iI],
                content: JSON.stringify(this.oSpreadsheets[this.oTabsTablesIDs[iI]].editor.getData())
            }
        ).done(() => {
            // $.messager.alert('Сохранено', 'ОК');
        })
    }

    static fnActionOpenNote(iID)
    {
        if (this.fnGetNote(iID).length) {
            this.fnSelect(this.oTabsNotesIndexes[iID]);
            return;
        }
        $.post(
            this.oURLs.get_note,
            { id: iID },
            ((oR) => {
                this.fnAddTab({
                    title: oR.name,
                    content: `<textarea id="note-${iID}" style="width:100%;height:100%"></textarea>`,
                    closable: true,
                });

                var iI = this.fnGetSelectedTabIndex();

                this.oTabsNotesIndexes[iID] = iI;
                this.oTabsNotesIDs[iI] = iID;

                this.oEditors[iID] = { editor: null, title: oR.name, id: iID };
                var oE = this.fnGetNote(iID);
                var sC = oR.content;

                this.oEditors[iID].editor = fnCreateEditor(oE[0], sC);
            }).bind(this),
            'json'
        );
    }

    static fnActionOpenTable(iID)
    {
        if (this.fnGetTable(iID).length) {
            this.fnSelect(this.oTabsTablesIndexes[iID]);
            return;
        }
        console.log('fnActionOpenTable');
        $.post(
            this.oURLs.get_table,
            { id: iID },
            ((oR) => {
                console.log('fnAddTab');
                this.fnAddTab({
                    title: oR.name,
                    content: `<div id="table-${iID}"></div>`,
                    closable: true,
                });

                var iI = this.fnGetSelectedTabIndex();

                this.oTabsTablesIndexes[iID] = iI;
                this.oTabsTablesIDs[iI] = iID;

                this.oSpreadsheets[iID] = { editor: null, title: oR.name, id: iID };
                var oData = JSON.parse(oR.content);

                this.oSpreadsheets[iID].editor = fnCreateSpeadsheet(`table-${iID}`);
                this.oSpreadsheets[iID].editor.loadData(oData);
            }).bind(this),
            'json'
        );
    }

    static fnPrepare()
    {
        this.fnBindEvents();
        this.fnInitComponent();
    }
}
