/// <reference path="common.d.ts" />

import common from "./Common";
import userControl from "./UserControl";

/**
 * 列表
 */
class KeyValueInfoList {
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
     * 打开【修改】页面
     */
    Update(): boolean {
        let $btn = $("#btnUpdate"), ids = this.GetSelectValue();
        if (ids && ids.length === 1) {
            let query = {
                handletype: "update",
                KeyValueInfoID: ids[0]
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
     * 删除
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
                    url: XCLCMSPageGlobalConfig.RootURL + "KeyValueInfo/DelByIDSubmit",
                    data: JSON.stringify(ids),
                    contentType: "application/json",
                    type: "POST"
                }
            });
        }, function () {
        });

        return false;
    }
}

/**
 * 添加与修改页
 */
class KeyValueInfoAdd {
    /**
* 输入元素
*/
    Elements: any = {
        selKeyValueInfoType: null,//分类
        Init: function () {
            this.selKeyValueInfoType = $("#selKeyValueInfoType");
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

        //分类
        var initKeyValueInfoTypeTree = function () {
            _this.Elements.selKeyValueInfoType.combotree({
                url: XCLCMSPageGlobalConfig.RootURL + "SysDic/GetEasyUITreeByCondition",
                queryParams: {
                    MerchantID: $("input[name='txtMerchantID']").val()
                },
                method: 'get',
                checkbox: true,
                onlyLeafCheck: true,
                loadFilter: function (data: any) {
                    if (data) {
                        return data.Body || [];
                    }
                }
            });
        };
        initKeyValueInfoTypeTree();

        //商户号下拉框初始化
        userControl.MerchantSelect.Init({
            merchantIDObj: $("#txtMerchantID"),
            merchantAppIDObj: $("#txtMerchantAppID"),
            merchantIDSelectCallback: function () {
                initKeyValueInfoTypeTree();
            }
        });
    }
    /**
 * 表单验证初始化
 */
    InitValidator(): void {
        let validator = $("form:first").validate({
            rules: {
                txtTitle: {
                    required: true
                },
                txtCode: {
                    XCLCustomRemote: function () {
                        return {
                            url: XCLCMSPageGlobalConfig.RootURL + "KeyValueInfo/IsExistCodeSubmit",
                            data: function () {
                                return {
                                    Code: $("input[name='txtCode']").val(),
                                    KeyValueInfoID: $("input[name='KeyValueInfoID']").val()
                                };
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
    }
}

class App {
    constructor() {
        this.KeyValueInfoAdd = new KeyValueInfoAdd();
        this.KeyValueInfoList = new KeyValueInfoList();
    }
    KeyValueInfoList: KeyValueInfoList;
    KeyValueInfoAdd: KeyValueInfoAdd;
}

export default new App();