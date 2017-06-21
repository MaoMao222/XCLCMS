/// <reference path="../../../common.d.ts" />
define(["Lib/Common"], function (common) {
    /**
     * Easyui相关
     */
    var app = {
        /**
         * 绑定数据时，将枚举转为描述信息
         */
        EnumToDescription: function (value, row, index) {
            return common.EnumConvert(this.field, value);
        }
    };
    return app;
});