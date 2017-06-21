/// <reference path="../../../common.d.ts" />
define(["Lib/Common"], function (common) {
    let app: IAnyPropObject;

    /**
     * 个人资料
     */
    app.UserInfo = {
        Elements: {
            userBaseInfoForm: null,
            Init: function () {
                this.userBaseInfoForm = $("#userBaseInfoForm");
            }
        },
        Init: function () {
            var _this = this;
            _this.Elements.Init();
            _this.InitValidator();
        },
        InitValidator: function () {
            var _this = this;
            var validator = this.Elements.userBaseInfoForm.validate({
                rules: {
                    txtEmail: "email",
                    selSexType: { required: true }
                }
            });
            common.BindLinkButtonEvent("click", $("#btnSaveUserInfo"), function () {
                if (!common.CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({
                    target: $("#btnSaveUserInfo")[0]
                });
            });
        }
    };

    /**
     * 修改密码
     */
    app.ChangePwd = {
        Elements: {
            passwordForm: null,
            Init: function () {
                this.passwordForm = $("#passwordForm");
            }
        },
        Init: function () {
            var _this = this;
            _this.Elements.Init();
            _this.InitValidator();
        },
        InitValidator: function () {
            var _this = this;
            var validator = this.Elements.passwordForm.validate({
                rules: {
                    txtOldPwd: { required: true },
                    txtNewPwd: { required: true },
                    txtNewPwd0: { required: true, equalTo: "#txtNewPwd" }
                }
            });
            common.BindLinkButtonEvent("click", $("#btnSavePassword"), function () {
                if (!common.CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({
                    target: $("#btnSavePassword")[0]
                });
            });
        }
    };

    /**
     * 修改商户信息
     */
    app.ChangeMerchant = {
        Elements: {
            merchantInfoForm: null,
            Init: function () {
                this.merchantInfoForm = $("#merchantInfoForm");
            }
        },
        Init: function () {
            var _this = this;
            _this.Elements.Init();
            _this.InitValidator();
        },
        InitValidator: function () {
            var _this = this;
            var validator = this.Elements.merchantInfoForm.validate({
                rules: {
                    txtEmail: "email"
                }
            });
            common.BindLinkButtonEvent("click", $("#btnSaveMerchant"), function () {
                if (!common.CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({
                    target: $("#btnSaveMerchant")[0]
                });
            });
        }
    };

    return app;
});