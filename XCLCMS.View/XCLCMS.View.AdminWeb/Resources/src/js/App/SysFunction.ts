/// <reference path="common.d.ts" />

import common from "./Common";
import easyUI from "./EasyUI";

let app: IAnyPropObject = {};

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
            onBeforeExpand: function (node: any) {
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
            loadFilter: function (data: IAnyPropObject) {
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
                { field: 'RecordState', title: '记录状态', formatter: easyUI.EnumToDescription, width: '5%' },
                { field: 'CreateTime', title: '创建时间', width: '10%' },
                { field: 'CreaterName', title: '创建者名', width: '5%' },
                { field: 'UpdateTime', title: '更新时间', width: '10%' },
                { field: 'UpdaterName', title: '更新者名', width: '5%' }
            ]],
            onContextMenu: function (e: any, row: any) {
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
        var ids = [] as any[];
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
                    url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "SysFunction/Delete",
                    contentType: "application/json",
                    data: JSON.stringify(request),
                    type: "POST"
                },
                postSuccess: function (ops: any, data: IAnyPropObject) {
                    if (data.IsSuccess) {
                        $.each(ids, function (idx: number, n: any) {
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
                    } else {
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
        common.BindLinkButtonEvent("click", $("#btnSave"), function () {
            if (!common.CommonFormValid(validator)) {
                return false;
            }
            $.XGoAjax({ target: $("#btnSave")[0] });
        });
    }
};

export default app;