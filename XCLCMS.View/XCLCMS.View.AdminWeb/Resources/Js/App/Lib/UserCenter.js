define(["Lib/Common"], function (common) {
    var app = {};

    /**
     * 个人资料
     */
    app.UserInfo = {
        Init: function () {
            var _this = this;
            _this.InitValidator();
        },
        InitValidator: function () {
            var validator = $("#userBaseInfoForm").validate({
                rules: {
                    txtEmail: "email",
                    selSexType: { required: true }
                }
            });
            common.BindLinkButtonEvent("click", $("#btnSaveUserInfo"), function () {
                if (!common.CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({ target: $("#btnSaveUserInfo")[0] });
            });
        }
    };

    return app;
});