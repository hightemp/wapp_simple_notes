import { tpl, fnAlertMessage, fnCreateEditor } from "./lib.js"

export class LeftTabs {
    static sURL = ``

    static oEvents = {
    }

    static oURLs = {
    }

    static get oComponent() {
        return $("#left-panel-tabs");
    }
    static get oHelpDialog() {
        return $("#help-dlg");
    }

    static get fnComponent() {
        return this.oComponent.tabs.bind(this.oComponent);
    }

    static fnBindEvents() {
    }

    static fnShowHelpDialog() {
        this.oHelpDialog.dialog('open').dialog('center');
    }

    static fnInitComponent()
    {
        this.oComponent.tabs({
            tools:[
                {
                    iconCls:'icon-help',
                    handler: (function(){
                        this.fnShowHelpDialog();
                    }).bind(this)
                }
            ]
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

    static fnPrepare()
    {
        this.fnBindEvents();
        this.fnInitComponent();
    }
}