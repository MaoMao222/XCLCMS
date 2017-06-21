/// <reference path="../../../common.d.ts" />
define([],function () {
    var app = {
        /**
         * 验证插件错误的class
         * @type String
         */
        XCLValidErrorClassName: "XCLValidError",
        /**
         * 页面初始化时加载
         * @returns {undefined}
         */
        Init: function () {
            var _this = this;

            $.XCLTableList();

            //缓存清理
            $("a[xcl-sysdiccode='ClearCache']").on("click", function () {
                _this.ClearCache();
                return false;
            });
            //垃圾数据清理
            $("a[xcl-sysdiccode='ClearRubbishData']").on("click", function () {
                _this.ClearRubbishData();
                return false;
            });
        },
        /**
         * 公共验证方法
         * @param {type} validator
         * @returns {unresolved}
         */
        CommonFormValid: function (validator) {
            var _this = this;
            var result = validator.form();
            if (!result) {
                $("." + _this.XCLValidErrorClassName).filter(":visible:first").focus();
            }
            return result;
        },
        /**
         * 给linkbutton绑定事件（仅在LinkButton可用时执行事件）
         * @param {type} eventName
         * @param {type} $btn
         * @param {type} callback
         * @returns {undefined}
         */
        BindLinkButtonEvent: function (eventName, $btn, callback) {
            eventName = eventName || "click";
            $btn = $btn || $("#btnSave");
            $btn.on(eventName, function () {
                if (!($btn.linkbutton("options").disabled)) {
                    callback();
                }
                return false;
            });
        },
        /**
         * 枚举值字母转换为Description
         */
        EnumConvert: function (name, val) {
            var result = "";
            name = name + "Enum";
            if (XCLCMSPageGlobalConfig.EnumConfig) {
                var valJson = XCLCMSPageGlobalConfig.EnumConfig[name];
                if (valJson) {
                    result = valJson[val] || "";
                }
            }
            return result;
        },
        /**
         * 自动生成code
         */
        CreateAutoCode: function () {
            var data = {};
            $.XGoAjax({
                ajax: {
                    url: XCLCMSPageGlobalConfig.RootURL + "Common/CreateAutoCode",
                    type: "GET",
                    data: { v: Math.random() },
                    async: false
                },
                postSuccess: function (ops, d) {
                    data = d;
                }
            });
            return data ? data.Message : "";
        },
        /**
        * 缓存清理
        */
        ClearCache: function () {
            $.XGoAjax({
                target: $("a[xcl-sysdiccode='ClearCache']")[0],
                ajax: {
                    url: XCLCMSPageGlobalConfig.RootURL + "Common/ClearCache",
                    data: { v: Math.random() },
                    type: "POST"
                },
                templateOption: {
                    beforeSendMsg: "正在清理缓存中，请稍后..."
                }
            });
        },
        /**
        * 垃圾数据清理
        */
        ClearRubbishData: function () {
            $.XGoAjax({
                target: $("a[xcl-sysdiccode='ClearRubbishData']")[0],
                ajax: {
                    url: XCLCMSPageGlobalConfig.RootURL + "Common/ClearRubbishData",
                    data: { v: Math.random() },
                    type: "POST"
                },
                templateOption: {
                    beforeSendMsg: "正在清理垃圾数据，请稍后..."
                }
            });
        }
    };
    return app;
});