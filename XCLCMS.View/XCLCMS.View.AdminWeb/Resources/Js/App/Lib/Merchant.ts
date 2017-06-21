/// <reference path="../../../common.d.ts" />
define(["Lib/Common", "Lib/UserControl"], function (common, userControl) {
    /**
     * 商户管理
     * @type type
     */
    let app: IAnyPropObject;

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
         * 打开商户信息【修改】页面
         */
        Update: function () {
            var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
            if (ids && ids.length === 1) {
                var query = {
                    handletype: "update",
                    MerchantID: ids[0]
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
            common.BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!common.CommonFormValid(validator)) {
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
         * 打开商户应用信息【修改】页面
         */
        Update: function () {
            var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
            if (ids && ids.length === 1) {
                var query = {
                    handletype: "update",
                    MerchantAppID: ids[0]
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
            userControl.MerchantSelect.Init({
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
            common.BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!common.CommonFormValid(validator)) {
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

    return app;
});