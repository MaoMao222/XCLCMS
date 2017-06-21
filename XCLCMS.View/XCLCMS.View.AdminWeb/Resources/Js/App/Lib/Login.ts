/// <reference path="../../../common.d.ts" />
define(["Lib/Common"], function (common) {
    /**
    * 后台登录
    */
    var app = {
        Init: function () {
            var _this = this;
            _this.InitValidator();
            $("#btnReset").on("click", function () {
                _this.Reset();
                return false;
            });
        },
        InitValidator: function () {
            var validator = $("form:first").validate({
                rules: {
                    txtUserName: { required: true },
                    txtPwd: { required: true },
                    txtValidCode: { required: true }
                }
            });

            var login = function () {
                if (!common.CommonFormValid(validator)) {
                    return false;
                }
                var $btnLogin = $("#btnLogin");
                if ($btnLogin.hasClass("submitting")) {
                    return false;
                }
                $.ajax({
                    type: "POST",
                    dataType: "JSON",
                    url: XCLCMSPageGlobalConfig.RootURL + "Login/LogonSubmit",
                    data: $btnLogin.closest("form").serialize(),
                    beforeSend: function () {
                        $btnLogin.html("登录中...").addClass("submitting");
                    },
                    success: function (data) {
                        $btnLogin.html("登录").removeClass("submitting");
                        if (data.IsSuccess) {
                            art.dialog.tips("登录成功，正在跳转中......", 500000);
                            location.href = XCLCMSPageGlobalConfig.RootURL + "Default/Index";
                        } else {
                            art.dialog({
                                time: 1,
                                icon: 'error',
                                content: data.Message
                            });
                        }
                    },
                    complete: function () {
                        $btnLogin.html("登录").removeClass("submitting");
                    }
                });
            }

            $("#btnLogin").on("click", function () {
                login();
                return false;
            });

            $("body").keypress(function (event) {
                if (event.keyCode == 13) {
                    login();
                }
            });
        },
        Reset: function () {
            $("form")[0].reset();
        }
    };
    return app;
});