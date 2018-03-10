/// <reference path="common.d.ts" />
/**
 * 用户控件
 */
let app: IAnyPropObject = {};

/**
 * 选择商户控件
 */
app.MerchantSelect = {
    Init: function (ops: IAnyPropObject) {
        var dfs: IAnyPropObject = {
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
            ops.merchantAppIDObj.combobox({
                url: XCLCMSPageGlobalConfig.RootURL + "MerchantApp/AllTextValueList",
                queryParams: {
                    id: $("input[name='" + ops.merchantIDObj.attr("id") + "']").val()
                },
                valueField: 'Value',
                textField: 'Text',
                editable: false,
                method: 'get',
                loadFilter: function (data: IAnyPropObject) {
                    return data.Body || [];
                }
            });
        };
        initMerchantAppSelect();

        //查询商户
        ops.merchantIDObj.combobox({
            url: XCLCMSPageGlobalConfig.RootURL + "Merchant/AllTextValueList",
            queryParams: {},
            valueField: 'Value',
            textField: 'Text',
            editable: false,
            method: 'get',
            loadFilter: function (data: IAnyPropObject) {
                return data.Body || [];
            },
            onChange: function (newValue: string, oldValue: string) {
                //回调
                ops.merchantIDSelectCallback && ops.merchantIDSelectCallback();
                //获取商户应用
                initMerchantAppSelect();
            }
        });
    }
};

export default app;