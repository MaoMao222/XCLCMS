/// <reference path="common.d.ts" />

//主模板js
var app = {
    Init: function () {
        var $DivMenuTabs = $("#DivMenuTabs");
        var $menuItems = $DivMenuTabs.find("[xcl-remark]");
        var tabs = $DivMenuTabs.tabs('tabs');
        var href = location.href;
        //选项卡处理
        for (var i = 0; i < tabs.length; i++) {
            //鼠标划过，选中选项卡
            tabs[i].panel('options').tab.unbind().bind('mouseenter', { index: i }, function (e: any) {
                $DivMenuTabs.tabs('select', e.data.index);
            });
            //无菜单按钮，隐藏选项卡
            if (tabs[i].panel().find(".easyui-linkbutton").length == 0) {
                tabs[i].panel('options').tab.hide();
            }
        }

        $menuItems.each(function () {
            var remarkVal = $(this).attr("xcl-remark") || "";
            if (!remarkVal) return true;
            var obj: IAnyPropObject = {};
            try { obj = $.parseJSON(remarkVal); } catch (e) { };
            //选中当前菜单
            if (obj.MatchRegex) {
                var reg = new RegExp(obj.MatchRegex, "ig");
                if (reg.test(href)) {
                    $(this).addClass("XCLRedBolder");
                    //选中当前菜单的父菜单
                    if (obj.ParentNode) {
                        var $parentNode = $DivMenuTabs.find("[xcl-sysdiccode='" + obj.ParentNode + "']");
                        var title = $parentNode.attr("xcl-tabTitle");
                        $DivMenuTabs.tabs('select', title);
                        $("#divPagePath").html("XCLCMS->" + title + "->" + $(this).text());
                    }
                }
            }
        });

        ////鼠标移出菜单时，回到当前选中的菜单
        //$DivMenuTabs.on("mouseleave", function () {
        //    var $currentItem = $(this).find(".XCLRedBolder");
        //    if (!($currentItem.is(":visible"))) {
        //        var index = $currentItem.closest(".panel").index();
        //        $DivMenuTabs.tabs('select', index);
        //    }
        //});
    },
    /**
    * 向form标签中追加附加信息
    */
    AppendToForm: function (val: any) {
        $("form").append(val);
    }
};
export default app;