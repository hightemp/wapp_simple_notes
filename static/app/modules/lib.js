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


export function fnCreateEditor(oElement, sContent, oOptions={}, fnOnChange=()=>{}, fnOnSave=()=>{})
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
            {text: 'Text', value: 'text'},
            {text: 'HTML/XML', value: 'markup'},
            {text: 'JavaScript', value: 'javascript'},
            {text: 'TypeScript', value: 'typescript' },
            {text: 'JSON', value: 'json'},
            {text: 'TWIG', value: 'twig'},
            {text: 'SQL', value: 'sql'},
            {text: 'CSV', value: 'csv'},
            {text: 'CSS', value: 'css'},
            {text: 'PHP', value: 'php'},
            {text: 'Bash', value: 'shell'},
            {text: 'YAML', value: 'yaml'},
            {text: 'nginx', value: 'nginx'},
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
            editor.addShortcut("ctrl+s", "Custom Ctrl+S", "custom_ctrl_s");
            editor.addCommand("custom_ctrl_s", fnOnSave)
            editor.on('init', function () {
                editor.setContent(sContent);
            });
            editor.on('Change', fnOnChange);
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

/**
Markup - markup, html, xml, svg, mathml, ssml, atom, rss
CSS - css
C-like - clike
JavaScript - javascript, js
ABAP - abap
ABNF - abnf
ActionScript - actionscript
Ada - ada
Agda - agda
AL - al
ANTLR4 - antlr4, g4
Apache Configuration - apacheconf
Apex - apex
APL - apl
AppleScript - applescript
AQL - aql
Arduino - arduino, ino
ARFF - arff
ARM Assembly - armasm, arm-asm
Arturo - arturo, art
AsciiDoc - asciidoc, adoc
ASP.NET (C#) - aspnet
6502 Assembly - asm6502
Atmel AVR Assembly - asmatmel
AutoHotkey - autohotkey
AutoIt - autoit
AviSynth - avisynth, avs
Avro IDL - avro-idl, avdl
AWK - awk, gawk
Bash - bash, shell
BASIC - basic
Batch - batch
BBcode - bbcode, shortcode
Bicep - bicep
Birb - birb
Bison - bison
BNF - bnf, rbnf
Brainfuck - brainfuck
BrightScript - brightscript
Bro - bro
BSL (1C:Enterprise) - bsl, oscript
C - c
C# - csharp, cs, dotnet
C++ - cpp
CFScript - cfscript, cfc
ChaiScript - chaiscript
CIL - cil
Clojure - clojure
CMake - cmake
COBOL - cobol
CoffeeScript - coffeescript, coffee
Concurnas - concurnas, conc
Content-Security-Policy - csp
Cooklang - cooklang
Coq - coq
Crystal - crystal
CSS Extras - css-extras
CSV - csv
CUE - cue
Cypher - cypher
D - d
Dart - dart
DataWeave - dataweave
DAX - dax
Dhall - dhall
Diff - diff
Django/Jinja2 - django, jinja2
DNS zone file - dns-zone-file, dns-zone
Docker - docker, dockerfile
DOT (Graphviz) - dot, gv
EBNF - ebnf
EditorConfig - editorconfig
Eiffel - eiffel
EJS - ejs, eta
Elixir - elixir
Elm - elm
Embedded Lua templating - etlua
ERB - erb
Erlang - erlang
Excel Formula - excel-formula, xlsx, xls
F# - fsharp
Factor - factor
False - false
Firestore security rules - firestore-security-rules
Flow - flow
Fortran - fortran
FreeMarker Template Language - ftl
GameMaker Language - gml, gamemakerlanguage
GAP (CAS) - gap
G-code - gcode
GDScript - gdscript
GEDCOM - gedcom
gettext - gettext, po
Gherkin - gherkin
Git - git
GLSL - glsl
GN - gn, gni
GNU Linker Script - linker-script, ld
Go - go
Go module - go-module, go-mod
Gradle - gradle
GraphQL - graphql
Groovy - groovy
Haml - haml
Handlebars - handlebars, hbs, mustache
Haskell - haskell, hs
Haxe - haxe
HCL - hcl
HLSL - hlsl
Hoon - hoon
HTTP - http
HTTP Public-Key-Pins - hpkp
HTTP Strict-Transport-Security - hsts
IchigoJam - ichigojam
Icon - icon
ICU Message Format - icu-message-format
Idris - idris, idr
.ignore - ignore, gitignore, hgignore, npmignore
Inform 7 - inform7
Ini - ini
Io - io
J - j
Java - java
JavaDoc - javadoc
JavaDoc-like - javadoclike
Java stack trace - javastacktrace
Jexl - jexl
Jolie - jolie
JQ - jq
JSDoc - jsdoc
JS Extras - js-extras
JSON - json, webmanifest
JSON5 - json5
JSONP - jsonp
JS stack trace - jsstacktrace
JS Templates - js-templates
Julia - julia
Keepalived Configure - keepalived
Keyman - keyman
Kotlin - kotlin, kt, kts
KuMir (КуМир) - kumir, kum
Kusto - kusto
LaTeX - latex, tex, context
Latte - latte
Less - less
LilyPond - lilypond, ly
Liquid - liquid
Lisp - lisp, emacs, elisp, emacs-lisp
LiveScript - livescript
LLVM IR - llvm
Log file - log
LOLCODE - lolcode
Lua - lua
Magma (CAS) - magma
Makefile - makefile
Markdown - markdown, md
Markup templating - markup-templating
Mata - mata
MATLAB - matlab
MAXScript - maxscript
MEL - mel
Mermaid - mermaid
METAFONT - metafont
Mizar - mizar
MongoDB - mongodb
Monkey - monkey
MoonScript - moonscript, moon
N1QL - n1ql
N4JS - n4js, n4jsd
Nand To Tetris HDL - nand2tetris-hdl
Naninovel Script - naniscript, nani
NASM - nasm
NEON - neon
Nevod - nevod
nginx - nginx
Nim - nim
Nix - nix
NSIS - nsis
Objective-C - objectivec, objc
OCaml - ocaml
Odin - odin
OpenCL - opencl
OpenQasm - openqasm, qasm
Oz - oz
PARI/GP - parigp
Parser - parser
Pascal - pascal, objectpascal
Pascaligo - pascaligo
PATROL Scripting Language - psl
PC-Axis - pcaxis, px
PeopleCode - peoplecode, pcode
Perl - perl
PHP - php
PHPDoc - phpdoc
PHP Extras - php-extras
PlantUML - plant-uml, plantuml
PL/SQL - plsql
PowerQuery - powerquery, pq, mscript
PowerShell - powershell
Processing - processing
Prolog - prolog
PromQL - promql
.properties - properties
Protocol Buffers - protobuf
Pug - pug
Puppet - puppet
Pure - pure
PureBasic - purebasic, pbfasm
PureScript - purescript, purs
Python - python, py
Q# - qsharp, qs
Q (kdb+ database) - q
QML - qml
Qore - qore
R - r
Racket - racket, rkt
Razor C# - cshtml, razor
React JSX - jsx
React TSX - tsx
Reason - reason
Regex - regex
Rego - rego
Ren'py - renpy, rpy
ReScript - rescript, res
reST (reStructuredText) - rest
Rip - rip
Roboconf - roboconf
Robot Framework - robotframework, robot
Ruby - ruby, rb
Rust - rust
SAS - sas
Sass (Sass) - sass
Sass (Scss) - scss
Scala - scala
Scheme - scheme
Shell session - shell-session, sh-session, shellsession
Smali - smali
Smalltalk - smalltalk
Smarty - smarty
SML - sml, smlnj
Solidity (Ethereum) - solidity, sol
Solution file - solution-file, sln
Soy (Closure Template) - soy
SPARQL - sparql, rq
Splunk SPL - splunk-spl
SQF: Status Quo Function (Arma 3) - sqf
SQL - sql
Squirrel - squirrel
Stan - stan
Stata Ado - stata
Structured Text (IEC 61131-3) - iecst
Stylus - stylus
SuperCollider - supercollider, sclang
Swift - swift
Systemd configuration file - systemd
T4 templating - t4-templating
T4 Text Templates (C#) - t4-cs, t4
T4 Text Templates (VB) - t4-vb
TAP - tap
Tcl - tcl
Template Toolkit 2 - tt2
Textile - textile
TOML - toml
Tremor - tremor, trickle, troy
Turtle - turtle, trig
Twig - twig
TypeScript - typescript, ts
TypoScript - typoscript, tsconfig
UnrealScript - unrealscript, uscript, uc
UO Razor Script - uorazor
URI - uri, url
V - v
Vala - vala
VB.Net - vbnet
Velocity - velocity
Verilog - verilog
VHDL - vhdl
vim - vim
Visual Basic - visual-basic, vb, vba
WarpScript - warpscript
WebAssembly - wasm
Web IDL - web-idl, webidl
WGSL - wgsl
Wiki markup - wiki
Wolfram language - wolfram, mathematica, nb, wl
Wren - wren
Xeora - xeora, xeoracube
XML doc (.net) - xml-doc
Xojo (REALbasic) - xojo
XQuery - xquery
YAML - yaml, yml
YANG - yang
Zig - zig
 */