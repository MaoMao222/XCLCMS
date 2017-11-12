angular.module('ngFileInfo', []).controller('fileInfoList', function ($scope) {
    $scope.data = [];

    $scope.initList = function () {
        $.XGoAjax({
            isExclusive: true,
            id: "getFileList",
            ajax: { url: AppConfig.RootUrl + "FileInfo/GetFileList" },
            success: function (ops, data) {
                $scope.data = data.CustomObject || [];
                $scope.$apply();
            }
        });
    };
    $scope.initList();

    $scope.delSubmit = function (paths) {
        if (!paths) {
            art.dialog.tips("请指定要删除的文件！");
            return false;
        }
        art.dialog.confirm("您确定要删除此文件吗？", function () {
            $.XGoAjax({
                ajax: [{
                    data: { paths: paths },
                    url: AppConfig.RootUrl + "FileInfo/DelSubmit",
                    type: "POST"
                }],
                complete: function () {
                    $scope.initList();
                }
            });
        }, function () {
        });
    };

    $scope.delBatchSubmit = function () {
        $scope.delSubmit($(":checkbox.xcheckValue").val());
    };



}).filter('encodeURIComponent', function () {
    return window.encodeURIComponent;
});