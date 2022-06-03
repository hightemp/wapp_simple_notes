import { tpl, fnAlertMessage, fnCreateEditor } from "./lib.js"
import { fnCreateSpeadsheet } from "../app_spreadsheet.js"

export class RightTabs {
    static sURL = ``

    static oTabsNotesIndexes = {};
    static oTabsNotesIDs = {};
    static oTabsNotesNotSavedIDs = {};
    static oEditors = {};
    static oTabsTablesIndexes = {};
    static oTabsTablesIDs = {};
    static oTabsTablesNotSavedIDs = {};
    static oSpreadsheets = {};

    static oSelectedCell = null;
    static iSelectedRow = 0;
    static iSelectedColumn = 0;

    static oEvents = {
        right_tabs_init: "right_tabs:init",
        tabs_save_content: "tabs:save_content",
        notes_item_click: "notes:item_click",
    }

    static oURLs = {
        get_note: 'ajax.php?method=get_note',
        get_table: 'ajax.php?method=get_table',
        update_note_content: `ajax.php?method=update_note_content`,
        update_table_content: `ajax.php?method=update_table_content`,
    }

    static oSelectors = {
        tabs_title: tpl`.tabs .tabs-title[data-index='${0}']`
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
        $(document).on(this.oEvents.notes_item_click, ((oEvent, iID) => {
            this.fnActionOpenNote(iID);
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

        document.body.addEventListener('paste', (async (event) => {
            var iI = this.fnGetSelectedTabIndex();
            if (this.oTabsTablesIDs[iI] && document.activeElement==document.body) {
                event.preventDefault();

                var items = await navigator.clipboard.read();
                var sPaste = '';

                for (var oI of items) {
                    if (~oI.types.indexOf("text/html")) {
                        const htmlBlob = await oI.getType("text/html");
                        sPaste = sPaste + await (new Response(htmlBlob)).text();
                    }
                }

                var oE = this.oSpreadsheets[this.oTabsTablesIDs[iI]].editor;

                if (oE.history)
                    oE.history.add(oE.getData());

                if (sPaste.match(/<table/)) {
                    var oDiv = document.createElement('div');
                    oDiv.innerHTML = sPaste;
                    var aTr = oDiv.querySelectorAll('tr');
                    for (var [iR, oTr] of Object.entries(aTr)) {
                        var aTd = oTr.querySelectorAll('td');
                        for (var [iC, oTd] of Object.entries(aTd)) {
                            oE.cellText(iR, iC, oTd.innerText);
                        }
                    }
                } else {
                    var aLines = sPaste.split(/\n/);

                    for (var iR in aLines) {
                        if (!aLines[iR] && iR==aLines.length-1) {
                            continue;
                        }
                        var aCell = aLines[iR].split(/\t/);
                        for (var iC in aCell) {
                            oE.cellText(this.iSelectedRow*1 + iR*1, this.iSelectedColumn*1 + iC*1, aCell[iC]);
                        }
                    }
                }
                oE.reRender();
            }
        }).bind(this));
    }

    static fnFireEvent_TabSaveContent() {
        $(document).trigger(this.oEvents.tabs_save_content);
    }

    static fnInitComponent()
    {
        this.fnComponent({
            fit:true,
            tabPosition: 'left',
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

    static fnGetTabTitle(iIndex) {
        return $(this.oSelectors.tabs_title(iIndex)).text();
    }
    static fnSetTabTitle(iIndex, sTitle) {
        $(this.oSelectors.tabs_title(iIndex)).text(sTitle);
    }

    static fnAddTabTitleStar(iIndex) {
        var sTitle = this.fnGetTabTitle(iIndex);
        sTitle = `*${sTitle}`;
        this.fnSetTabTitle(iIndex, sTitle);
    }
    static fnRemoveTabTitleStar(iIndex) {
        var sTitle = this.fnGetTabTitle(iIndex);
        sTitle = sTitle.replace(/^\*/, '');
        this.fnSetTabTitle(iIndex, sTitle);
    }

    static fnSetDirtyNote(iID) {
        if (this.oTabsNotesNotSavedIDs[iID]) return;
        this.fnAddTabTitleStar(this.oTabsNotesIndexes[iID]);
        this.oTabsNotesNotSavedIDs[iID] = true;
    }
    static fnUnsetDirtyNote(iID) {
        if (!this.oTabsNotesNotSavedIDs[iID]) return;
        this.fnRemoveTabTitleStar(this.oTabsNotesIndexes[iID]);
        this.oTabsNotesNotSavedIDs[iID] = false;
    }
    static fnSetDirtyTable(iID) {
        if (this.oTabsTablesNotSavedIDs[iID]) return;
        this.fnAddTabTitleStar(this.oTabsTablesIndexes[iID]);
        this.oTabsTablesNotSavedIDs[iID] = true;
    }
    static fnUnsetDirtyTable(iID) {
        if (!this.oTabsTablesNotSavedIDs[iID]) return;
        this.fnRemoveTabTitleStar(this.oTabsTablesIndexes[iID]);
        this.oTabsTablesNotSavedIDs[iID] = false;
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
        ).done((() => {
            this.fnUnsetDirtyNote(this.oTabsNotesIDs[iI]);
        }).bind(this))
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
        ).done((() => {
            this.fnUnsetDirtyTable(this.oTabsTablesIDs[iI]);
        }).bind(this))
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

                $(`.tabs .tabs-title:contains('${oR.name}')`).attr('data-index', iI);

                this.oTabsNotesIndexes[iID] = iI;
                this.oTabsNotesIDs[iI] = iID;

                this.oEditors[iID] = { editor: null, title: oR.name, id: iID };
                var oE = this.fnGetNote(iID);
                var sC = oR.content;

                var oEd = this.oEditors[iID].editor = fnCreateEditor(oE[0], sC);

                oEd.codemirror.on("change", (() => {
                    this.fnSetDirtyTable(this.oTabsNotesIDs[iI]);
                }).bind(this));
                
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
        $.post(
            this.oURLs.get_table,
            { id: iID },
            ((oR) => {
                this.fnAddTab({
                    title: oR.name,
                    content: `<div id="table-${iID}" class="table-tab-content"></div>`,
                    closable: true,
                });

                var iI = this.fnGetSelectedTabIndex();

                $(`.tabs .tabs-title:contains('${oR.name}')`).attr('data-index', iI);

                this.oTabsTablesIndexes[iID] = iI;
                this.oTabsTablesIDs[iI] = iID;

                this.oSpreadsheets[iID] = { editor: null, title: oR.name, id: iID };
                var oData = JSON.parse(oR.content);

                var oEd = this.oSpreadsheets[iID].editor = fnCreateSpeadsheet(`table-${iID}`);
                oEd.loadData(oData);
                oEd.on('cell-selected', ((cell, ri, ci) => {
                    this.oSelectedCell = cell;
                    this.iSelectedRow = ri;
                    this.iSelectedColumn = ci;
                }).bind(this));
                oEd.change((() => {
                    this.fnSetDirtyTable(this.oTabsTablesIDs[iI]);
                }).bind(this))
            }).bind(this),
            'json'
        );
    }

    static fnInit()
    {
        this.fnBindEvents();
        this.fnInitComponent();

        $(document).trigger(this.oEvents.right_tabs_init);
    }
}

RightTabs.fnInit();
