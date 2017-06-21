/// <reference path="../../../common.d.ts" />
define(["Lib/Common", "Lib/EasyUI", "Lib/UserControl"], function (common, easyUI, userControl) {
    let app: IAnyPropObject;

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
                    { field: 'RecordState', title: '记录状态', formatter: easyUI.EnumToDescription, width: '5%' },
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
                    } else if (row.NodeLevel == 2) {
                        _this.Elements.menu_SysRole_del.hide();
                        _this.Elements.menu_SysRole_edit.hide();
                    } else {
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
                    } else {
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
            userControl.MerchantSelect.Init({
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