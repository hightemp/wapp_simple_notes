import { tpl, fnAlertMessage } from "./lib.js"

export class Files {
    static sURL = ``

    static oURLs = {
        create_image: 'ajax.php?method=create_image',
        update_image: tpl`ajax.php?method=update_image&id=${0}`,
        delete_image: 'ajax.php?method=delete_image',
        list_images: `ajax.php?method=list_images`,

        create_file: 'ajax.php?method=create_file',
        update_file: tpl`ajax.php?method=update_file&id=${0}`,
        delete_file: 'ajax.php?method=delete_file',
        list_files: `ajax.php?method=list_files`,
    }
    static oWindowTitles = {
        create: 'Новый файл',
        update: 'Редактировать файл'
    }
    static oEvents = {
        images_save: "images:save",
        images_item_click: "images:item_click",
        files_save: "files:save",
        files_item_click: "files:item_click",
        files_init: "files:init",
    }

    static get oImagesDialog() {
        return $('#images-dlg');
    }
    static get oImagesDialogForm() {
        return $('#images-dlg-fm');
    }

    static get oFilesDialog() {
        return $('#files-dlg');
    }
    static get oFilesDialogForm() {
        return $('#files-dlg-fm');
    }

    static get oComponentImagesList() {
        return $("#images-list");
    }
    static get oComponentFilesList() {
        return $("#files-list");
    }

    static get oContextImagesMenu() {
        return $("#images-mm");
    }
    static get oContextFilesMenu() {
        return $("#files-mm");
    }

    static get oEditFilesDialogSaveBtn() {
        return $('#files-dlg-save-btn');
    }
    static get oEditFilesDialogCancelBtn() {
        return $('#files-dlg-cancel-btn');
    }

    static get oPanelFilesAddButton() {
        return $('#files-add-btn');
    }
    static get oPanelFilesEditButton() {
        return $('#files-edit-btn');
    }
    static get oPanelFilesRemoveButton() {
        return $('#files-remove-btn');
    }
    static get oPanelFilesReloadButton() {
        return $('#files-reload-btn');
    }

    static get oEditImagesDialogSaveBtn() {
        return $('#images-dlg-save-btn');
    }
    static get oEditImagesDialogCancelBtn() {
        return $('#images-dlg-cancel-btn');
    }

    static get oPanelImagesAddButton() {
        return $('#images-add-btn');
    }
    static get oPanelImagesEditButton() {
        return $('#images-edit-btn');
    }
    static get oPanelImagesRemoveButton() {
        return $('#images-remove-btn');
    }
    static get oPanelImagesReloadButton() {
        return $('#images-reload-btn');
    }

    static get fnComponentImagesList() {
        return this.oComponentImagesList.datagrid.bind(this.oComponentImagesList);
    }
    static get fnComponentFilesList() {
        return this.oComponentFilesList.datagrid.bind(this.oComponentFilesList);
    }


    static fnShowImagesDialog(sTitle) {
        this.oImagesDialog.dialog('open').dialog('center').dialog('setTitle', sTitle);
    }
    static fnImagesDialogFormLoad(oRows={}) {
        this.oImagesDialogForm.form('clear');
        this.oImagesDialogForm.form('load', oRows);
    }

    static fnShowImagesCreateWindow() {
        this.sURL = this.oURLs.create_image;
        var oData = {}
        this.fnShowImagesDialog(this.oWindowTitles.create);
        this.fnImagesDialogFormLoad(oData);
        console.log(this.sURL);
    }

    static fnShowImagesEditWindow(oRow) {
        if (oRow) {
            this.sURL = this.oURLs.update_image(oRow.id);
            this.fnShowImagesDialog(this.oWindowTitles.update);
            this.fnImagesDialogFormLoad(oRow);
        }
    }

    static fnImagesSave() {
        this.oImagesDialogForm.form('submit', {
            url: this.sURL,
            iframe: false,
            onSubmit: () => {
                return this.oImagesDialogForm.form('validate');
            },
            success: ((result) => {
                this.oImagesDialog.dialog('close');
                this.fnReload();

                this.fnFireEvent_ImagesSave();
            }).bind(this)
        });
    }

    static fnImagesDelete(oRow) {
        if (oRow){
            $.messager.confirm(
                'Confirm',
                'Удалить?',
                ((r) => {
                    if (r) {
                        $.post(
                            this.oURLs.delete_image,
                            { id: oRow.id },
                            ((result) => {
                                this.fnReload();
                            }).bind(this),
                            'json'
                        );
                    }
                }).bind(this)
            );
        }
    }


    static fnShowFilesDialog(sTitle) {
        this.oFilesDialog.dialog('open').dialog('center').dialog('setTitle', sTitle);
    }
    static fnFilesDialogFormLoad(oRows={}) {
        this.oFilesDialogForm.form('clear');
        this.oFilesDialogForm.form('load', oRows);
    }

    static fnShowFilesCreateWindow() {
        this.sURL = this.oURLs.create_file;
        var oData = {}
        this.fnShowFilesDialog(this.oWindowTitles.create);
        this.fnFilesDialogFormLoad(oData);
        console.log(this.sURL);
    }

