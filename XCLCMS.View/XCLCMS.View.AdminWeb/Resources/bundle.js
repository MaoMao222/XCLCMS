/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_0__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_1__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_5__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_LOCAL_MODULE_0__ = (function (require, exports) {
    "use strict";
    exports.__esModule = true;
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
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_LOCAL_MODULE_1__ = (function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /// <reference path="../../../common.d.ts" />
    /**
     * 用户控件
     */
    var app = {};
    /**
     * 选择商户控件
     */
    app.MerchantSelect = {
        Init: function (ops) {
            var dfs = {
                merchantIDObj: null,
                merchantAppIDObj: null,
                merchantIDSelectCallback: null
            };
            ops = $.extend({}, dfs, ops);
            //查询商户应用
            var initMerchantAppSelect = function () {
                if (!ops.merchantAppIDObj || ops.merchantAppIDObj.length == 0) {
                    return;
                }
                var req = XCLCMSWebApi.CreateRequest();
                req.Body = {
                    FK_MerchantID: $("input[name='" + ops.merchantIDObj.attr("id") + "']").val()
                };
                ops.merchantAppIDObj.combobox({
                    url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "MerchantApp/AllTextValueList",
                    queryParams: req,
                    valueField: 'Value',
                    textField: 'Text',
                    editable: false,
                    method: 'get',
                    loadFilter: function (data) {
                        return data.Body || [];
                    }
                });
            };
            initMerchantAppSelect();
            //查询商户
            var request = XCLCMSWebApi.CreateRequest();
            request.Body = {};
            ops.merchantIDObj.combobox({
                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Merchant/AllTextValueList",
                queryParams: request,
                valueField: 'Value',
                textField: 'Text',
                editable: false,
                method: 'get',
                loadFilter: function (data) {
                    return data.Body || [];
                },
                onChange: function (newValue, oldValue) {
                    //回调
                    ops.merchantIDSelectCallback && ops.merchantIDSelectCallback();
                    //获取商户应用
                    initMerchantAppSelect();
                }
            });
        }
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__, __WEBPACK_LOCAL_MODULE_1__], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Common_1, UserControl_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * 广告位管理
     * @type type
     */
    var app = {};
    /**
     * 广告位列表
     * @type type
     */
    app.AdsList = {
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
         * 打开广告位【修改】页面
         */
        Update: function () {
            var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
            if (ids && ids.length === 1) {
                var query = {
                    handletype: "update",
                    AdsID: ids[0]
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
         * 删除广告位
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
            var _this = this;
            _this.Elements.Init();
            _this.InitValidator();
            //商户号下拉框初始化
            UserControl_1["default"].MerchantSelect.Init({
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
                    txtTitle: {
                        required: true
                    },
                    txtCode: {
                        required: true,
                        XCLCustomRemote: function () {
                            return {
                                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Ads/IsExistCode",
                                data: function () {
                                    var request = XCLCMSWebApi.CreateRequest();
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
            Common_1["default"].BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!Common_1["default"].CommonFormValid(validator)) {
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
                var request = XCLCMSWebApi.CreateRequest();
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
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__, __WEBPACK_LOCAL_MODULE_1__], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Common_2, UserControl_2) {
    "use strict";
    exports.__esModule = true;
    /**
    * 文章
    */
    var app = {};
    app.ArticleList = {
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
         * 打开文章信息【修改】页面
         */
        Update: function () {
            var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
            if (ids && ids.length === 1) {
                var query = {
                    handletype: "update",
                    ArticleID: ids[0]
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
         * 删除文章信息
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
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Article/Delete",
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
    app.ArticleAdd = {
        /**
        * 元素
        */
        Elements: {
            divContentNote: null,
            btnRandomCount: null,
            selArticleType: null,
            selArticleContentType: null,
            selAuthorName: null,
            selFromInfo: null,
            Init: function () {
                this.divContentNote = $("#divContentNote");
                this.btnRandomCount = $("#btnRandomCount");
                this.selArticleType = $("#selArticleType");
                this.selArticleContentType = $("#selArticleContentType");
                this.selAuthorName = $("#selAuthorName");
                this.selFromInfo = $("#selFromInfo");
            }
        },
        /**
        *  模板
        */
        HTMLTemps: {
            divContentNoteTemp: "divContentNoteTemp"
        },
        Init: function () {
            var _this = this;
            _this.Elements.Init();
            _this.InitValidator();
            //初始化编辑器
            CKEDITOR.replace('txtContents');
            //随机生成点赞数
            Common_2["default"].BindLinkButtonEvent("click", _this.Elements.btnRandomCount, function () {
                var r1 = XJ.Random.Range(100, 800), r2 = XJ.Random.Range(0, 100), r3 = XJ.Random.Range(0, 10);
                $("#txtGoodCount").numberbox('setValue', r1);
                $("#txtMiddleCount").numberbox('setValue', r2);
                $("#txtBadCount").numberbox('setValue', r3);
                $("#txtViewCount").numberbox('setValue', r1 + r2 + r3 + XJ.Random.Range(10, 100));
                $("#txtHotCount").numberbox('setValue', (r1 + r2 + r3) * XJ.Random.Range(1, 5));
            });
            //文章分类
            var initArticleTypeTree = function () {
                var request = XCLCMSWebApi.CreateRequest();
                request.Body = {};
                request.Body.MerchantID = $("input[name='txtMerchantID']").val();
                _this.Elements.selArticleType.combotree({
                    url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysDic/GetEasyUITreeByCondition",
                    queryParams: request,
                    method: 'get',
                    checkbox: true,
                    onlyLeafCheck: true,
                    loadFilter: function (data) {
                        if (data) {
                            return data.Body || [];
                        }
                    }
                });
            };
            initArticleTypeTree();
            //combox初始值
            var defaultValue = this.Elements.selAuthorName.attr("defaultValue");
            if (!XJ.Data.IsUndefined(defaultValue)) {
                this.Elements.selAuthorName.combobox('setValue', defaultValue);
            }
            defaultValue = this.Elements.selFromInfo.attr("defaultValue");
            if (!XJ.Data.IsUndefined(defaultValue)) {
                this.Elements.selFromInfo.combobox('setValue', defaultValue);
            }
            //商户号下拉框初始化
            UserControl_2["default"].MerchantSelect.Init({
                merchantIDObj: $("#txtMerchantID"),
                merchantAppIDObj: $("#txtMerchantAppID"),
                merchantIDSelectCallback: function () {
                    initArticleTypeTree();
                }
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
                    txtCode: {
                        XCLCustomRemote: function () {
                            var request = XCLCMSWebApi.CreateRequest();
                            request.Body = {};
                            request.Body.Code = $("#txtCode").val();
                            request.Body.ArticleID = $("#ArticleID").val();
                            return {
                                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Article/IsExistCode",
                                data: request
                            };
                        }
                    },
                    txtTitle: { required: true }
                }
            });
            Common_2["default"].BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!Common_2["default"].CommonFormValid(validator)) {
                    return false;
                }
                for (var instance in CKEDITOR.instances) {
                    CKEDITOR.instances[instance].updateElement();
                }
                $.XGoAjax({ target: $("#btnSave")[0] });
            });
        },
        /**
         * 删除文章信息
         */
        Del: function () {
            art.dialog.confirm("您确定要删除此信息吗？", function () {
                var request = XCLCMSWebApi.CreateRequest();
                request.Body = [$("#ArticleID").val()];
                $.XGoAjax({
                    target: $("#btnDel")[0],
                    ajax: {
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Article/Delete",
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
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__, __WEBPACK_LOCAL_MODULE_1__], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Common_3, UserControl_3) {
    "use strict";
    exports.__esModule = true;
    /**
     * 评论管理
     * @type type
     */
    var app = {};
    /**
     * 评论列表
     * @type type
     */
    app.CommentsList = {
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
         * 打开评论【修改】页面
         */
        Update: function () {
            var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
            if (ids && ids.length === 1) {
                var query = {
                    handletype: "update",
                    CommentsID: ids[0]
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
         * 删除评论
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
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Comments/Delete",
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
     * 评论添加与修改页
     */
    app.CommentsAdd = {
        /**
        * 输入元素
        */
        Elements: {
            Init: function () {
            }
        },
        Init: function () {
            var _this = this;
            _this.Elements.Init();
            _this.InitValidator();
            //商户号下拉框初始化
            UserControl_3["default"].MerchantSelect.Init({
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
                    txtUserName: {
                        required: true
                    },
                    txtEmail: "email"
                }
            });
            Common_3["default"].BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!Common_3["default"].CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({ target: $("#btnSave")[0] });
            });
        },
        /**
         * 删除评论
         */
        Del: function () {
            art.dialog.confirm("您确定要删除此信息吗？", function () {
                var request = XCLCMSWebApi.CreateRequest();
                request.Body = [$("#CommentsID").val()];
                $.XGoAjax({
                    target: $("#btnDel")[0],
                    ajax: {
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Comments/Delete",
                        contentType: "application/json",
                        data: JSON.stringify(request),
                        type: "POST"
                    }
                });
            });
            return false;
        }
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__], __WEBPACK_LOCAL_MODULE_5__ = (function (require, exports, Common_4) {
    "use strict";
    exports.__esModule = true;
    /**
     * Easyui相关
     */
    var app = {
        /**
         * 绑定数据时，将枚举转为描述信息
         */
        EnumToDescription: function (value, row, index) {
            return Common_4["default"].EnumConvert(this.field, value);
        }
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__, __WEBPACK_LOCAL_MODULE_1__], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Common_5, UserControl_4) {
    "use strict";
    exports.__esModule = true;
    /**
     * 友情链接管理
     * @type type
     */
    var app = {};
    /**
     * 友情链接列表
     * @type type
     */
    app.FriendLinksList = {
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
         * 打开友情链接【修改】页面
         */
        Update: function () {
            var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
            if (ids && ids.length === 1) {
                var query = {
                    handletype: "update",
                    FriendLinkID: ids[0]
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
         * 删除友情链接
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
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "FriendLinks/Delete",
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
     * 友情链接添加与修改页
     */
    app.FriendLinksAdd = {
        /**
        * 输入元素
        */
        Elements: {
            Init: function () {
            }
        },
        Init: function () {
            var _this = this;
            _this.Elements.Init();
            _this.InitValidator();
            //商户号下拉框初始化
            UserControl_4["default"].MerchantSelect.Init({
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
                    txtTitle: {
                        required: true,
                        XCLCustomRemote: function () {
                            return {
                                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "FriendLinks/IsExistTitle",
                                data: function () {
                                    var request = XCLCMSWebApi.CreateRequest();
                                    request.Body = {};
                                    request.Body.Title = $("input[name='txtTitle']").val();
                                    request.Body.FriendLinkID = $("input[name='FriendLinkID']").val();
                                    request.Body.MerchantID = $("input[name='txtMerchantID']").val();
                                    request.Body.MerchantAppID = $("input[name='txtMerchantAppID']").val();
                                    return request;
                                }
                            };
                        }
                    },
                    txtEmail: "email"
                }
            });
            Common_5["default"].BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!Common_5["default"].CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({ target: $("#btnSave")[0] });
            });
        },
        /**
         * 删除友情链接
         */
        Del: function () {
            art.dialog.confirm("您确定要删除此信息吗？", function () {
                var request = XCLCMSWebApi.CreateRequest();
                request.Body = [$("#FriendLinkID").val()];
                $.XGoAjax({
                    target: $("#btnDel")[0],
                    ajax: {
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "FriendLinks/Delete",
                        contentType: "application/json",
                        data: JSON.stringify(request),
                        type: "POST"
                    }
                });
            });
            return false;
        }
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * 首页
     * @type type
     */
    var app = {
        /**
         * 页面加载时执行
         * @returns {undefined}
         */
        Init: function () {
        }
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Common_6) {
    "use strict";
    exports.__esModule = true;
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
                if (!Common_6["default"].CommonFormValid(validator)) {
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
                        }
                        else {
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
            };
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
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    exports.__esModule = true;
    //主模板js
    var app = {
        Init: function () {
            var $DivMenuTabs = $("#DivMenuTabs");
            var $menuItems = $DivMenuTabs.find("[xcl-remark]");
            var tabs = $DivMenuTabs.tabs('tabs');
            var href = location.href;
            //选项卡处理
            for (var i = 0; i < tabs.length; i++) {
                //鼠标划过，选中选项卡
                tabs[i].panel('options').tab.unbind().bind('mouseenter', { index: i }, function (e) {
                    $DivMenuTabs.tabs('select', e.data.index);
                });
                //无菜单按钮，隐藏选项卡
                if (tabs[i].panel().find(".easyui-linkbutton").length == 0) {
                    tabs[i].panel('options').tab.hide();
                }
            }
            $menuItems.each(function () {
                var remarkVal = $(this).attr("xcl-remark") || "";
                if (!remarkVal)
                    return true;
                var obj = {};
                try {
                    obj = $.parseJSON(remarkVal);
                }
                catch (e) { }
                ;
                //选中当前菜单
                if (obj.MatchRegex) {
                    var reg = new RegExp(obj.MatchRegex, "ig");
                    if (reg.test(href)) {
                        $(this).addClass("XCLRedBolder");
                        //选中当前菜单的父菜单
                        if (obj.ParentNode) {
                            var $parentNode = $DivMenuTabs.find("[xcl-sysdiccode='" + obj.ParentNode + "']");
                            var title = $parentNode.attr("xcl-tabTitle");
                            $DivMenuTabs.tabs('select', title);
                            $("#divPagePath").html("XCLCMS->" + title + "->" + $(this).text());
                        }
                    }
                }
            });
            ////鼠标移出菜单时，回到当前选中的菜单
            //$DivMenuTabs.on("mouseleave", function () {
            //    var $currentItem = $(this).find(".XCLRedBolder");
            //    if (!($currentItem.is(":visible"))) {
            //        var index = $currentItem.closest(".panel").index();
            //        $DivMenuTabs.tabs('select', index);
            //    }
            //});
        },
        /**
        * 向form标签中追加附加信息
        */
        AppendToForm: function (val) {
            $("form").append(val);
        }
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__, __WEBPACK_LOCAL_MODULE_1__], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Common_7, UserControl_5) {
    "use strict";
    exports.__esModule = true;
    /**
     * 商户管理
     * @type type
     */
    var app = {};
    /**
     * 商户信息列表
     * @type type
     */
    app.MerchantList = {
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
         * 打开商户信息【修改】页面
         */
        Update: function () {
            var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
            if (ids && ids.length === 1) {
                var query = {
                    handletype: "update",
                    MerchantID: ids[0]
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
         * 删除商户信息
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
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Merchant/Delete",
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
     * 商户信息添加与修改页
     */
    app.MerchantAdd = {
        Init: function () {
            var _this = this;
            _this.InitValidator();
            $("#btnDel").on("click", function () {
                return _this.Del();
            });
            $("#txtRegisterTime").on("click", function () {
                WdatePicker({ dateFmt: 'yyyy-MM-dd' });
                return false;
            });
        },
        /**
         * 表单验证初始化
         */
        InitValidator: function () {
            var validator = $("form:first").validate({
                rules: {
                    txtMerchantName: {
                        required: true,
                        XCLCustomRemote: function () {
                            var request = XCLCMSWebApi.CreateRequest();
                            request.Body = {};
                            request.Body.MerchantName = $("#txtMerchantName").val();
                            request.Body.MerchantID = $("#MerchantID").val();
                            return {
                                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Merchant/IsExistMerchantName",
                                data: request
                            };
                        }
                    },
                    txtEmail: "email",
                    selMerchantState: { required: true }
                }
            });
            Common_7["default"].BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!Common_7["default"].CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({ target: $("#btnSave")[0] });
            });
        },
        /**
         * 删除商户
         */
        Del: function () {
            art.dialog.confirm("您确定要删除此信息吗？", function () {
                var request = XCLCMSWebApi.CreateRequest();
                request.Body = [$("#MerchantID").val()];
                $.XGoAjax({
                    target: $("#btnDel")[0],
                    ajax: {
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Merchant/Delete",
                        contentType: "application/json",
                        data: JSON.stringify(request),
                        type: "POST"
                    }
                });
            });
            return false;
        }
    };
    /**
    * 商户应用信息列表
    */
    app.MerchantAppList = {
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
         * 打开商户应用信息【修改】页面
         */
        Update: function () {
            var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
            if (ids && ids.length === 1) {
                var query = {
                    handletype: "update",
                    MerchantAppID: ids[0]
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
         * 删除商户应用信息
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
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "MerchantApp/Delete",
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
    app.MerchantAppAdd = {
        Init: function () {
            var _this = this;
            _this.InitValidator();
            //商户号下拉框初始化
            UserControl_5["default"].MerchantSelect.Init({
                merchantIDObj: $("#txtMerchantID")
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
                    txtMerchantAppName: {
                        required: true,
                        XCLCustomRemote: function () {
                            var request = XCLCMSWebApi.CreateRequest();
                            request.Body = {};
                            request.Body.MerchantAppName = $("#txtMerchantAppName").val();
                            request.Body.MerchantAppID = $("#MerchantAppID").val();
                            return {
                                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "MerchantApp/IsExistMerchantAppName",
                                data: request
                            };
                        }
                    },
                    txtAppKey: {
                        required: true
                    }
                }
            });
            Common_7["default"].BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!Common_7["default"].CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({ target: $("#btnSave")[0] });
            });
        },
        /**
         * 删除商户应用
         */
        Del: function () {
            art.dialog.confirm("您确定要删除此信息吗？", function () {
                var request = XCLCMSWebApi.CreateRequest();
                request.Body = [$("#MerchantAppID").val()];
                $.XGoAjax({
                    target: $("#btnDel")[0],
                    ajax: {
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "MerchantApp/Delete",
                        contentType: "application/json",
                        data: JSON.stringify(request),
                        type: "POST"
                    }
                });
            });
            return false;
        }
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__, __WEBPACK_LOCAL_MODULE_1__, __WEBPACK_LOCAL_MODULE_5__], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Common_8, UserControl_6, EasyUI_1) {
    "use strict";
    exports.__esModule = true;
    /**
      * 系统字典库
      */
    var app = {};
    app.SysDicList = {
        /**
         * 界面元素
         */
        Elements: {
            //tree右键菜单
            menu_SysDic: null,
            //tree右键菜单_刷新节点
            menu_SysDic_refresh: null,
            //tree右键菜单_添加节点
            menu_SysDic_add: null,
            //tree右键菜单_修改节点
            menu_SysDic_edit: null,
            //tree右键菜单_删除节点
            menu_SysDic_del: null,
            Init: function () {
                this.menu_SysDic = $("#menu_SysDic");
                this.menu_SysDic_refresh = $("#menu_SysDic_refresh");
                this.menu_SysDic_add = $("#menu_SysDic_add");
                this.menu_SysDic_edit = $("#menu_SysDic_edit");
                this.menu_SysDic_del = $("#menu_SysDic_del");
            }
        },
        /**
         * 数据列表jq对象
         */
        TreeObj: null,
        /**
         * 页面初始化
         */
        Init: function () {
            var _this = this;
            _this.Elements.Init();
            _this.TreeObj = $('#tableSysDicList');
            //加载列表树
            var request = XCLCMSWebApi.CreateRequest();
            request.Body = 0;
            _this.TreeObj.treegrid({
                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + 'SysDic/GetList',
                queryParams: request,
                onBeforeExpand: function (node) {
                    _this.TreeObj.treegrid('options').queryParams = (function () {
                        var request = XCLCMSWebApi.CreateRequest();
                        request.Body = node.SysDicID;
                        return request;
                    })();
                },
                method: 'get',
                idField: 'SysDicID',
                treeField: 'DicName',
                rownumbers: true,
                loadFilter: function (data) {
                    if (data) {
                        data = data.Body || [];
                        for (var i = 0; i < data.length; i++) {
                            data[i].state = (data[i].IsLeaf === 1) ? "" : "closed";
                        }
                    }
                    return data;
                },
                columns: [[
                        { field: 'SysDicID', title: 'ID', width: '5%' },
                        { field: 'ParentID', title: '父ID', width: '5%' },
                        { field: 'NodeLevel', title: '层级', width: '2%' },
                        { field: 'MerchantName', title: '所属商户', width: '10%' },
                        { field: 'DicName', title: '字典名', width: '20%' },
                        { field: 'DicValue', title: '字典值', width: '7%' },
                        { field: 'Code', title: '唯一标识', width: '10%' },
                        { field: 'Sort', title: '排序号', width: '5%' },
                        { field: 'FK_FunctionID', title: '所属功能ID', width: '5%' },
                        { field: 'RecordState', title: '记录状态', formatter: EasyUI_1["default"].EnumToDescription, width: '5%' },
                        { field: 'Remark', title: '备注', width: '5%' },
                        { field: 'CreateTime', title: '创建时间', width: '5%' },
                        { field: 'CreaterName', title: '创建者名', width: '5%' },
                        { field: 'UpdateTime', title: '更新时间', width: '5%' },
                        { field: 'UpdaterName', title: '更新者名', width: '5%' }
                    ]],
                onContextMenu: function (e, row) {
                    e.preventDefault();
                    _this.Elements.menu_SysDic_add.show();
                    _this.Elements.menu_SysDic_del.show();
                    _this.Elements.menu_SysDic_edit.show();
                    if (row.NodeLevel < 2) {
                        _this.Elements.menu_SysDic_add.hide();
                        _this.Elements.menu_SysDic_del.hide();
                        _this.Elements.menu_SysDic_edit.hide();
                    }
                    else if (row.NodeLevel == 2) {
                        _this.Elements.menu_SysDic_del.hide();
                        _this.Elements.menu_SysDic_edit.hide();
                    }
                    $(this).treegrid('select', row.SysDicID);
                    _this.Elements.menu_SysDic.menu('show', {
                        left: e.pageX,
                        top: e.pageY
                    });
                }
            });
            //刷新节点
            _this.Elements.menu_SysDic_refresh.on("click", function () {
                var ids = _this.GetSelectedIds();
                _this.TreeObj.treegrid("reload", ids[0]);
            });
            //添加子项
            _this.Elements.menu_SysDic_add.on("click", function () {
                _this.Add();
            });
            //修改
            _this.Elements.menu_SysDic_edit.on("click", function () {
                _this.Update();
            });
            //删除
            _this.Elements.menu_SysDic_del.on("click", function () {
                _this.Del();
            });
        },
        /**
         * 获取已选择的行对象数组
         */
        GetSelectRows: function () {
            return this.TreeObj.treegrid("getSelections");
        },
        /**
         * 获取已选择的行id数组
         */
        GetSelectedIds: function () {
            var ids = [];
            var rows = this.GetSelectRows();
            if (rows && rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].SysDicID);
                }
            }
            return ids;
        },
        /**
         * 打开【添加】页面
         */
        Add: function () {
            var _this = this;
            var ids = _this.GetSelectedIds();
            art.dialog.open(XCLCMSPageGlobalConfig.RootURL + 'SysDic/Add?sysDicId=' + ids[0], {
                title: '添加子节点', width: 1100, height: 600, close: function () {
                    //叶子节点，刷新其父节点，非叶子节点刷新自己即可
                    var row = _this.TreeObj.treegrid("find", ids[0]);
                    _this.TreeObj.treegrid("reload", row.IsLeaf == 1 ? row.ParentID : row.SysDicID);
                }
            });
        },
        /**
         * 打开【修改】页面
         */
        Update: function () {
            var _this = this;
            var ids = _this.GetSelectedIds();
            art.dialog.open(XCLCMSPageGlobalConfig.RootURL + 'SysDic/Add?handletype=update&sysDicId=' + ids[0], {
                title: '修改节点', width: 1100, height: 600, close: function () {
                    var parent = _this.TreeObj.treegrid("getParent", ids[0]);
                    if (parent) {
                        _this.TreeObj.treegrid("reload", parent.SysDicID);
                    }
                    else {
                        _this.Refresh();
                    }
                }
            });
        },
        /**
         * 删除
         */
        Del: function () {
            var _this = this;
            var ids = _this.GetSelectedIds();
            art.dialog.confirm("您确定要删除此信息吗？", function () {
                var request = XCLCMSWebApi.CreateRequest();
                request.Body = ids;
                $.XGoAjax({
                    ajax: {
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysDic/Delete",
                        contentType: "application/json",
                        data: JSON.stringify(request),
                        type: "POST"
                    },
                    postSuccess: function (ops, data) {
                        if (data.IsSuccess) {
                            $.each(ids, function (idx, n) {
                                _this.TreeObj.treegrid("remove", n);
                            });
                        }
                    }
                });
            }, function () { });
        },
        /**
         * 刷新列表
         */
        Refresh: function () {
            this.TreeObj.treegrid("reload");
        }
    };
    app.SysDicAdd = {
        /**
        * 输入元素
        */
        Elements: {
            //字典所属功能输入框对象
            txtFunctionID: null,
            Init: function () {
                this.txtFunctionID = $("#txtFunctionID");
            }
        },
        /**
        * 界面初始化
        */
        Init: function () {
            var _this = this;
            _this.Elements.Init();
            _this.InitValidator();
            _this.CreateFunctionTree(_this.Elements.txtFunctionID);
            //商户号下拉框初始化
            UserControl_6["default"].MerchantSelect.Init({
                merchantIDObj: $("#txtMerchantID"),
                merchantAppIDObj: $("#txtMerchantAppID"),
                merchantIDSelectCallback: function () {
                    _this.CreateFunctionTree(_this.Elements.txtFunctionID);
                }
            });
        },
        /**
        * 创建功能模块的combotree
        */
        CreateFunctionTree: function ($obj) {
            var _this = this;
            if (!$obj) {
                return;
            }
            var isTxtFunctionID = ($obj == _this.Elements.txtFunctionID);
            var request = XCLCMSWebApi.CreateRequest();
            request.Body = {};
            request.Body.MerchantID = $("input[name='txtMerchantID']").val();
            $obj.combotree({
                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + 'SysFunction/GetAllJsonForEasyUITree',
                queryParams: request,
                method: 'get',
                checkbox: true,
                lines: true,
                multiple: (!isTxtFunctionID),
                loadFilter: function (data) {
                    if (data) {
                        return data.Body || [];
                    }
                },
                onBeforeSelect: function (node) {
                    //字典对应的功能只能选择一项
                    if (isTxtFunctionID && node.children) {
                        art.dialog.tips("只能选择叶子节点！");
                        $obj.combotree("clear");
                        return false;
                    }
                }
            });
        },
        InitValidator: function () {
            var validator = $("form:first").validate({
                rules: {
                    txtDicName: {
                        required: true,
                        XCLCustomRemote: function () {
                            var request = XCLCMSWebApi.CreateRequest();
                            request.Body = {};
                            request.Body.SysDicName = $("#txtDicName").val();
                            request.Body.ParentID = $("#ParentID").val();
                            request.Body.SysDicID = $("#SysDicID").val();
                            return {
                                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysDic/IsExistSysDicNameInSameLevel",
                                data: request
                            };
                        }
                    },
                    txtCode: {
                        XCLCustomRemote: function () {
                            var request = XCLCMSWebApi.CreateRequest();
                            request.Body = {};
                            request.Body.Code = $("#txtCode").val();
                            request.Body.SysDicID = $("#SysDicID").val();
                            return {
                                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysDic/IsExistSysDicCode",
                                data: request
                            };
                        }
                    }
                }
            });
            Common_8["default"].BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!Common_8["default"].CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({ target: $("#btnSave")[0] });
            });
        }
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__, __WEBPACK_LOCAL_MODULE_5__], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Common_9, EasyUI_2) {
    "use strict";
    exports.__esModule = true;
    var app = {};
    app.SysFunctionList = {
        /**
         * 界面元素
         */
        Elements: {
            //tree右键菜单
            menu_SysFunction: null,
            //tree右键菜单_刷新节点
            menu_SysFunction_refresh: null,
            //tree右键菜单_添加节点
            menu_SysFunction_add: null,
            //tree右键菜单_修改节点
            menu_SysFunction_edit: null,
            //tree右键菜单_删除节点
            menu_SysFunction_del: null,
            //tree右键菜单_清空子节点
            menu_SysFunction_delSub: null,
            Init: function () {
                this.menu_SysFunction = $("#menu_SysFunction");
                this.menu_SysFunction_refresh = $("#menu_SysFunction_refresh");
                this.menu_SysFunction_add = $("#menu_SysFunction_add");
                this.menu_SysFunction_edit = $("#menu_SysFunction_edit");
                this.menu_SysFunction_del = $("#menu_SysFunction_del");
                this.menu_SysFunction_delSub = $("#menu_SysFunction_delSub");
            }
        },
        /**
         * 数据列表jq对象
         */
        TreeObj: null,
        Init: function () {
            var _this = this;
            _this.Elements.Init();
            _this.TreeObj = $('#tableSysFunctionList');
            //加载列表树
            var request = XCLCMSWebApi.CreateRequest();
            request.Body = 0;
            _this.TreeObj.treegrid({
                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + 'SysFunction/GetList',
                queryParams: request,
                onBeforeExpand: function (node) {
                    _this.TreeObj.treegrid('options').queryParams = (function () {
                        var request = XCLCMSWebApi.CreateRequest();
                        request.Body = node.SysFunctionID;
                        return request;
                    })();
                },
                method: 'get',
                idField: 'SysFunctionID',
                treeField: 'FunctionName',
                rownumbers: true,
                loadFilter: function (data) {
                    if (data) {
                        data = data.Body || [];
                        for (var i = 0; i < data.length; i++) {
                            data[i].state = (data[i].IsLeaf === 1) ? "" : "closed";
                        }
                    }
                    return data;
                },
                columns: [[
                        { field: 'SysFunctionID', title: 'ID', width: '5%' },
                        { field: 'ParentID', title: '父ID', width: '5%' },
                        { field: 'FunctionName', title: '功能名', width: '20%' },
                        { field: 'Code', title: '功能标识', width: '20%' },
                        { field: 'Remark', title: '备注', width: '10%' },
                        { field: 'RecordState', title: '记录状态', formatter: EasyUI_2["default"].EnumToDescription, width: '5%' },
                        { field: 'CreateTime', title: '创建时间', width: '10%' },
                        { field: 'CreaterName', title: '创建者名', width: '5%' },
                        { field: 'UpdateTime', title: '更新时间', width: '10%' },
                        { field: 'UpdaterName', title: '更新者名', width: '5%' }
                    ]],
                onContextMenu: function (e, row) {
                    e.preventDefault();
                    _this.Elements.menu_SysFunction_del.show();
                    _this.Elements.menu_SysFunction_edit.show();
                    _this.Elements.menu_SysFunction_delSub.show();
                    if (row.ParentID == 0) {
                        //根节点隐藏部分菜单
                        _this.Elements.menu_SysFunction_del.hide();
                        _this.Elements.menu_SysFunction_edit.hide();
                    }
                    if (row.IsLeaf == 1) {
                        //叶子节点隐藏部分菜单
                        _this.Elements.menu_SysFunction_delSub.hide();
                    }
                    $(this).treegrid('select', row.SysFunctionID);
                    _this.Elements.menu_SysFunction.menu('show', {
                        left: e.pageX,
                        top: e.pageY
                    });
                }
            });
            //刷新节点
            _this.Elements.menu_SysFunction_refresh.on("click", function () {
                var ids = _this.GetSelectedIds();
                _this.TreeObj.treegrid("reload", ids[0]);
            });
            //添加子项
            _this.Elements.menu_SysFunction_add.on("click", function () {
                _this.Add();
            });
            //修改
            _this.Elements.menu_SysFunction_edit.on("click", function () {
                _this.Update();
            });
            //删除
            _this.Elements.menu_SysFunction_del.on("click", function () {
                _this.Del();
            });
            //清空子节点
            _this.Elements.menu_SysFunction_delSub.on("click", function () {
                _this.Clear();
            });
        },
        /**
         * 获取已选择的行对象数组
         */
        GetSelectRows: function () {
            return this.TreeObj.treegrid("getSelections");
        },
        /**
         * 获取已选择的行id数组
         */
        GetSelectedIds: function () {
            var ids = [];
            var rows = this.GetSelectRows();
            if (rows && rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].SysFunctionID);
                }
            }
            return ids;
        },
        /**
        * 打开添加页
        */
        Add: function () {
            var _this = this;
            var ids = _this.GetSelectedIds();
            art.dialog.open(XCLCMSPageGlobalConfig.RootURL + 'SysFunction/Add?sysFunctionId=' + ids[0], {
                title: '添加子节点', width: 800, height: 500, close: function () {
                    //叶子节点，刷新其父节点，非叶子节点刷新自己即可
                    var row = _this.TreeObj.treegrid("find", ids[0]);
                    _this.TreeObj.treegrid("reload", row.IsLeaf == 1 ? row.ParentID : row.SysFunctionID);
                }
            });
        },
        /**
         * 打开功能信息【修改】页面
         */
        Update: function () {
            var _this = this;
            var ids = _this.GetSelectedIds();
            art.dialog.open(XCLCMSPageGlobalConfig.RootURL + 'SysFunction/Add?handletype=update&sysFunctionId=' + ids[0], {
                title: '修改节点', width: 800, height: 500, close: function () {
                    var parent = _this.TreeObj.treegrid("getParent", ids[0]);
                    if (parent) {
                        _this.TreeObj.treegrid("reload", parent.SysFunctionID);
                    }
                    else {
                        _this.Refresh();
                    }
                }
            });
        },
        /**
         * 删除功能信息
         */
        Del: function () {
            var _this = this;
            var ids = _this.GetSelectedIds();
            art.dialog.confirm("您确定要删除此信息吗？", function () {
                var request = XCLCMSWebApi.CreateRequest();
                request.Body = ids;
                $.XGoAjax({
                    ajax: {
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysFunction/Delete",
                        contentType: "application/json",
                        data: JSON.stringify(request),
                        type: "POST"
                    },
                    postSuccess: function (ops, data) {
                        if (data.IsSuccess) {
                            $.each(ids, function (idx, n) {
                                _this.TreeObj.treegrid("remove", n);
                            });
                        }
                    }
                });
            }, function () { });
        },
        /**
         * 清空子节点
         */
        Clear: function () {
            var _this = this;
            var ids = _this.GetSelectedIds();
            art.dialog.confirm("您确定要清空此节点的所有子节点吗？", function () {
                var request = XCLCMSWebApi.CreateRequest();
                request.Body = ids[0];
                $.XGoAjax({
                    ajax: {
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysFunction/DelChild",
                        contentType: "application/json",
                        data: JSON.stringify(request),
                        type: "POST"
                    },
                    postSuccess: function () {
                        var parent = _this.TreeObj.treegrid("getParent", ids[0]);
                        if (parent) {
                            _this.TreeObj.treegrid("reload", parent.SysFunctionID);
                        }
                        else {
                            _this.Refresh();
                        }
                    }
                });
            }, function () {
            });
        },
        /**
         * 刷新列表
         */
        Refresh: function () {
            this.TreeObj.treegrid("reload");
        }
    };
    app.SysFunctionAdd = {
        Init: function () {
            var _this = this;
            _this.InitValidator();
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
                    txtFunctionName: {
                        required: true,
                        XCLCustomRemote: function () {
                            var request = XCLCMSWebApi.CreateRequest();
                            request.Body = {};
                            request.Body.FunctionName = $("#txtFunctionName").val();
                            request.Body.ParentID = $("#ParentID").val();
                            request.Body.SysFunctionID = $("#SysFunctionID").val();
                            return {
                                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysFunction/IsExistFunctionNameInSameLevel",
                                data: request
                            };
                        }
                    },
                    txtCode: {
                        XCLCustomRemote: function () {
                            var request = XCLCMSWebApi.CreateRequest();
                            request.Body = {};
                            request.Body.Code = $("#txtCode").val();
                            request.Body.SysFunctionID = $("#SysFunctionID").val();
                            return {
                                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysFunction/IsExistCode",
                                data: request
                            };
                        }
                    }
                }
            });
            Common_9["default"].BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!Common_9["default"].CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({ target: $("#btnSave")[0] });
            });
        }
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /*
    * 系统日志
    */
    var app = {};
    app.SysLogList = {
        Init: function () {
            var _this = this;
            $(".XCLCMSOverFlow").readmore({ collapsedHeight: 80 });
            $(".clearLogMenuItem").on("click", function () {
                _this.ClearLog($(this));
            });
        },
        ClearLog: function ($menuItem) {
            var data = $.parseJSON($menuItem.attr("xcl-data"));
            art.dialog.confirm("您确定要清空【" + data.txt + "】的所有日志信息吗？", function () {
                $.XGoAjax({
                    ajax: {
                        url: XCLCMSPageGlobalConfig.RootURL + "SysLog/ClearSubmit",
                        data: { dateType: data.val }, type: "POST"
                    }
                });
            });
        }
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__, __WEBPACK_LOCAL_MODULE_1__, __WEBPACK_LOCAL_MODULE_5__], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Common_10, UserControl_7, EasyUI_3) {
    "use strict";
    exports.__esModule = true;
    var app = {};
    app.SysRoleList = {
        /**
         * 界面元素
         */
        Elements: {
            //tree右键菜单
            menu_SysRole: null,
            //tree右键菜单_刷新节点
            menu_SysRole_refresh: null,
            //tree右键菜单_添加节点
            menu_SysRole_add: null,
            //tree右键菜单_修改节点
            menu_SysRole_edit: null,
            //tree右键菜单_删除节点
            menu_SysRole_del: null,
            Init: function () {
                this.menu_SysRole = $("#menu_SysRole");
                this.menu_SysRole_refresh = $("#menu_SysRole_refresh");
                this.menu_SysRole_add = $("#menu_SysRole_add");
                this.menu_SysRole_edit = $("#menu_SysRole_edit");
                this.menu_SysRole_del = $("#menu_SysRole_del");
            }
        },
        /**
         * 数据列表jq对象
         */
        TreeObj: null,
        Init: function () {
            var _this = this;
            _this.Elements.Init();
            _this.TreeObj = $('#tableSysRoleList');
            //加载列表树
            var request = XCLCMSWebApi.CreateRequest();
            request.Body = 0;
            _this.TreeObj.treegrid({
                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + 'SysRole/GetList',
                queryParams: request,
                onBeforeExpand: function (node) {
                    _this.TreeObj.treegrid('options').queryParams = (function () {
                        var request = XCLCMSWebApi.CreateRequest();
                        request.Body = node.SysRoleID;
                        return request;
                    })();
                },
                method: 'get',
                idField: 'SysRoleID',
                treeField: 'RoleName',
                rownumbers: true,
                loadFilter: function (data) {
                    if (data) {
                        data = data.Body || [];
                        for (var i = 0; i < data.length; i++) {
                            data[i].state = (data[i].IsLeaf === 1) ? "" : "closed";
                        }
                    }
                    return data;
                },
                columns: [[
                        { field: 'SysRoleID', title: 'ID', width: '5%' },
                        { field: 'ParentID', title: '父ID', width: '5%' },
                        { field: 'NodeLevel', title: '层级', width: '5%' },
                        { field: 'MerchantName', title: '所属商户', width: '5%' },
                        { field: 'RoleName', title: '角色名', width: '20%' },
                        { field: 'Weight', title: '权重', width: '5%' },
                        { field: 'Code', title: '角色标识', width: '10%' },
                        { field: 'Remark', title: '备注', width: '10%' },
                        { field: 'RecordState', title: '记录状态', formatter: EasyUI_3["default"].EnumToDescription, width: '5%' },
                        { field: 'CreateTime', title: '创建时间', width: '10%' },
                        { field: 'CreaterName', title: '创建者名', width: '5%' },
                        { field: 'UpdateTime', title: '更新时间', width: '10%' },
                        { field: 'UpdaterName', title: '更新者名', width: '5%' }
                    ]],
                onContextMenu: function (e, row) {
                    e.preventDefault();
                    _this.Elements.menu_SysRole_add.show();
                    _this.Elements.menu_SysRole_del.show();
                    _this.Elements.menu_SysRole_edit.show();
                    if (row.NodeLevel == 3) {
                        _this.Elements.menu_SysRole_add.hide();
                    }
                    else if (row.NodeLevel == 2) {
                        _this.Elements.menu_SysRole_del.hide();
                        _this.Elements.menu_SysRole_edit.hide();
                    }
                    else {
                        _this.Elements.menu_SysRole_add.hide();
                        _this.Elements.menu_SysRole_del.hide();
                        _this.Elements.menu_SysRole_edit.hide();
                    }
                    if (row.MerchantSystemType == 'SYS') {
                        _this.Elements.menu_SysRole_del.hide();
                    }
                    $(this).treegrid('select', row.SysRoleID);
                    _this.Elements.menu_SysRole.menu('show', {
                        left: e.pageX,
                        top: e.pageY
                    });
                }
            });
            //刷新节点
            _this.Elements.menu_SysRole_refresh.on("click", function () {
                var ids = _this.GetSelectedIds();
                _this.TreeObj.treegrid("reload", ids[0]);
            });
            //添加子项
            _this.Elements.menu_SysRole_add.on("click", function () {
                _this.Add();
            });
            //修改
            _this.Elements.menu_SysRole_edit.on("click", function () {
                _this.Update();
            });
            //删除
            _this.Elements.menu_SysRole_del.on("click", function () {
                _this.Del();
            });
        },
        /**
         * 获取已选择的行对象数组
         */
        GetSelectRows: function () {
            return this.TreeObj.treegrid("getSelections");
        },
        /**
         * 获取已选择的行id数组
         */
        GetSelectedIds: function () {
            var ids = [];
            var rows = this.GetSelectRows();
            if (rows && rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].SysRoleID);
                }
            }
            return ids;
        },
        /**
        * 打开添加页
        */
        Add: function () {
            var _this = this;
            var ids = _this.GetSelectedIds();
            art.dialog.open(XCLCMSPageGlobalConfig.RootURL + 'SysRole/Add?sysRoleId=' + ids[0], {
                title: '添加子节点', width: 1000, height: 600, close: function () {
                    //叶子节点，刷新其父节点，非叶子节点刷新自己即可
                    var row = _this.TreeObj.treegrid("find", ids[0]);
                    _this.TreeObj.treegrid("reload", row.IsLeaf == 1 ? row.ParentID : row.SysRoleID);
                }
            });
        },
        /**
         * 打开功能信息【修改】页面
         */
        Update: function () {
            var _this = this;
            var ids = _this.GetSelectedIds();
            art.dialog.open(XCLCMSPageGlobalConfig.RootURL + 'SysRole/Add?handletype=update&sysRoleId=' + ids[0], {
                title: '修改节点', width: 1000, height: 600, close: function () {
                    var parent = _this.TreeObj.treegrid("getParent", ids[0]);
                    if (parent) {
                        _this.TreeObj.treegrid("reload", parent.SysRoleID);
                    }
                    else {
                        _this.Refresh();
                    }
                }
            });
        },
        /**
         * 删除功能信息
         */
        Del: function () {
            var _this = this;
            var ids = _this.GetSelectedIds();
            art.dialog.confirm("您确定要删除此信息吗？", function () {
                var request = XCLCMSWebApi.CreateRequest();
                request.Body = ids;
                $.XGoAjax({
                    ajax: {
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysRole/Delete",
                        contentType: "application/json",
                        data: JSON.stringify(request),
                        type: "POST"
                    },
                    postSuccess: function (ops, data) {
                        if (data.IsSuccess) {
                            $.each(ids, function (idx, n) {
                                _this.TreeObj.treegrid("remove", n);
                            });
                        }
                    }
                });
            }, function () { });
        },
        /**
         * 刷新列表
         */
        Refresh: function () {
            this.TreeObj.treegrid("reload");
        }
    };
    app.SysRoleAdd = {
        /**
        * 输入元素
        */
        Elements: {
            //角色所拥有的功能输入框对象
            txtRoleFunction: null,
            Init: function () {
                this.txtRoleFunction = $("#txtRoleFunction");
            }
        },
        Init: function () {
            var _this = this;
            _this.Elements.Init();
            _this.InitValidator();
            //初始化功能选择树
            _this.CreateFunctionTree(_this.Elements.txtRoleFunction);
            //商户号下拉框初始化
            UserControl_7["default"].MerchantSelect.Init({
                merchantIDObj: $("#txtMerchantID"),
                merchantIDSelectCallback: function () {
                    _this.CreateFunctionTree(_this.Elements.txtRoleFunction);
                }
            });
        },
        /**
        * 创建功能模块的combotree
        */
        CreateFunctionTree: function ($obj) {
            var _this = this;
            if (!$obj) {
                return;
            }
            var request = XCLCMSWebApi.CreateRequest();
            request.Body = {};
            request.Body.MerchantID = $("input[name='txtMerchantID']").val();
            $obj.combotree({
                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + 'SysFunction/GetAllJsonForEasyUITree',
                queryParams: request,
                method: 'get',
                checkbox: true,
                lines: true,
                multiple: true,
                loadFilter: function (data) {
                    if (data) {
                        return data.Body || [];
                    }
                }
            });
            _this.Elements.txtRoleFunction.combotree("setValues", (_this.Elements.txtRoleFunction.attr("xcl-data-value") || "").split(','));
        },
        /**
         * 表单验证初始化
         */
        InitValidator: function () {
            var validator = $("form:first").validate({
                rules: {
                    txtRoleName: {
                        required: true,
                        XCLCustomRemote: {
                            url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysRole/IsExistRoleNameInSameLevel",
                            data: function () {
                                var request = XCLCMSWebApi.CreateRequest();
                                request.Body = {};
                                request.Body.RoleName = $("#txtRoleName").val();
                                request.Body.ParentID = $("#ParentID").val();
                                request.Body.SysRoleID = $("#SysRoleID").val();
                                return request;
                            }
                        }
                    },
                    txtCode: {
                        XCLCustomRemote: {
                            url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysRole/IsExistCode",
                            data: function () {
                                var request = XCLCMSWebApi.CreateRequest();
                                request.Body = {};
                                request.Body.Code = $("#txtCode").val();
                                request.Body.SysRoleID = $("#SysRoleID").val();
                                return request;
                            }
                        }
                    },
                    txtMerchantID: {
                        required: true
                    }
                }
            });
            Common_10["default"].BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!Common_10["default"].CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({ target: $("#btnSave")[0] });
            });
        }
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__, __WEBPACK_LOCAL_MODULE_1__], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Common_11, UserControl_8) {
    "use strict";
    exports.__esModule = true;
    var app = {};
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
            UserControl_8["default"].MerchantSelect.Init({
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
            Common_11["default"].BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!Common_11["default"].CommonFormValid(validator)) {
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
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__, __WEBPACK_LOCAL_MODULE_1__], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Common_12, UserControl_9) {
    "use strict";
    exports.__esModule = true;
    /**
     * 标签管理
     * @type type
     */
    var app = {};
    /**
     * 标签列表
     * @type type
     */
    app.TagsList = {
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
         * 打开标签【修改】页面
         */
        Update: function () {
            var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
            if (ids && ids.length === 1) {
                var query = {
                    handletype: "update",
                    TagsID: ids[0]
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
         * 删除标签
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
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Tags/Delete",
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
     * 标签添加与修改页
     */
    app.TagsAdd = {
        /**
        * 输入元素
        */
        Elements: {
            Init: function () {
            }
        },
        Init: function () {
            var _this = this;
            _this.Elements.Init();
            _this.InitValidator();
            //商户号下拉框初始化
            UserControl_9["default"].MerchantSelect.Init({
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
                    txtTagName: {
                        required: true,
                        XCLCustomRemote: function () {
                            return {
                                url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Tags/IsExistTagName",
                                data: function () {
                                    var request = XCLCMSWebApi.CreateRequest();
                                    request.Body = {};
                                    request.Body.TagName = $("input[name='txtTagName']").val();
                                    request.Body.TagsID = $("input[name='TagsID']").val();
                                    request.Body.MerchantID = $("input[name='txtMerchantID']").val();
                                    request.Body.MerchantAppID = $("input[name='txtMerchantAppID']").val();
                                    return request;
                                }
                            };
                        }
                    },
                    txtEmail: "email"
                }
            });
            Common_12["default"].BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!Common_12["default"].CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({ target: $("#btnSave")[0] });
            });
        },
        /**
         * 删除标签
         */
        Del: function () {
            art.dialog.confirm("您确定要删除此信息吗？", function () {
                var request = XCLCMSWebApi.CreateRequest();
                request.Body = [$("#TagsID").val()];
                $.XGoAjax({
                    target: $("#btnDel")[0],
                    ajax: {
                        url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Tags/Delete",
                        contentType: "application/json",
                        data: JSON.stringify(request),
                        type: "POST"
                    }
                });
            });
            return false;
        }
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Common_13) {
    "use strict";
    exports.__esModule = true;
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
            Common_13["default"].BindLinkButtonEvent("click", $("#btnSaveUserInfo"), function () {
                if (!Common_13["default"].CommonFormValid(validator)) {
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
            Common_13["default"].BindLinkButtonEvent("click", $("#btnSavePassword"), function () {
                if (!Common_13["default"].CommonFormValid(validator)) {
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
            Common_13["default"].BindLinkButtonEvent("click", $("#btnSaveMerchant"), function () {
                if (!Common_13["default"].CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({
                    target: $("#btnSaveMerchant")[0]
                });
            });
        }
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/// <reference path="../../../common.d.ts" />
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__, __WEBPACK_LOCAL_MODULE_1__], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Common_14, UserControl_10) {
    "use strict";
    exports.__esModule = true;
    /**
     * 用户管理
     * @type type
     */
    var app = {};
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
         * 打开用户信息【修改】页面
         */
        Update: function () {
            var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
            if (ids && ids.length === 1) {
                var query = {
                    handletype: "update",
                    UserInfoID: ids[0]
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
            UserControl_10["default"].MerchantSelect.Init({
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
        CreateSysRoleTree: function ($obj) {
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
                loadFilter: function (data) {
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
            Common_14["default"].BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!Common_14["default"].CommonFormValid(validator)) {
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
    };
    exports["default"] = app;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);