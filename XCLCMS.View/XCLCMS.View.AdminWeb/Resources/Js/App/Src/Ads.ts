/// <reference path="../../../common.d.ts" />

import common from "./Common";
import userControl from "./UserControl";

/**
 * 广告位管理
 * @type type
 */
let app: IAnyPropObject = {};

/**
 * 广告位列表
 * @type type
 */
app.AdsList = {
    Init: function () {
        let _this = this;
        $("#btnUpdate").on("click", function () {
            return _this.Update();
        });
        $("#btnDel").on("click", function () {
            return _this.Del();
        })
    },
    /**
     * 返回已选择的value数组
     */
    GetSelectValue: function () {
        let selectVal = $(".XCLTableCheckAll").val();
        let ids = selectVal.split(',');
        if (selectVal && selectVal !== "" && ids.length > 0) {
            return ids;
        } else {
            return null;
        }
    },
    /**
     * 打开广告位【修改】页面
     */
    Update: function () {
        let $btn = $("#btnUpdate"), ids = this.GetSelectValue();
        if (ids && ids.length === 1) {
            let query = {
                handletype: "update",
                AdsID: ids[0]
            }

            let url = XJ.Url.AddParam($btn.attr("href"), query);
            $btn.attr("href", url);
            return true;
        } else {
            art.dialog.tips("请选择一条记录进行修改操作！");
            return false;
        }
    },
    /**
     * 删除广告位
     */
    Del: function () {
        let ids = this.GetSelectValue();
        if (!ids || ids.length == 0) {
            art.dialog.tips("请至少选择一条记录进行操作！");
            return false;
        }

        art.dialog.confirm("您确定要删除此信息吗？", function () {
            let request = XCLCMSWebApi.CreateRequest();
            request.Body = ids;

            $.XGoAjax({
                target: $("#btnDel")[0],
                ajax: {
                    url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Ads/Delete",
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

/**
 * 广告位添加与修改页
 */
app.AdsAdd = {
    /**
    * 输入元素
    */
    Elements: {
        Init: function () {
        }
    },
    Init: function () {
        let _this = this;
        _this.Elements.Init();
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
        let validator = $("form:first").validate({
            rules: {
                txtTitle: {
                    required: true
                },
                txtCode: {
                    required: true,
                    XCLCustomRemote: function () {
                        return {
                            url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Ads/IsExistCode",
                            data: function () {
                                let request = XCLCMSWebApi.CreateRequest();
                                request.Body = {};
                                request.Body.Code = $("input[name='txtCode']").val();
                                request.Body.AdsID = $("input[name='AdsID']").val();
                                return request;
                            }
                        };
                    }
                },
                txtEmail: "email"
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
     * 删除广告位
     */
    Del: function () {
        art.dialog.confirm("您确定要删除此信息吗？", function () {
            let request = XCLCMSWebApi.CreateRequest();
            request.Body = [$("#AdsID").val()];

            $.XGoAjax({
                target: $("#btnDel")[0],
                ajax: {
                    url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Ads/Delete",
                    contentType: "application/json",
                    data: JSON.stringify(request),
                    type: "POST"
                }
            });
        });
        return false;
    }
}
export default app;