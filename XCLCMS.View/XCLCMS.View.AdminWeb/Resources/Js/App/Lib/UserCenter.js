define(["Lib/Common"], function (common) {
    var app = {};

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
                    target: $("#btnSaveUserInfo")[0],
                    ajax: {
                        url: _this.Elements.userBaseInfoForm.attr("action"),
                        data: _this.Elements.userBaseInfoForm.serialize()
                    }
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
                    target: $("#btnSavePassword")[0],
                    ajax: {
                        url: _this.Elements.passwordForm.attr("action"),
                        data: _this.Elements.passwordForm.serialize()
                    }
                });
            });
        }
    };

    return app;
});