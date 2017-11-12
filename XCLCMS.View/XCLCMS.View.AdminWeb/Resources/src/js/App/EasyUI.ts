/// <reference path="common.d.ts" />

import common from "./Common";

/**
 * Easyui相关
 */
var app = {
    /**
     * 绑定数据时，将枚举转为描述信息
     */
    EnumToDescription: function (value: any, row: any, index: any) {
        return common.EnumConvert(this.field, value);
    }
};
export default app;