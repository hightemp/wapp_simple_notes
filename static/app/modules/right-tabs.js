import { tpl, fnAlertMessage, fnCreateEditor } from "./lib.js"
import { fnCreateSpeadsheet } from "../app_spreadsheet.js"

export class RightTabs {
    static sURL = ``

    static oTabsNotesIndexes = {};
    static oTabsNotesIDs = {};
    static oTabsNotesNotSavedIDs = {};
    static oEditors = {};
    static oSpreadsheets = {};

    static oSelectedCell = null;
    static iSelectedRow = 0;
    static iSelectedColumn = 0;

    static iActiveID = null;

    static oEvents = {
        right_tabs_init: "right_tabs:init",
        tabs_save_content: "tabs:save_content",
        
        notes_preview_click: "notes_preview_click",
        notes_tiny_edit_click: "notes_tiny_edit_click",
        notes_simple_edit_click: "notes_simple_edit_click",

        notes_item_click: "notes:item_click",
        notes_item_dblclick: "notes:item_dblclick",
        notes_edit_click: "notes:edit_click",
        notes_delete_click: "notes:delete_click",
        notes_reload_click: "notes:reload_click",

        notes_to_save_click: "notes:to_save_click",
    }

    static oURLs = {
        get_note: 'ajax.php?method=get_note',
        update_note_content: `ajax.php?method=update_note_content`,
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

    static fnGetSaveButton(iID) {
        return $(`#note-save-btn-${iID}`);
    }

    static fnGenerateHashForNote()
    {
        window.location.hash = Object.values(this.oTabsNotesIDs).join(',')
    }

    static fnOpenNoteFromHash()
    {
        var sHash = window.location.hash.replace(/^#/, '');

        if (sHash) {
            var aIDs = sHash.split(',').filter((a)=>a);
            for (var iID of aIDs) {
                $.post(
                    this.oURLs.get_note,
                    { id: iID },
                    ((oR) => {
                        this.fnActionOpenNote(oR);
                        this.fnActionLoadPreview(oR);                        
                    }).bind(this),
                    'json'
                );
            }
        }
    }

    static fnBindEvents()
    {
        window.addEventListener("message", ((oEvent) => {
            if (oEvent.data.action) {
                if (oEvent.data.action == "unset_dirty") {
                    this.fnUnsetDirtyNote(oEvent.data.id);
                }
                if (oEvent.data.action == "set_dirty") {
                    this.fnSetDirtyNote(oEvent.data.id);
                }
                if (oEvent.data.action == "note_saved") {
                    // alert('Сохранено');
                }
            }
        }).bind(this));

        $(document).on(this.oEvents.notes_simple_edit_click, ((oEvent, oNote) => {
            this.fnActionOpenNote(oNote);
            this.fnActionLoadSimpleEditor(oNote);
        }).bind(this));

        $(document).on(this.oEvents.notes_tiny_edit_click, ((oEvent, oNote) => {
            this.fnActionOpenNote(oNote);
            this.fnActionLoadTinymceEditor(oNote);
        }).bind(this));

        $(document).on(this.oEvents.notes_preview_click, ((oEvent, oNote) => {
            this.fnActionOpenNote(oNote);
            this.fnActionLoadPreview(oNote);
        }).bind(this));

        // $(document).on(this.oEvents.notes_to_save_click, ((oEvent, iID) => {
        //     this.fnActionSaveNoteContent();
        // }).bind(this));

        $(document).on('keydown', (oEvent => {
            if (oEvent.ctrlKey && (oEvent.key === 's' || oEvent.key === 'ы')) {
                oEvent.preventDefault();
                this.fnActionSaveNote(this.iActiveID);
            }
        }).bind(this));
    }

    static fnFireEvent_TabSaveContent(iID) {
        $(document).trigger(this.oEvents.tabs_save_content, [iID]);
    }

    static fnInitComponent()
    {
        this.fnComponent({
            fit:true,
            tabPosition: 'left',

            // tools:[{
            //     iconCls:'icon-add',
            //     handler:function(){
            //         alert('add')
            //     }
            // },{
            //     iconCls:'icon-save',
            //     handler:function(){
            //         alert('save')
            //     }
            // }],

            onClose: ((title,index) => {
                var iID = this.oTabsNotesIDs[index];
                // this.oEditors[iID].editor.remove();
                // delete this.oEditors[iID].editor;
                // delete this.oEditors[iID];
                delete this.oTabsNotesIndexes[iID];
                delete this.oTabsNotesIDs[index];

                this.fnGenerateHashForNote();
            }).bind(this),

            onSelect: ((title,index) => {
                this.iActiveID = this.oTabsNotesIDs[index];
            }).bind(this),

            onAdd: ((title,index) => {
                // this.fnGenerateHashForNote();
            }).bind(this)
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
        // this.fnAddTabTitleStar(this.oTabsNotesIndexes[iID]);
        $(`#tab-dirty-${iID}`).show();
        $(`#tab-note-title-dirty-${iID}`).show();
        this.oTabsNotesNotSavedIDs[iID] = true;
    }
    static fnUnsetDirtyNote(iID) {
        if (!this.oTabsNotesNotSavedIDs[iID]) return;
        // this.fnRemoveTabTitleStar(this.oTabsNotesIndexes[iID]);
        $(`#tab-dirty-${iID}`).hide();
        $(`#tab-note-title-dirty-${iID}`).hide();
        this.oTabsNotesNotSavedIDs[iID] = false;
    }

    // static fnActionSaveNoteContent(iID)
    // {
    //     $.post(
    //         this.oURLs.update_note_content,
    //         {
    //             id: iID,
    //             content: this.oEditors[iID].editor.getContent()
    //         }
    //     ).done((() => {
    //         this.fnUnsetDirtyNote(iID);
    //     }).bind(this))
    // }

    static fnActionDownloadWord(iID)
    {
        window.open(`/ajax.php?method=download_note_as_word&id=${iID}`);
    }

    static fnActionDownloadHTML(iID)
    {
        window.open(`/ajax.php?method=download_note_as_html&id=${iID}`);
    }

    static fnActionSaveNote(iID)
    {
        this.fnFireEvent_TabSaveContent(iID);
        this.fnGetNote(iID)[0].contentWindow.postMessage({action:"save"});
        // this.fnActionSaveNoteContent(iID);
    }

    static fnBindButtons(iID)
    {
        $(`#note-edit-btn-${iID}`).click((() => {
            $(document).trigger(this.oEvents.notes_edit_click, [ iID ]);
        }).bind(this))
        $(`#note-remove-btn-${iID}`).click((() => {
            $(document).trigger(this.oEvents.notes_delete_click, [ iID ]);
        }).bind(this))
        $(`#note-reload-btn-${iID}`).click((() => {
            $(document).trigger(this.oEvents.notes_reload_click, [ ]);
            this.fnGetNote(iID)[0].contentWindow.location.reload();
        }).bind(this))
        $(`#note-save-btn-${iID}`).click((() => {
            this.fnActionSaveNote(iID);
        }).bind(this))
        $(`#note-download-html-btn-${iID}`).click((() => {
            this.fnActionDownloadHTML(iID);
        }).bind(this))
        $(`#note-download-word-btn-${iID}`).click((() => {
            this.fnActionDownloadWord(iID);
        }).bind(this))
    }

    static fnActionLoadTinymceEditor(oNote)
    {
        var iID = oNote.id;
        this.fnGetNote(iID)[0].src = `p_tinymce_editor.php?id=${iID}`;
    }

    static fnActionLoadSimpleEditor(oNote)
    {
        var iID = oNote.id;
        this.fnGetNote(iID)[0].src = `p_simple_editor.php?id=${iID}`;
    }

    static fnActionLoadPreview(oNote)
    {
        var iID = oNote.id;
        this.fnGetNote(iID)[0].src = `p_page_viewer.php?id=${iID}`;
    }

    static fnCreateTab(oNote)
    {
        var iID = oNote.id;
        var sPageLink = `#${iID}`;

        this.fnAddTab({
            title: `<span id="tab-dirty-${iID}" style="display:none">*</span> `+oNote.name,
            content: `
            <div 
                class="easyui-panel" 
                title="  " 
                style="padding:0px;"
                data-options="tools:'#tab-note-tt-${iID}', fit:true,border:false"
            >
                <iframe id="note-${iID}" src="about:blank" style="width:100%;height:calc(100% - 4px);border: 0px;"></iframe>
            </div>
            <div id="tab-note-tt-${iID}">
                <span class="tab-note-title-dirty" id="tab-note-title-dirty-${iID}" style="display:none">не сохранено</span>
                <a target="_blank" href="${sPageLink}" class="tab-note-title" id="tab-note-title-${iID}">${iID} - ${oNote.name}</a>
                <a href="javascript:void(0)" class="icon-edit" id="note-edit-btn-${iID}"></a>
                <a href="javascript:void(0)" class="icon-delete" id="note-remove-btn-${iID}"></a>
                <a href="javascript:void(0)" class="icon-reload" id="note-reload-btn-${iID}"></a>
                <a href="javascript:void(0)" class="icon-save" id="note-save-btn-${iID}"></a>
                <a href="javascript:void(0)" class="icon-page_world" id="note-download-html-btn-${iID}"></a>
                <a href="javascript:void(0)" class="icon-page_word" id="note-download-word-btn-${iID}"></a>
            </div>
            `,
            closable: true,
        });

        this.fnBindButtons(iID);

        var iI = this.fnGetSelectedTabIndex();

        $(`.tabs .tabs-title:contains('${oNote.name}')`).attr('data-index', iI);

        this.oTabsNotesIndexes[iID] = iI;
        this.oTabsNotesIDs[iI] = iID;

        // this.oEditors[iID] = { editor: null, title: oR.name, id: iID };
        // var oE = this.fnGetNote(iID);
        // var sC = oR.content ?? '';

        // var oEd = this.oEditors[iID].editor = fnCreateEditor(
        //     oE[0], 
        //     sC,
        //     {
        //     },
        //     (() => {
        //         this.fnSetDirtyNote(this.oTabsNotesIDs[iI]);
        //     }).bind(this),
        //     (() => {
        //         $(".icon-save:visible").click();
        //     })
        // );

        this.fnGenerateHashForNote();

        // oEd.codemirror.on("change", (() => {
        //     this.fnSetDirtyNote(this.oTabsNotesIDs[iI]);
        // }).bind(this));        
    }

    static fnActionOpenNote(oNote)
    {
        var iID = oNote.id;

        if (this.fnGetNote(iID).length) {
            this.fnSelect(this.oTabsNotesIndexes[iID]);
            return;
        }

        this.fnCreateTab(oNote);

        // $.post(
        //     this.oURLs.get_note,
        //     { id: iID },
        //     ((oR) => {
                
        //     }).bind(this),
        //     'json'
        // );
    }

    static fnInit()
    {
        this.fnBindEvents();
        this.fnInitComponent();

        this.fnOpenNoteFromHash();

        $(document).trigger(this.oEvents.right_tabs_init);
    }
}

RightTabs.fnInit();
