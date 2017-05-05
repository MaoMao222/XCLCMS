define(["ckeditorCN", "Lib/Common", "Lib/UserControl"], function (ckeditorCN, common, userControl) {
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
         * 打开文章信息【修改】页面
         */
        Update: function () {
            var $btn = $("#btnUpdate"), ids = this.GetSelectValue();
            if (ids && ids.length === 1) {
                var query = {
                    handletype: "update",
                    ArticleID: ids[0]
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
            divContentNote: null,//内容字数统计
            btnRandomCount: null,//随机生成点赞数的按钮
            selArticleType: null,//文章分类
            selArticleContentType: null,//文章内容类型
            selAuthorName: null,//作者
            selFromInfo: null,//来源
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
            common.BindLinkButtonEvent("click", _this.Elements.btnRandomCount, function () {
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
            userControl.MerchantSelect.Init({
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
                        },
                    },
                    txtTitle: { required: true }
                }
            });
            common.BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!common.CommonFormValid(validator)) {
                    return false;
                }
                for (instance in CKEDITOR.instances) {
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

    return app;
});