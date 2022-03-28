import { tpl, fnAlertMessage } from "./lib.js"

export class Links {
    static sURL = ``

    static oURLs = {
        create: 'ajax.php?method=create_link',
        update: tpl`ajax.php?method=update_link&id=${0}`,
        delete: 'ajax.php?method=delete_link',
        list: `ajax.php?method=list_last_links`,
    }
    static oWindowTitles = {
        create: 'Новая ссылка',
        update: 'Редактировать ссылку'
    }
    static oEvents = {
        links_save: "links:save",
        links_item_click: "links:item_click",
    }

    static get oDialog() {
        return $('#links-dlg');
    }
    static get oDialogForm() {
        return $('#links-dlg-fm');
    }
    static get oComponent() {
        return $("#links-list");
    }
    static get oContextMenu() {
        return $("#links-mm");
    }

    static get oEditDialogSaveBtn() {
        return $('#links-dlg-save-btn');
    }
    static get oEditDialogCancelBtn() {
        return $('#links-dlg-cancel-btn');
    }

    static get oPanelAddButton() {
        return $('#links-add-btn');
    }
    static get oPanelEditButton() {
        return $('#links-edit-btn');
    }
    static get oPanelRemoveButton() {
        return $('#links-remove-btn');
    }
    static get oPanelReloadButton() {
        return $('#links-reload-btn');
    }


    static get fnComponent() {
        return this.oComponent.datagrid.bind(this.oComponent);
    }

    static fnShowDialog(sTitle) {
        this.oDialog.dialog('open').dialog('center').dialog('setTitle', sTitle);
    }
    static fnDialogFormLoad(oRows={}) {
        this.oDialogForm.form('clear');
        this.oDialogForm.form('load', oRows);
    }

    static fnShowCreateWindow() {
        this.sURL = this.oURLs.create;
        var oData = {}
        this.fnShowDialog(this.oWindowTitles.create);
        this.fnDialogFormLoad(oData);
    }

    static fnShowEditWindow(oRow) {
        if (oRow) {
            this.sURL = this.oURLs.update(oRow.id);
            this.fnShowDialog(this.oWindowTitles.update);
            this.fnDialogFormLoad(oRow);
        }
    }

    static fnReload() {
        this.fnComponent('reload');
    }

    static fnSave() {
        this.oDialogForm.form('submit', {
            url: this.sURL,
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

    static fnDelete(oRow) {
        if (oRow){
            $.messager.confirm(
                'Confirm',
                'Удалить?',
                (function(r) {
                    if (r) {
                        $.post(
                            this.oURLs.delete,
                            { id: oRow.id },
                            (function(result) {
                                this.fnReload();
                            }).bind(this),
                            'json'
                        );
                    }
                }).bind(this)
            );
        }
    }

    static fnGetSelected() {
        return this.fnComponent('getSelected');
    }

    static fnSelect(oTarget) {
        this.fnComponent('select', oTarget);
    }

    static fnBindEvents()
    {
        this.oEditDialogSaveBtn.click((() => {
            this.fnSave();
        }).bind(this))
        this.oEditDialogCancelBtn.click((() => {
            this.oDialog.dialog('close');
        }).bind(this))

        this.oPanelAddButton.click((() => {
            this.fnShowCreateWindow();
        }).bind(this))
        this.oPanelEditButton.click((() => {
            this.fnShowEditWindow(this.fnGetSelected());
        }).bind(this))
        this.oPanelRemoveButton.click((() => {
            this.fnDelete(this.fnGetSelected());
        }).bind(this))
        this.oPanelReloadButton.click((() => {
            this.fnReload();
        }).bind(this))
    }

    static fnFireEvent_Save() {
        $(document).trigger(this.oEvents.links_save);
    }

    static fnFireEvent_ItemClick(oRow) {
        $(document).trigger(this.oEvents.links_item_click, [ oRow ]);
    }

    static fnInitComponent()
    {
        this.fnComponent({
            url: this.oURLs.list,

            fit: true,
            columns:[[
                {field:'created_at',title:'Создано',width:100},
                {
                    field:'name',title:'Название',width:200,
                    formatter: function(value,row,index) {
                        return `<a href="${row.url}" target="__blank">${row.name}</a>`;
                    }
                },
                {field:'url',title:'URL',width:400},
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
                                this.fnShowEditWindow(oNode);
                            }
                            if (item.id == 'delete') {
                                this.fnDelete(oNode);
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