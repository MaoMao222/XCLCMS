/// <reference path="common.d.ts" />

import common from "./Common";
import userControl from "./UserControl";

/**
 * 产品列表
 */
class ProductList {
    /**
     * 初始化
     */
    Init(): void {
        let _this = this;
        $("#btnUpdate").on("click", function () {
            return _this.Update();
        });
        $("#btnDel").on("click", function () {
            return _this.Del();
        });
    };
    /**
     * 返回已选择的value数组
     */
    GetSelectValue(): Array<string> | null {
        let selectVal = $(".XCLTableCheckAll").val();
        let ids = selectVal.split(',');
        if (selectVal && selectVal !== "" && ids.length > 0) {
            return ids;
        } else {
            return null;
        }
    };
    /**
     * 打开产品【修改】页面
     */
    Update(): boolean {
        let $btn = $("#btnUpdate"), ids = this.GetSelectValue();
        if (ids && ids.length === 1) {
            let query = {
                handletype: "update",
                ProductID: ids[0]
            }

            let url = XJ.Url.UpdateParam($btn.attr("href"), query);
            $btn.attr("href", url);
            return true;
        } else {
            art.dialog.tips("请选择一条记录进行修改操作！");
            return false;
        }
    };
    /**
     * 删除产品
     */
    Del(): boolean {
        let ids = this.GetSelectValue();
        if (!ids || ids.length == 0) {
            art.dialog.tips("请至少选择一条记录进行操作！");
            return false;
        }

        art.dialog.confirm("您确定要删除此信息吗？", function () {
            let request = XCLCMSWebApi.CreateRequest();
            request.Body = ids;

            $.XGoAjax({
                target: $("#btnDel")[0],
                ajax: {
                    url: XCLCMSPageGlobalConfig.WebAPIServiceURL + "Product/Delete",
                    contentType: "application/json",
                    data: JSON.stringify(request),
                    type: "POST"
                }
            });
        }, function () {
        });

        return false;
    }
}

/**
 * 产品添加与修改页
 */
class ProductAdd {
    private ckPayedRemarkObj: any = null;
    /**
    * 输入元素
    */
    Elements: any = {
        selPayedActionTypeObj: null,
        Init: function () {
            this.selPayedActionTypeObj = $("[name='selPayedActionType']");
        }
    }
    /**
     * 初始化
     */
    Init(): void {
        let _this = this;
        _this.Elements.Init();
        _this.InitValidator();

        //初始化编辑器
        CKEDITOR.replace('txtDescription');

        //商户号下拉框初始化
        userControl.MerchantSelect.Init({
            merchantIDObj: $("#txtMerchantID"),
            merchantAppIDObj: $("#txtMerchantAppID")
        });

        //成交后的处理内容切换
        let changePayedRemarkType = () => {
            let val = _this.Elements.selPayedActionTypeObj.val();
            if (val === 'TIP') {
                _this.ckPayedRemarkObj = CKEDITOR.replace('txtPayedRemark');
            } else if (_this.ckPayedRemarkObj) {
                _this.ckPayedRemarkObj.destroy();
                _this.ckPayedRemarkObj = null;
            }
        };
        _this.Elements.selPayedActionTypeObj.on("change", () => {
            changePayedRemarkType();
        });
        changePayedRemarkType();
    }
    /**
     * 表单验证初始化
     */
    InitValidator(): void {
        let validator = $("form:first").validate({
            rules: {
                txtProductName: {
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
}

class App {
    constructor() {
        this.ProductAdd = new ProductAdd();
        this.ProductList = new ProductList();
    }
    ProductList: ProductList;
    ProductAdd: ProductAdd;
}

export default new App();