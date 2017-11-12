var webpack = require('webpack');
var RawBundlerPlugin = require('webpack-raw-bundler');

module.exports = {
    entry: {
        xclcms: './xclcms.ts'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
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
                './src/js/json2.js',
                './src/js/Jquery/jquery-1.11.2.js',
                './src/js/EasyUI/jquery.easyui.min.js',
                './src/js/artDialog/artDialog.js',
                './src/js/artDialog/plugins/iframeTools.js',
                './src/js/artTemplate/template.js',
                './src/js/validate/jquery.validate.js',
                './src/js/Validate/zh-cn.js',
                './src/js/validate/XCLValidatorMethod.js',
                './src/js/table.js',
                './src/js/XGoAjax/XGoAjax.js',
                './src/js/XGoAjax/XGoAjaxTemplate.js',
                './src/js/dynamicCon.js',
                './src/js/XJsTool.js',
                './src/js/readmore.js',
                './src/js/WdatePicker/WdatePicker.js'
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