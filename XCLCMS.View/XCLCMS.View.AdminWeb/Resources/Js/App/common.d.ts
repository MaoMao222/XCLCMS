/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
interface IAnyPropObject {
    [name: string]: any
}

interface IEasyUI {
    treegrid: any;
    tabs: any;
    numberbox: any;
}

interface JQueryStatic {
    XGoAjax: ((ops?: IAnyPropObject) => any) & any;
    XCLTableList: (ops?: IAnyPropObject) => any;
}

interface JQuery extends IEasyUI {
    validate: (ops?: IAnyPropObject) => any;
    readmore: (ops?: IAnyPropObject) => any;
}

interface HTMLElement {
    reset: () => void;
}

declare var XJ: IAnyPropObject;
declare var XCLCMSWebApi: IAnyPropObject;
declare var XCLCMSPageGlobalConfig: IAnyPropObject;
declare var art: IAnyPropObject;
declare var CKEDITOR: IAnyPropObject;
declare var WdatePicker: (...args: any[]) => any;
declare var ckeditorCN: any;