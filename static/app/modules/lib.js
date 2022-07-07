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


function _replaceSelection(cm, active, startEnd, url) {
    if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
        return;

    var text;
    var start = startEnd[0];
    var end = startEnd[1];
    var startPoint = {},
        endPoint = {};
    Object.assign(startPoint, cm.getCursor('start'));
    Object.assign(endPoint, cm.getCursor('end'));
    if (url) {
        start = start.replace('#url#', url);  // url is in start for upload-image
        end = end.replace('#url#', url);
    }
    if (active) {
        text = cm.getLine(startPoint.line);
        start = text.slice(0, startPoint.ch);
        end = text.slice(startPoint.ch);
        cm.replaceRange(start + end, {
            line: startPoint.line,
            ch: 0,
        });
    } else {
        text = cm.getSelection();
        cm.replaceSelection(start + text + end);

        startPoint.ch += start.length;
        if (startPoint !== endPoint) {
            endPoint.ch += start.length;
        }
    }
    cm.setSelection(startPoint, endPoint);
    cm.focus();
}

function getState(cm, pos) {
    pos = pos || cm.getCursor('start');
    var stat = cm.getTokenAt(pos);
    if (!stat.type) return {};

    var types = stat.type.split(' ');

    var ret = {},
        data, text;
    for (var i = 0; i < types.length; i++) {
        data = types[i];
        if (data === 'strong') {
            ret.bold = true;
        } else if (data === 'variable-2') {
            text = cm.getLine(pos.line);
            if (/^\s*\d+\.\s/.test(text)) {
                ret['ordered-list'] = true;
            } else {
                ret['unordered-list'] = true;
            }
        } else if (data === 'atom') {
            ret.quote = true;
        } else if (data === 'em') {
            ret.italic = true;
        } else if (data === 'quote') {
            ret.quote = true;
        } else if (data === 'strikethrough') {
            ret.strikethrough = true;
        } else if (data === 'comment') {
            ret.code = true;
        } else if (data === 'link') {
            ret.link = true;
        } else if (data === 'tag') {
            ret.image = true;
        } else if (data.match(/^header(-[1-6])?$/)) {
            ret[data.replace('header', 'heading')] = true;
        }
    }
    return ret;
}

function afterImageUploaded(editor, url) {
    var cm = editor.codemirror;
    var stat = getState(cm);
    var options = editor.options;
    var imageName = url.substr(url.lastIndexOf('/') + 1);
    var ext = imageName.substring(imageName.lastIndexOf('.') + 1).replace(/\?.*$/, '').toLowerCase();

    // Check if media is an image
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
        _replaceSelection(cm, stat.image, options.insertTexts.uploadedImage, url);
    } else {
        var text_link = options.insertTexts.link;
        text_link[0] = '[' + imageName;
        _replaceSelection(cm, stat.link, text_link, url);
    }

    // show uploaded image filename for 1000ms
    editor.updateStatusBar('upload-image', editor.options.imageTexts.sbOnUploaded.replace('#image_name#', imageName));
    setTimeout(function () {
        editor.updateStatusBar('upload-image', editor.options.imageTexts.sbInit);
    }, 1000);
}


export function fnCreateEditor(oElement, sContent, oOptions={})
{
    /*
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
        imageMaxSize: 500 * 1024 * 1024,
        imageUploadEndpoint: 'ajax.php?method=upload_image',
        element: oElement,
        minHeight: "100%",
        initialValue: sContent,
        spellChecker: false,
        // insertTexts: {
        //     horizontalRule: ["", "\n\n-----\n\n"],
        //     image: ["![](http://", ")"],
        // }
    });

    var uploadImage = oEditor.uploadImage.bind(oEditor);
    oEditor.uploadImage = function (file, onSuccess, onError) {
        uploadImage(
            file, 
            (imageUrl) => {
                imageUrl = imageUrl.replace(window.location.origin, window.BASE_PATH+'/');
                imageUrl = imageUrl.replace(/\/+/, '/');

                onSuccess = onSuccess || function onSuccess(imageUrl) {
                    afterImageUploaded(oEditor, imageUrl);

                    $(document).trigger("files:upload", [ imageUrl ]);
                }
                
                onSuccess(imageUrl);
            },
            onError
        );
    }

    oEditor.togglePreview();
    return oEditor;
    */
    var oEditor = tinymce.init({
        selector: `#${oElement.id}`,
        height: '100%',
        menubar: false,
        plugins: "textpatterns advlist autoresize code emoticons image link nonbreaking quickbars table visualchars anchor autosave codesample fullscreen importcss lists save template wordcount autolink charmap directionality help insertdatetime media preview searchreplace visualblocks",
        textpattern_patterns: [
            {start: '*', end: '*', format: 'italic'},
            {start: '**', end: '**', format: 'bold'},
            {start: '---', replacement: '<hr/>'},
            {start: '#', format: 'h1'},
            {start: '##', format: 'h2'},
            {start: '###', format: 'h3'},
            {start: '####', format: 'h4'},
            {start: '#####', format: 'h5'},
            {start: '######', format: 'h6'},
            {start: '1. ', cmd: 'InsertOrderedList'},
            {start: '* ', cmd: 'InsertUnorderedList'},
            {start: '- ', cmd: 'InsertUnorderedList'},
            {start: '1. ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'decimal' }},
            {start: '1) ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'decimal' }},
            {start: 'a. ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'lower-alpha' }},
            {start: 'a) ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'lower-alpha' }},
            {start: 'i. ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'lower-roman' }},
            {start: 'i) ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'lower-roman' }}
        ],
        codesample_languages: [
            {text: 'HTML/XML', value: 'markup'},
            {text: 'JavaScript', value: 'javascript'},
            {text: 'CSS', value: 'css'},
            {text: 'PHP', value: 'php'},
            {text: 'Bash', value: 'bash'},
            {text: 'Python', value: 'python'},
            {text: 'Java', value: 'java'},
            {text: 'Rust', value: 'rust'},
            {text: 'C', value: 'c'},
            {text: 'C#', value: 'csharp'},
            {text: 'C++', value: 'cpp'}
        ],
        toolbar: 'undo redo | h1 h2 h3 h4 h5 h6 bold italic | table | link image | bullist numlist outdent indent lists | print preview media | alignleft aligncenter alignright alignjustify | forecolor backcolor emoticons | codesample code | emoticons nonbreaking quickbars visualchars anchor fullscreen importcss template wordcount autolink charmap directionality insertdatetime media preview searchreplace visualblocks | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        setup: function (editor) {
            editor.on('init', function () {
                editor.setContent(sContent);
            });
        },

        paste_data_images: true,

        /* without images_upload_url set, Upload tab won't show up*/
        images_upload_url: 'ajax.php?method=upload_image',

        /* we override default upload handler to simulate successful upload*/
        // images_upload_handler: function (blobInfo, success, failure) {
        //     /* no matter what you upload, we will turn it into TinyMCE logo :)*/
        //     imageUrl = imageUrl.replace(window.location.origin, window.BASE_PATH+'/');
        //     imageUrl = imageUrl.replace(/\/+/, '/');

        //     // onSuccess = onSuccess || function onSuccess(imageUrl) {
        //     //     afterImageUploaded(oEditor, imageUrl);

        //     //     $(document).trigger("files:upload", [ imageUrl ]);
        //     // }
            
        //     success(imageUrl);
        // },
        ...oOptions
    });

    oEditor = tinymce.get(oElement.id);

    return oEditor;
}