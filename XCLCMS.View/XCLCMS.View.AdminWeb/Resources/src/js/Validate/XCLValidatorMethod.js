/**
* 全局设置
*/
$.validator.setDefaults({
    debug: false,
    errorClass: "XCLValidError",
    validClass: "XCLValidOK",
    errorPlacement: function (error, element) {
        //如果存在XCLValidShowErrorID属性，则将错误信息放到该ID中，否则，则默认
        var showErrorID = element.attr("XCLValidShowErrorID");
        if (showErrorID) {
            $("#" + showErrorID).html("").append(error);
        } else {
            error.insertAfter(element);
        }
    }
});

/**
 * 自定义ajax验证
 */
$.validator.addMethod("XCLCustomRemote", function (value, element, ajaxOption) {
    var defaults = {
        url: null,
        type: "GET",
        dataType: "JSON",
        data: null
    };
    ajaxOption = $.extend(defaults, ajaxOption);

    if (typeof (ajaxOption.data) === 'function') {
        ajaxOption.data = ajaxOption.data();
    }

    $(element).removeData("XCLCustomMsg");

    var result = {};
    $.ajax({
        url: ajaxOption.url,
        dataType: ajaxOption.dataType,
        type: ajaxOption.type,
        data: ajaxOption.data,
        async: false,
        success: function (data) {
            result = data;
            $(element).data("XCLCustomMsg", data.Message);
        }
    });

    return this.optional(element) || result.IsSuccess;
}, function (params, element) {
    return $(element).data("XCLCustomMsg") || "";
});

/**
 * 验证账号格式是否正确（中英文+数字+下划线）
 */
$.validator.addMethod("AccountNO", function (value, element) {
    return this.optional(element) || /^[\w_]{3,10}$/.test(value);
}, "只能为长度为3-10的英文、数字、下划线组合！");