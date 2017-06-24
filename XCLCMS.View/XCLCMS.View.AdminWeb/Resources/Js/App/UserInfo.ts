/// <reference path="common.d.ts" />

import common from "./Common";
import userControl from "./UserControl";
/**
 * 用户管理
 * @type type
 */
let app: IAnyPropObject = {};

/**
 * 用户信息列表
 * @type type
 */
app.UserInfoList = {
    Init: function () {
        var _this = this;
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
        var selectVal = $(".XCLTableCheckAll").val();
        var ids = selectVal.split(',');
        if (selectVal && selectVal !== "" && ids.length > 0) {
            return ids;
        } else {
            return null;
        }
    },
    /**
     * 打开用户信息【修改】页面
     */
    Update: function () {
        var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
        if (ids && ids.length === 1) {
            var query = {
                handletype: "update",
                UserInfoID: ids[0]
            }

            var url = XJ.Url.AddParam($btn.attr("href"), query);
            $btn.attr("href", url);
            return true;
        } else {
            art.dialog.tips("请选择一条记录进行修改操作！");
            return false;
        }
    },
    /**
     * 删除用户信息
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
                    url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "UserInfo/Delete",
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
 * 用户信息添加与修改页
 */
app.UserAdd = {
    /**
    * 输入元素
    */
    Elements: {
        //用户所属于的角色输入框对象
        txtUserRoleIDs: null,
        Init: function () {
            this.txtUserRoleIDs = $("#txtUserRoleIDs");
        }
    },
    Init: function () {
        var _this = this;
        _this.Elements.Init();
        _this.InitValidator();

        $("#btnDel").on("click", function () {
            return _this.Del();
        });

        //初始化角色选择框
        _this.CreateSysRoleTree(_this.Elements.txtUserRoleIDs);

        //初始化商户选择框
        userControl.MerchantSelect.Init({
            merchantIDObj: $("#txtMerchantID"),
            merchantAppIDObj: $("#txtMerchantAppID"),
            merchantIDSelectCallback: function () {
                _this.CreateSysRoleTree(_this.Elements.txtUserRoleIDs);
            }
        });
    },
    /**
    * 创建选择角色的combotree
    */
    CreateSysRoleTree: function ($obj: any) {
        var _this = this;
        if (!$obj) {
            return;
        }

        var request = XCLCMSWebApi.CreateRequest();
        request.Body = {};
        request.Body.MerchantID = $("input[name='txtMerchantID']").val();

        $obj.combotree({
            url: XCLCMSPageGlobalConfig.WebAPIServiceURL + 'SysRole/GetAllJsonForEasyUITree',
            queryParams: request,
            method: 'get',
            checkbox: true,
            onlyLeafCheck: true,
            lines: true,
            multiple: true,
            loadFilter: function (data: IAnyPropObject) {
                if (data) {
                    return data.Body || [];
                }
            }
        });

        _this.Elements.txtUserRoleIDs.combotree("setValues", (_this.Elements.txtUserRoleIDs.attr("xcl-data-value") || "").split(','));
    },
    /**
     * 表单验证初始化
     */
    InitValidator: function () {
        var validator = $("form:first").validate({
            rules: {
                txtUserName: {
                    required: true,
                    XCLCustomRemote: function () {
                        return {
                            url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "UserInfo/IsExistUserName",
                            data: function () {
                                var request = XCLCMSWebApi.CreateRequest();
                                request.Body = $("#txtUserName").val();
                                return request;
                            }
                        };
                    },
                    AccountNO: true
                },
                txtEmail: "email",
                txtPwd1: { equalTo: "#txtPwd" },
                selUserState: { required: true },
                selSexType: { required: true },
                selUserType: { required: true }
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
     * 删除用户
     */
    Del: function () {
        art.dialog.confirm("您确定要删除此信息吗？", function () {
            var request = XCLCMSWebApi.CreateRequest();
            request.Body = [$("#UserInfoID").val()];

            $.XGoAjax({
                target: $("#btnDel")[0],
                ajax: {
                    url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "UserInfo/Delete",
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