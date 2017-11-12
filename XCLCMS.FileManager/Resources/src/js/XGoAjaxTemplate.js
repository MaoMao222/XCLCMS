/*
***************************************************************************************************************************************************************************************************
* 以下为模板，可根据您的项目需要，自行添加相应的模板方法即可。
***************************************************************************************************************************************************************************************************
*/

/*默认模板*/
$.XGoAjax.addTemplate({
    name: "default",
    before: function (ops) {
        console.log("正在执行中，请稍后...");
        return true;
    },
    error: function (ops) {
        console.log("请求失败！");
    },
    success: function (ops, datas) {
        /*
        请求成功后返回的data格式：
        data={
            //提示语
            Message:"",
            //更多
            ...
        }
        */
        var msg = "";

        if ($.isArray(datas)) {
            $.each(datas, function (i, n) {
                msg += n.Message;
            });
        } else {
            msg = datas.Message;
        }

        console.log(msg);
    },
    complete: function (ops) {
        console.log("请求已完成！");
    }
});

/*artdialog模板*/
$.XGoAjax.addTemplate({
    name: "artdialog",
    before: function (ops) {
        if (ops.target) {
            $(ops.target).prop({ "disabled": true });
        }
        art.dialog.tips(ops.templateOption.beforeSendMsg, 9999999);
        return true;
    },
    error: function (ops) {
        art.dialog.tips("抱歉，请求出错啦！", 2);
    },
    success: function (ops, datas) {
        /*
        请求成功后返回的data格式：
        data={
            //提示标题
            Title:"",
            //提示语
            Message:"",
            //是否成功
            IsSuccess:false,
            //是否进行刷新
            IsRefresh:false,
            //是否需要跳转
            IsRedirect:false,
            //要跳转的url
            RedirectURL:"",
            //自定义输出对象
            CustomObject:null,
            //更多
            ...
        }
        */

        var data = $.isArray(datas) ? datas[0] : datas;

        //artdialog图标
        var dialogIcon = "succeed";

        //如果失败且有提示语，则以alert方式弹出消息
        if (data && data.Message && !data.IsSuccess) {
            ops.templateOption.isAlertShowMsg = true;
            dialogIcon = "error";
        }

        //关闭窗口中正在提示的tips
        var list = art.dialog.list["Tips"];
        if (null != list) {
            list.close();
        }

        //定义刷新函数
        var refresh = function () {
            //跳转
            if (data.IsRedirect && data.RedirectURL) {
                location.href = data.RedirectURL;
                return;
            }
            //刷新
            if (data.IsRefresh) {
                setTimeout(function () {
                    ops.templateOption.refreshFunction.apply(this, arguments);
                }, ops.templateOption.isAlertShowMsg ? 0 : 700);//延迟0.7s的目的是在tips提示的场景下，让用户多看一下提示语
            }
        };

        if (data.Message != "" && data.Message != null) {
            if (ops.templateOption.isAlertShowMsg) {
                //以对话框方式显示消息
                art.dialog({
                    icon: dialogIcon,
                    content: "<div style='max-width:500px;'>" + data.Message + "</div>",
                    cancelVal: '知道了',
                    cancel: function () {
                        refresh();
                    }
                });
            } else {
                //以tips方式显示消息
                art.dialog.tips(data.Message, 2);
                refresh();
            }
        }
    },
    complete: function (ops) {
        if (ops.target) {
            $(ops.target).prop({ "disabled": false });
        }
    },
    templateOption: {
        //请求前要提示的信息
        beforeSendMsg: "正在处理中，请稍后...",
        //true:以alert的方式弹出消息，点确定或关闭执行刷新或其它函数。false:以tips弹出消息
        isAlertShowMsg: true,
        //刷新函数
        refreshFunction: function () {
            art.dialog.open.origin.location.reload();
        }
    }
});