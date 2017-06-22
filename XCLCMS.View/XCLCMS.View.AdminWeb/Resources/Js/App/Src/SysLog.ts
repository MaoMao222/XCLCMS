/// <reference path="../../../common.d.ts" />

/*
* 系统日志
*/
let app: IAnyPropObject = {};

app.SysLogList = {
    Init: function () {
        var _this = this;
        $(".XCLCMSOverFlow").readmore({ collapsedHeight: 80 });
        $(".clearLogMenuItem").on("click", function () {
            _this.ClearLog($(this));
        });
    },
    ClearLog: function ($menuItem: any) {
        var data = $.parseJSON($menuItem.attr("xcl-data"));
        art.dialog.confirm("您确定要清空【" + data.txt + "】的所有日志信息吗？", function () {
            $.XGoAjax({
                ajax: {
                    url: XCLCMSPageGlobalConfig.RootURL + "SysLog/ClearSubmit",
                    data: { dateType: data.val }, type: "POST"
                }
            });
        });
    }
};

export default app;