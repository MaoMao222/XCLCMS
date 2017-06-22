interface IAnyPropObject {
    [name: string]: any
}

declare var $: IAnyPropObject & ((str: string) => any);
declare var jQuery: IAnyPropObject & ((str: string) => any);
declare var XJ: IAnyPropObject;
declare var XCLCMSWebApi: IAnyPropObject;
declare var XCLCMSPageGlobalConfig: IAnyPropObject;
declare var art: IAnyPropObject;
declare var CKEDITOR: IAnyPropObject;
declare var WdatePicker: (...args: any[]) => any;
declare var ckeditorCN: any;