    static fnShowFilesEditWindow(oRow) {
        if (oRow) {
            this.sURL = this.oURLs.update_file(oRow.id);
            this.fnShowFilesDialog(this.oWindowTitles.update);
            this.fnFilesDialogFormLoad(oRow);
        }
    }

    static fnFilesSave() {
        this.oFilesDialogForm.form('submit', {
            url: this.sURL,
            iframe: false,
            onSubmit: () => {
                return this.oFilesDialogForm.form('validate');
            },
            success: ((result) => {
                this.oFilesDialog.dialog('close');
                this.fnReload();

                this.fnFireEvent_FilesSave();
            }).bind(this)
        });
    }

    static fnFilesDelete(oRow) {
        if (oRow){
            $.messager.confirm(
                'Confirm',
                'Удалить?',
                ((r) => {
                    if (r) {
                        $.post(
                            this.oURLs.delete_file,
                            { id: oRow.id },
                            ((result) => {
                                this.fnReload();
                            }).bind(this),
                            'json'
                        );
                    }
                }).bind(this)
            );
        }
    }


    static fnGetSelectedImagesList() {
        return this.fnComponentImagesList('getSelected');
    }
    static fnGetSelectedFilesList() {
        return this.fnComponenFilesList('getSelected');
    }
    

    static fnReload() {
        this.fnComponentImagesList('reload');
        this.fnComponentFilesList('reload');
    }

    

    static fnBindEvents()
    {
        this.oEditImagesDialogSaveBtn.click((() => {
            this.fnImagesSave();
        }).bind(this))
        this.oEditImagesDialogCancelBtn.click((() => {
            this.oImagesDialog.dialog('close');
        }).bind(this))

        this.oPanelImagesAddButton.click((() => {
            this.fnShowImagesCreateWindow();
        }).bind(this))
        this.oPanelImagesEditButton.click((() => {
            this.fnShowImagesEditWindow(this.fnGetSelectedImagesList());
        }).bind(this))
        this.oPanelImagesRemoveButton.click((() => {
            this.fnImagesDelete(this.fnGetSelectedImagesList());
        }).bind(this))
        this.oPanelImagesReloadButton.click((() => {
            this.fnReload();
        }).bind(this))


        this.oEditFilesDialogSaveBtn.click((() => {
            this.fnFilesSave();
        }).bind(this))
        this.oEditFilesDialogCancelBtn.click((() => {
            this.oFilesDialog.dialog('close');
        }).bind(this))

        this.oPanelFilesAddButton.click((() => {
            console.log(this);
            this.fnShowFilesCreateWindow();
        }).bind(this))
        this.oPanelFilesEditButton.click((() => {
            this.fnShowFilesEditWindow(this.fnGetSelectedFilesList());
        }).bind(this))
        this.oPanelFilesRemoveButton.click((() => {
            this.fnFilesDelete(this.fnGetSelectedFilesList());
        }).bind(this))
        this.oPanelFilesReloadButton.click((() => {
            this.fnReload();
        }).bind(this))
    }


    static fnFireEvent_ImagesSave() {
        $(document).trigger(this.oEvents.images_save);
    }

    static fnFireEvent_ImagesItemClick(oRow) {
        $(document).trigger(this.oEvents.images_item_click, [ oRow ]);
    }

    static fnFireEvent_FilesSave() {
        $(document).trigger(this.oEvents.files_save);
    }

    static fnFireEvent_FilesItemClick(oRow) {
        $(document).trigger(this.oEvents.files_item_click, [ oRow ]);
    }


    static fnInitComponent()
    {
        this.fnComponentImagesList({
            singleSelect: true,

            url: this.oURLs.list_images,
            method: 'get',

            columns:[[
                {field:'created_at',title:'Создано',width:100},
                {field:'name',title:'Название',width:400},
                {field:'filename',title:'Файл',width:150},
            ]],

            onRowContextMenu: (function(e, index, node) {
                e.preventDefault();
                this.oContextImagesMenu.menu('show', {
                    left: e.pageX,
                    top: e.pageY,
                    onClick: (item) => {
                        if (item.id == 'edit') {
                            this.fnShowImagesEditWindow(node);
                        }
                        if (item.id == 'delete') {
                            this.fnImagesDelete(node);
                        }
                    }
                });
            }).bind(this),
        });

        this.fnComponentFilesList({
            singleSelect: true,

            url: this.oURLs.list_files,
            method: 'get',

            columns:[[
                {field:'created_at',title:'Создано',width:100},
                {field:'name',title:'Название',width:400},
                {field:'filename',title:'Файл',width:150},
            ]],

            onRowContextMenu: (function(e, index, node) {
                e.preventDefault();
                this.oContextFilesMenu.menu('show', {
                    left: e.pageX,
                    top: e.pageY,
                    onClick: (item) => {
                        if (item.id == 'edit') {
                            this.fnShowEditWindow(node);
                        }
                        if (item.id == 'delete') {
                            this.fnFilesDelete(node);
                        }
                    }
                });
            }).bind(this),
        });
    }

    static fnInit()
    {
        this.fnBindEvents();
        this.fnInitComponent();

        $(document).trigger(this.oEvents.files_init);
    }
}

Files.fnInit();