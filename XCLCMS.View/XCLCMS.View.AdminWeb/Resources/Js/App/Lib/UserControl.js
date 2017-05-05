/**
 * 用户控件
 */
define([], function () {
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

    return app;
});