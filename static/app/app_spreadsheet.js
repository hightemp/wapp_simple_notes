// import Spreadsheet from "./speadsheet.js";

export function fnCreateSpeadsheet(sID)
{
    var oEl = $(`#${sID}`);

    var saveIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTc3MTc3MDkyOTg4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI2NzgiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTIxMy4zMzMzMzMgMTI4aDU5Ny4zMzMzMzRhODUuMzMzMzMzIDg1LjMzMzMzMyAwIDAgMSA4NS4zMzMzMzMgODUuMzMzMzMzdjU5Ny4zMzMzMzRhODUuMzMzMzMzIDg1LjMzMzMzMyAwIDAgMS04NS4zMzMzMzMgODUuMzMzMzMzSDIxMy4zMzMzMzNhODUuMzMzMzMzIDg1LjMzMzMzMyAwIDAgMS04NS4zMzMzMzMtODUuMzMzMzMzVjIxMy4zMzMzMzNhODUuMzMzMzMzIDg1LjMzMzMzMyAwIDAgMSA4NS4zMzMzMzMtODUuMzMzMzMzeiBtMzY2LjkzMzMzNCAxMjhoMzQuMTMzMzMzYTI1LjYgMjUuNiAwIDAgMSAyNS42IDI1LjZ2MTE5LjQ2NjY2N2EyNS42IDI1LjYgMCAwIDEtMjUuNiAyNS42aC0zNC4xMzMzMzNhMjUuNiAyNS42IDAgMCAxLTI1LjYtMjUuNlYyODEuNmEyNS42IDI1LjYgMCAwIDEgMjUuNi0yNS42ek0yMTMuMzMzMzMzIDIxMy4zMzMzMzN2NTk3LjMzMzMzNGg1OTcuMzMzMzM0VjIxMy4zMzMzMzNIMjEzLjMzMzMzM3ogbTEyOCAwdjI1NmgzNDEuMzMzMzM0VjIxMy4zMzMzMzNoODUuMzMzMzMzdjI5OC42NjY2NjdhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMS00Mi42NjY2NjcgNDIuNjY2NjY3SDI5OC42NjY2NjdhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMS00Mi42NjY2NjctNDIuNjY2NjY3VjIxMy4zMzMzMzNoODUuMzMzMzMzek0yNTYgMjEzLjMzMzMzM2g4NS4zMzMzMzMtODUuMzMzMzMzeiBtNDI2LjY2NjY2NyAwaDg1LjMzMzMzMy04NS4zMzMzMzN6IG0wIDU5Ny4zMzMzMzR2LTEyOEgzNDEuMzMzMzMzdjEyOEgyNTZ2LTE3MC42NjY2NjdhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMSA0Mi42NjY2NjctNDIuNjY2NjY3aDQyNi42NjY2NjZhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMSA0Mi42NjY2NjcgNDIuNjY2NjY3djE3MC42NjY2NjdoLTg1LjMzMzMzM3ogbTg1LjMzMzMzMyAwaC04NS4zMzMzMzMgODUuMzMzMzMzek0zNDEuMzMzMzMzIDgxMC42NjY2NjdIMjU2aDg1LjMzMzMzM3oiIHAtaWQ9IjI2NzkiIGZpbGw9IiMyYzJjMmMiPjwvcGF0aD48L3N2Zz4='
    var previewEl = document.createElement('img')
        previewEl.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjIxMzI4NTkxMjQzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjU2NjMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyIDE4Ny45MDRhNDM1LjM5MiA0MzUuMzkyIDAgMCAwLTQxOC41NiAzMTUuNjQ4IDQzNS4zMjggNDM1LjMyOCAwIDAgMCA4MzcuMTIgMEE0MzUuNDU2IDQzNS40NTYgMCAwIDAgNTEyIDE4Ny45MDR6TTUxMiAzMjBhMTkyIDE5MiAwIDEgMSAwIDM4NCAxOTIgMTkyIDAgMCAxIDAtMzg0eiBtMCA3Ni44YTExNS4yIDExNS4yIDAgMSAwIDAgMjMwLjQgMTE1LjIgMTE1LjIgMCAwIDAgMC0yMzAuNHpNMTQuMDggNTAzLjQ4OEwxOC41NiA0ODUuNzZsNC44NjQtMTYuMzg0IDQuOTI4LTE0Ljg0OCA4LjA2NC0yMS41NjggNC4wMzItOS43OTIgNC43MzYtMTAuODggOS4zNDQtMTkuNDU2IDEwLjc1Mi0yMC4wOTYgMTIuNjA4LTIxLjMxMkE1MTEuNjE2IDUxMS42MTYgMCAwIDEgNTEyIDExMS4xMDRhNTExLjQ4OCA1MTEuNDg4IDAgMCAxIDQyNC41MTIgMjI1LjY2NGwxMC4yNCAxNS42OGMxMS45MDQgMTkuMiAyMi41OTIgMzkuMTA0IDMyIDU5Ljc3NmwxMC40OTYgMjQuOTYgNC44NjQgMTMuMTg0IDYuNCAxOC45NDQgNC40MTYgMTQuODQ4IDQuOTkyIDE5LjM5Mi0zLjIgMTIuODY0LTMuNTg0IDEyLjgtNi40IDIwLjA5Ni00LjQ4IDEyLjYwOC00Ljk5MiAxMi45MjhhNTExLjM2IDUxMS4zNiAwIDAgMS0xNy4yOCAzOC40bC0xMi4wMzIgMjIuNC0xMS45NjggMjAuMDk2QTUxMS41NTIgNTExLjU1MiAwIDAgMSA1MTIgODk2YTUxMS40ODggNTExLjQ4OCAwIDAgMS00MjQuNDQ4LTIyNS42bC0xMS4zMjgtMTcuNTM2YTUxMS4yMzIgNTExLjIzMiAwIDAgMS0xOS44NC0zNS4wMDhMNTMuMzc2IDYxMS44NGwtOC42NC0xOC4yNC0xMC4xMTItMjQuMTI4LTcuMTY4LTE5LjY0OC04LjMyLTI2LjYyNC0yLjYyNC05Ljc5Mi0yLjQ5Ni05LjkyeiIgcC1pZD0iNTY2NCI+PC9wYXRoPjwvc3ZnPg=='
    previewEl.width = 16
    previewEl.height = 16

    var oOptions = {
        mode: 'edit', // edit | read
        showToolbar: true,
        showGrid: true,
        showContextmenu: true,
        extendToolbar: {
            left: [
                {
                    tip: 'Paste CSV',
                    icon: saveIcon,
                    onClick: (data, sheet) => {
                        navigator.clipboard.readText().then(() => {
                            // Papa.parse(csvString)
                            // console.log('click save button：', data, sheet)
                        })
                    }
                }
            ],
            right: [
                {
                    tip: 'Preview',
                    el: previewEl,
                    onClick: (data, sheet) => {
                        // console.log('click preview button：', data)
                    }
                }
            ],
        },
        view: {
            height: () => oEl[0].clientHeight,
            width: () => oEl[0].clientWidth,
        },
        row: {
            len: 1000,
            height: 20,
        },
        col: {
            len: 26,
            width: 100,
            indexWidth: 60,
            minWidth: 60,
        },
        style: {
            bgcolor: '#ffffff',
            align: 'left',
            valign: 'middle',
            textwrap: false,
            strike: false,
            underline: false,
            color: '#0a0a0a',
            font: {
                name: 'Arial',
                size: 8,
                bold: false,
                italic: false,
            },
        },
    }

    const oSS = Spreadsheet.spreadsheet(
            `#${sID}`,
            oOptions
        )
        .loadData({})

    oSS.validate()

    return oSS;
}