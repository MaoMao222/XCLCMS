/// <reference path="../../../common.d.ts" />
define(["Lib/Common", "Lib/EasyUI", "Lib/UserControl"], function (common, easyUI, userControl) {
    /**
      * 系统字典库
      */
    let app: IAnyPropObject;

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
                    { field: 'RecordState', title: '记录状态', formatter: easyUI.EnumToDescription, width: '5%' },
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
                    } else if (row.NodeLevel == 2) {
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
                    } else {
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
            userControl.MerchantSelect.Init({
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
                multiple: (!isTxtFunctionID),//字典对应的功能id只允许选一个
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
                            }
                        }
                    }
                }
            });
            common.BindLinkButtonEvent("click", $("#btnSave"), function () {
                if (!common.CommonFormValid(validator)) {
                    return false;
                }
                $.XGoAjax({ target: $("#btnSave")[0] });
            });
        }
    };

    return app;
});