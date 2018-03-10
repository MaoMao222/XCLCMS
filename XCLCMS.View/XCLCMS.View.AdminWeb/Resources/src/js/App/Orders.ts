/// <reference path="common.d.ts" />

import common from "./Common";
import userControl from "./UserControl";

/**
 * 订单列表
 */
class OrdersList {
    /**
     * 初始化
     */
    Init(): void {
        let _this = this;
        $("#btnUpdate").on("click", function () {
            return _this.Update();
        });
        $("#btnDel").on("click", function () {
            return _this.Del();
        });
    };
    /**
     * 返回已选择的value数组
     */
    GetSelectValue(): Array<string> | null {
        let selectVal = $(".XCLTableCheckAll").val();
        let ids = selectVal.split(',');
        if (selectVal && selectVal !== "" && ids.length > 0) {
            return ids;
        } else {
            return null;
        }
    };
    /**
     * 打开订单【修改】页面
     */
    Update(): boolean {
        let $btn = $("#btnUpdate"), ids = this.GetSelectValue();
        if (ids && ids.length === 1) {
            let query = {
                handletype: "update",
                OrderID: ids[0]
            }

            let url = XJ.Url.UpdateParam($btn.attr("href"), query);
            $btn.attr("href", url);
            return true;
        } else {
            art.dialog.tips("请选择一条记录进行修改操作！");
            return false;
        }
    };
    /**
     * 删除订单
     */
    Del(): boolean {
        let ids = this.GetSelectValue();
        if (!ids || ids.length == 0) {
            art.dialog.tips("请至少选择一条记录进行操作！");
            return false;
        }

        art.dialog.confirm("您确定要删除此信息吗？", function () {
            $.XGoAjax({
                target: $("#btnDel")[0],
                ajax: {
                    url: XCLCMSPageGlobalConfig.RootURL + "Orders/DelByIDSubmit",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    type: "POST"
                }
            });
        }, function () {
        });

        return false;
    }
}

/**
 * 订单添加与修改页
 */
class OrdersAdd {
    /**
    * 输入元素
    */
    Elements: any = {
        Init: function () {
        }
    }
    /**
     * 初始化
     */
    Init(): void {
        let _this = this;
        _this.Elements.Init();
        _this.InitValidator();

        //商户号下拉框初始化
        userControl.MerchantSelect.Init({
            merchantIDObj: $("#txtMerchantID"),
            merchantAppIDObj: $("#txtMerchantAppID")
        });
    }
    /**
     * 表单验证初始化
     */
    InitValidator(): void {
        let validator = $("form:first").validate({
            rules: {
                txtFK_ProductID: {
                    required: true
                }
            }
        });
        common.BindLinkButtonEvent("click", $("#btnSave"), function () {
            if (!common.CommonFormValid(validator)) {
                return false;
            }
            $.XGoAjax({ target: $("#btnSave")[0] });
        });
        common.BindLinkButtonEvent("click", $("#btnPayed"), function () {
            art.dialog.confirm("您确定要将此订单设置为已支付吗？", function () {
                $.XGoAjax({
                    target: $("#btnPayed")[0],
                    ajax: {
                        url: XCLCMSPageGlobalConfig.RootURL + "Orders/UpdatePayStatus",
                        contentType: "application/json",
                        data: JSON.stringify({
                            OrderID: $("#OrderID").val(),
                            FK_MerchantID: $("#txtFK_MerchantID").val(),
                            PayStatus: 'DON',
                            Version: $("#txtOrderVersion").val()
                        }),
                        type: "POST"
                    }
                });
            }, function () {
            });
        });
        common.BindLinkButtonEvent("click", $("#btnCancel"), function () {
            art.dialog.confirm("您确定要取消此订单吗？", function () {
                $.XGoAjax({
                    target: $("#btnCancel")[0],
                    ajax: {
                        url: XCLCMSPageGlobalConfig.RootURL + "Orders/UpdatePayStatus",
                        contentType: "application/json",
                        data: JSON.stringify({
                            OrderID: $("#OrderID").val(),
                            FK_MerchantID: $("#txtFK_MerchantID").val(),
                            PayStatus: 'CEL',
                            Version: $("#txtOrderVersion").val()
                        }),
                        type: "POST"
                    }
                });
            }, function () {
            });
        });
    }
}

class App {
    constructor() {
        this.OrdersAdd = new OrdersAdd();
        this.OrdersList = new OrdersList();
    }
    OrdersList: OrdersList;
    OrdersAdd: OrdersAdd;
}

export default new App();