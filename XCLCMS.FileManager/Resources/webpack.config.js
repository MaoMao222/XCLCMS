var webpack = require('webpack');
var RawBundlerPlugin = require('webpack-raw-bundler');

module.exports = {
    entry: "./index.js",
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    plugins: [
        new RawBundlerPlugin({
            readEncoding: "utf-8",
            includeFilePathComments: true,
            allowDuplicatesInBundle: false,
            printProgress: false,
            fileEnding: "\n\n",
            commentTags: { Start: "/* ", End: " */" },
            bundles: [
                "plugins.js",
                "app.js"
            ],
            "plugins.js": [
                "./src/js/json2.js",
                "./src/js/Jquery/jquery-1.11.2.js",
                "./src/js/artDialog/artDialog.js",
                "./src/js/artDialog/plugins/iframeTools.js",
                "./src/js/artTemplate/template.js",
                "./src/js/bootstrap/js/bootstrap.min.js",
                "./src/js/Angularjs/angular.min.js",
                "./src/js/XGoAjax.js",
                "./src/js/XGoAjaxTemplate.js",
                "./src/js/Jcrop/js/jquery.Jcrop.js",
                "./src/js/plupload/moxie.min.js",
                "./src/js/plupload/plupload.full.min.js",
                "./src/js/plupload/jquery.plupload.queue/jquery.plupload.queue.min.js",
                "./src/js/EasyUI/jquery.easyui.min.js",
                "./src/js/XJsTool.js",
                "./src/js/XCheck.js",
                "./src/js/dynamicCon.js",
                "./src/js/WdatePicker/WdatePicker.js"
            ],
            "app.js": [
                "./src/js/App.js",
                "./src/js/ng/FileInfoController.js",
                "./src/js/ng/UploadController.js"
            ]
        })
    ]
}