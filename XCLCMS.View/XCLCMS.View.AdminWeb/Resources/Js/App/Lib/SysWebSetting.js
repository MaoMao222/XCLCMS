/// <reference path="../../../common.d.ts" />
define(["Lib/Common", "Lib/UserControl"], function (common, userControl) {
    var app;
    app.SysWebSettingList = {
        Init: function () {
            var _this = this;
            $("#btnUpdate").on("click", function () {
                return _this.Update();
            });
            $("#btnDel").on("click", function () {
                return _this.Del();
            });
        },
        /**
         * 返回已选择的value数组
         */
        GetSelectValue: function () {
            var selectVal = $(".XCLTableCheckAll").val();
            var ids = selectVal.split(',');
            if (selectVal && selectVal !== "" && ids.length > 0) {
                return ids;
            }
            else {
                return null;
            }
        },
        /**
         * 打开配置信息【修改】页面
         */
        Update: function () {
            var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
            if (ids && ids.length === 1) {
                var query = {
                    handletype: "update",
                    SysWebSettingID: ids[0]
                };
                var url = XJ.Url.AddParam($btn.attr("href"), query);
                $btn.attr("href", url);
                return true;
            }
            else {
                art.dialog.tips("请选择一条记录进行修改操作！");
                return false;
            }
        },
        /**
         * 删除配置信息
         */
        Del: function () {
            var ids = this.GetSelectValue();
            if (!ids || ids.length == 0) {
                art.dialog.tips("请至少选择一条记录进行操作！");
                return false;
            }
            art.dialog.confirm("您确定要删除此信息吗？", function () {
                var request = XCLCMSWebApi.CreateRequest();
                request.Body = ids;
                $.XGoAjax({
                    target: $("#btnDel")[0],
                    ajax: {
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysWebSetting/Delete",
                        contentType: "application/json",
                        data: JSON.stringify(request),
                        type: "POST"
                    }
                });
            }, function () {
            });
            return false;
        }
    };
    app.SysWebSettingAdd = {
        Init: function () {
            var _this = this;
            _this.InitValidator();
            //商户号下拉框初始化
            userControl.MerchantSelect.Init({
                merchantIDObj: $("#txtMerchantID"),
                merchantAppIDObj: $("#txtMerchantAppID")
            });
            $("#btnDel").on("click", function () {
                return _this.Del();
            });
        },
        /**
         * 表单验证初始化
         */
        InitValidator: function () {
            var validator = $("form:first").validate({
                rules: {
                    txtKeyName: {
                        required: true,
                        XCLCustomRemote: function () {
                            return {
                                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysWebSetting/IsExistKeyName",
                                data: function () {
                                    var request = XCLCMSWebApi.CreateRequest();
                                    request.Body = {};
                                    request.Body.KeyName = $("#txtKeyName").val();
                                    request.Body.SysWebSettingID = $("#SysWebSettingID").val();
                                    return request;
                                }
                            };
                        }
                    }
                }
            });
            common.BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!common.CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({ target: $("#btnSave")[0] });
            });
        },
        /**
         * 删除配置
         */
        Del: function () {
            art.dialog.confirm("您确定要删除此信息吗？", function () {
                var request = XCLCMSWebApi.CreateRequest();
                request.Body = [$("#SysWebSettingID").val()];
                $.XGoAjax({
                    target: $("#btnDel")[0],
                    ajax: {
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysWebSetting/Delete",
                        contentType: "application/json",
                        data: JSON.stringify(request),
                        type: "POST"
                    }
                });
            });
            return false;
        }
    };
    return app;
});
//# sourceMappingURL=SysWebSetting.js.map