var webpack = require('webpack');
var RawBundlerPlugin = require('webpack-raw-bundler');

module.exports = {
    entry: {
        xclcms: './xclcms.ts'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/Build'
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    //devtool: "source-map",
    plugins: [
        new RawBundlerPlugin({
            readEncoding: "utf-8",
            includeFilePathComments: true,
            allowDuplicatesInBundle: false,
            printProgress: false,
            fileEnding: "\n\n",
            commentTags: { Start: "/* ", End: " */" },
            bundles: [
                "plugins.js"
            ],
            "plugins.js": [
                './Js/json2.js',
                './Js/Jquery/jquery-1.11.2.js',
                './Js/EasyUI/jquery.easyui.min.js',
                './Js/artDialog/artDialog.js',
                './Js/artDialog/plugins/iframeTools.js',
                './Js/artTemplate/template.js',
                './Js/validate/jquery.validate.js',
                './Js/Validate/zh-cn.js',
                './Js/validate/XCLValidatorMethod.js',
                './Js/table.js',
                './Js/XGoAjax/XGoAjax.js',
                './Js/XGoAjax/XGoAjaxTemplate.js',
                './Js/dynamicCon.js',
                './Js/XJsTool.js',
                './Js/readmore.js',
                './Js/WdatePicker/WdatePicker.js'
            ]
        })
        //new webpack.optimize.UglifyJsPlugin({
        //    compress: {
        //        warnings: false
        //    },
        //    sourceMap: true,
        //    parallel: true
        //})
    ]
}