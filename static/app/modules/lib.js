export function tpl(strings, ...keys) {
    return (function(...values) {
        let dict = values[values.length - 1] || {};
        let result = [strings[0]];
        keys.forEach(function(key, i) {
            let value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join('');
    });
}

export function fnAlertMessage(sMessage) {
    // alert(sMessage);
    $.messager.alert('', sMessage);
}

export function fnCreateEditor(oElement, sContent)
{
    var oEditor = new EasyMDE({
        autoDownloadFontAwesome: false,
        shortcuts: {
            "toggleOrderedList": "Ctrl-Alt-K",
            "drawTable": "Ctrl-Alt-T",
        },
        // toolbar: [],
        renderingConfig: {
            singleLineBreaks: false,
            codeSyntaxHighlighting: true,
        },
        uploadImage: true,
        imageUploadEndpoint: 'ajax.php?method=upload_image',
        element: oElement,
        minHeight: "100%",
        initialValue: sContent
    });

    oEditor.togglePreview();
    return oEditor;
}