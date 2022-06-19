import { tpl, fnAlertMessage, fnCreateEditor } from "./lib.js"

export class LeftTabs {
    static sURL = ``

    static oEvents = {
        left_tabs_init: "left_tabs:init"
    }

    static oURLs = {
        publish:"ajax.php?method=publish"
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

    static fnPublish() {
        $.post(
            this.oURLs.publish,
            { },
            (function(result) {
                // window.open('/public/');
            }).bind(this),
            'json'
        );
    }

    static fnInitComponent()
    {
        this.oComponent.tabs({
            tools:[
                {
                    iconCls:'icon-ok',
                    title: 'Опубликовать',
                    handler: (function(){
                        this.fnPublish();
                    }).bind(this)
                },
                {
                    iconCls:'icon-help',
                    title: 'Помощь',
                    handler: (function(){
                        this.fnShowHelpDialog();
                    }).bind(this)
                },
                {
                    iconCls:'icon-package',
                    title: 'Упаковать данные в архив',
                    handler: (function(){
                        window.open(`ajax.php?method=get_archived_data`);
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

    static fnInit()
    {
        this.fnBindEvents();
        this.fnInitComponent();

        $(document).trigger(this.oEvents.left_tabs_init);
    }
}

LeftTabs.fnInit();