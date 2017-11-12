/**
 * ******************************************************************************************
 * 1：基本信息：
 * 开源协议：https://github.com/xucongli1989/XGoAjax/blob/master/LICENSE
 * 项目地址：https://github.com/xucongli1989/XGoAjax
 * 电子邮件：80213876@qq.com
 * Create By: XCL @ 2015.09 in Shenzhen. China
 ********************************************************************************************
 * 2：使用说明：
 *                      统一对ajax请求的结果进行处理，包括消息提示、错误处理等操作，这样可以保证我们的项目有一个统一的风格，同时也简化了大量的代码。
 * 3：使用场景：
 *                      a：ajax回调信息提示响应处理，比如提示成功或失败等消息。
 *                      b：提交按钮需要在ajax请求中阻止提交（防止多次提交）
 *                      c：同时发起多次ajax请求
 * 当前版本：v1.0.5
 * 更新时间：2017-04-07
 * 更新内容：默认的form改为先读取target同一容器中的form，若没有则取页面的第一个form
 */
; (function (win, doc, $, undefined) {
    "use strict";

    var _version = "v1.0.5，https://github.com/xucongli1989/XGoAjax";

    //全局设置
    var _globalSettings = {};

    //当前插件所有模板存放的区
    var _templates = {};

    /*默认模板项*/
    var defaultTemplate = {
        //模板名
        name: "",
        //ajax请求前，如果返回false，则阻止后续执行。
        before: function (ops) { return true; },
        //ajax失败后
        error: function (ops) { },
        //ajax成功后，data为数组或对象
        success: function (ops, datas) { },
        //ajax完成后
        complete: function (ops) { },
        //模板自定义选项，此属性完全由用户在不同的模板中根据需要自定义
        templateOption: {}
    };

    /*插件默认选项*/
    var defaults = {
        /*
        发起请求的标识，可以随意指定，主要是便于判断该请求为同一类型的操作。
        比如，一个表单提交按钮来触发一个或一组ajax请求的情况，我们可以指定id来标识用户单击这个提交按钮时的请求，
        这样，如果是在独占模式情况下，本插件就会通过这个id，判断上一次请求是否已经结束，如果未结束，则不做任何处理，
        如果已结束，则可以再重新发起请求。这样做的好处是，防止用户在短时间内，多次单击提交按钮。
        （以往旧的做法是，在请求时，禁用这个按钮。）注意：如果未指定则默认为贪婪模式；在独占请求时，必须指定有效的值。
        */
        id: "",
        //模板名，默认值在_globalSettings中设置
        templateName: "",
        //模板自定义选项，此属性完全由用户在不同的模板中根据需要自定义
        templateOption: {},
        //true:独占请求，要想再发起同样的一个请求，必须等待上次请求结束；false:贪婪请求，不限制重复请求。 默认值在_globalSettings中设置
        isExclusive: true,
        //$.ajax选项，数组的每一项代表一个ajax请求，可以有多个ajax请求。如果只有一个请求，可以不用数组，直接用{...}替代。如果没有传递此参数或数组项长度为0，则使用默认的ajax行为
        ajax: [],

        //发起事件的对象，主要是便于对该对象进行锁定等操作
        target: null,
        //target自定义选项
        targetOption: {},
        //在before前执行，如果返回fase，则不再执行before的后续操作，同时也终止本次ajax请求
        preBefore: null,
        //ajax请求前function，如果未指定，则执行模板中的before函数，如果返回fase，则不再执行before的后续操作，同时也终止本次ajax请求
        before: null,
        //在before后执行，如果返回fase，则终止本次ajax请求
        postBefore: null,
        //在success前执行，如果返回fase，则不再执行success的后续操作
        preSuccess: null,
        //ajax成功后function，如果未指定，则执行模板中的success函数，如果返回fase，则不再执行success的后续操作
        success: null,
        //在success后执行
        postSuccess: null,
        //在complete前执行，如果返回fase，则不再执行complete的后续操作
        preComplete: null,
        //ajax完成后function，如果未指定，则执行模板中的complete函数，如果返回fase，则不再执行complete的后续操作
        complete: null,
        //在complete后执行
        postComplete: null,
        //在error前执行，如果返回fase，则不再执行error的后续操作
        preError: null,
        //ajax失败后function，如果未指定，则执行模板中的error函数，如果返回fase，则不再执行error的后续操作
        error: null,
        //在error后执行
        postError: null
    };

    /*$.ajax的默认选项*/
    var ajaxDefaults = {
        url: "",
        dataType: "JSON",
        type: "get",
        data: null
    };

    /*ajax请求列表*/
    var _workList = {};
    var _addWork = function (id, defer) {
        if (id) {
            _workList[id] = defer;
        }
    };
    var _getWorkById = function (id) {
        return _workList[id] || null;
    };
    var _removeById = function (id) {
        delete _workList[id];
    };

    /*创建一个callback对象*/
    var _createCallBacks = function () {
        return $.Callbacks("stopOnFalse unique");
    };

    var _go = function (ops) {
        ops = $.extend({}, defaults, ops || {});
        var dfd = null, isAllowRun = true;
        var tp = _templates[ops.templateName || "default"];//当前模板
        var $form = null;
        if (ops.target) {
            $form = $(ops.target).closest("form");
        }
        if (!$form || $form.length == 0) {
            $form = $("form:first");
        }
        var action = $form.attr("action"), data = $form.serialize(), method = $form.attr("method");

        if (!tp) {
            throw new Error("请指定一个有效的模板！");
        }

        //如果ajax参数不是数组，则把该值设置为数组的第一项
        if (ops.ajax && !($.isArray(ops.ajax))) {
            ops.ajax = [ops.ajax];
        }

        if (!ops.ajax || ops.ajax.length == 0) {
            //如果没有传ajax参数，则使用默认值
            ops.ajax = [{
                url: action || win.location.href,
                data: data,
                type: method || "get"
            }];
            ops.ajax[0] = $.extend({}, ajaxDefaults, ops.ajax[0]);
        } else {
            //如果有传ajax参数，则对参数进行进一步的处理
            $.each(ops.ajax, function (i, n) {
                n.url = (n.url ? n.url : action) || win.location.href;
                n.data = n.data ? n.data : data;
                n.type = (n.type ? n.type : method) || "get";
                ops.ajax[i] = $.extend({}, ajaxDefaults, n);
            });
        }

        ops.templateOption = $.extend({}, tp.templateOption, ops.templateOption);

        //独占模式时，验证相关信息
        if (ops.isExclusive) {
            if (!ops.id) {
                throw new Error('Error：独占请求必须指定有效的id！');
            }
            //独占只能允许一个请求正在执行
            var item = _getWorkById(ops.id);
            if (item && item.state() === "pending") {
                isAllowRun = false;
            }
        }

        //before返回的结果，如果为false，则后续的ajax请求根本就不用执行了。
        var beforeResult = false;

        //before回调
        var beforeCall = function (ops) {
            var beforeCallBacks = _createCallBacks();
            if (ops.preBefore) {
                beforeCallBacks.add(ops.preBefore);
            }
            if (ops.before) {
                beforeCallBacks.add(ops.before);
            }
            if (tp.before) {
                beforeCallBacks.add(tp.before);
            }
            if (ops.postBefore) {
                beforeCallBacks.add(ops.postBefore);
            }
            beforeCallBacks.add(function () {
                beforeResult = true;
            });
            beforeCallBacks.fire(ops);
        };
        //success回调
        var successCall = function (ops, datas) {
            var callbacks = _createCallBacks();
            if (ops.preSuccess) {
                callbacks.add(ops.preSuccess);
            }
            if (ops.success) {
                callbacks.add(ops.success);
            }
            if (tp.success) {
                callbacks.add(tp.success);
            }
            if (ops.postSuccess) {
                callbacks.add(ops.postSuccess);
            }
            callbacks.fire(ops, datas);
        };
        //error回调
        var errorCall = function (ops) {
            var callbacks = _createCallBacks();
            if (ops.preError) {
                callbacks.add(ops.preError);
            }
            if (ops.error) {
                callbacks.add(ops.error);
            }
            if (tp.error) {
                callbacks.add(tp.error);
            }
            if (ops.postError) {
                callbacks.add(ops.postError);
            }
            callbacks.fire(ops);
        };
        //complete回调
        var completeCall = function (ops) {
            var callbacks = _createCallBacks();
            if (ops.preComplete) {
                callbacks.add(ops.preComplete);
            }
            if (ops.complete) {
                callbacks.add(ops.complete);
            }
            if (tp.complete) {
                callbacks.add(tp.complete);
            }
            if (ops.postComplete) {
                callbacks.add(ops.postComplete);
            }
            callbacks.fire(ops);
        };

        //如果允许执行，则调用before
        if (isAllowRun) {
            beforeCall.call(this, ops);
        }

        //允许执行，且只有当before返回true时，才执行ajax请求
        if (isAllowRun && beforeResult) {
            var ajaxDeferred = [];
            $.each(ops.ajax, function (i, n) {
                ajaxDeferred.push($.ajax(n));
            });
            dfd = $.when.apply($, ajaxDeferred).done(function () {
                var datas = [], args = arguments, d = null;

                for (var i = 0; i < ops.ajax.length; i++) {
                    d = ops.ajax.length > 1 ? args[i][0] : args[0];
                    if (ops.ajax[i].dataType.toUpperCase() === "JSON" && !(d instanceof Object)) {
                        //如果请求类型为json，但是返回的不是一个对象，则将返回值转为json
                        datas.push($.parseJSON(d));
                    } else {
                        datas.push(d);
                    }
                }

                //如果只有一个ajax请求，则datas不用设置为数组，直接为数组的第一项，也就是第一个ajax返回的结果
                if (ops.ajax.length == 1) {
                    datas = datas[0];
                }
                successCall.call(this, ops, datas);
            }).always(function () {
                _removeById(ops.id);
                completeCall.call(this, ops);
            }).fail(function () {
                errorCall.call(this, ops);
            });
            _addWork(ops.id, dfd);
        };

        //允许执行，且只有当before返回false时，直接调用complete即可
        if (isAllowRun && !beforeResult) {
            completeCall.call(null, ops);
        }

        //返回当前请求状态
        ops.getState = function () {
            return dfd ? dfd.state() : null;
        };

        return dfd ? dfd : null;
    };

    /*版本号*/
    _go.version = _version;

    /*添加自定义模板*/
    _go.addTemplate = function (model) {
        if (model.name) {
            _templates[model.name] = $.extend({}, defaultTemplate, model);
        } else {
            throw new Error("必须指定有效的模板名！");
        }
    };

    /*获取当前的ajax列表对象*/
    _go.getAjaxList = function () {
        return _workList;
    };

    /*根据模板名获取模板对象*/
    _go.getTemplate = function (name) {
        return _templates[name] || null;
    };

    /*本插件全局设置*/
    _go.globalSettings = function (setting) {
        _globalSettings = $.extend({
            //默认模板名
            templateName: "default",
            //是否独占请求
            isExclusive: true
        }, setting || {});
        defaults.templateName = _globalSettings.templateName;
        defaults.isExclusive = _globalSettings.isExclusive;
    };
    _go.globalSettings();

    /*获取本插件全局设置*/
    _go.getGlobalSettings = function () {
        return _globalSettings || null;
    };

    /*扩展jquery*/
    $.extend({
        XGoAjax: _go
    });
})(window, document, jQuery);