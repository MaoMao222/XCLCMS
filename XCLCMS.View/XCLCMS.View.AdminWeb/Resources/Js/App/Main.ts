/// <reference path="common.d.ts" />

import common from "./Common";

let app = {
    Init: function () {
        //art dialog配置
        (function (config) {
            config.lock = true;
            config.opacity = 0.2;
            config.resize = true;
        })(art.dialog.defaults);

        //XGoAjax配置
        $.XGoAjax.globalSettings({
            templateName: "artdialog",
            isExclusive: false
        });

        //重写全局的alert
        window.alert = art.dialog.alert;

        //init
        common.Init();
    }
};

export default app;