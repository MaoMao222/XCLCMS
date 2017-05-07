using System.Collections.Generic;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.IService.WebAPI;
using XCLNetTools.Entity;

namespace XCLCMS.Service.WebAPI
{
    /// <summary>
    /// 文件管理
    /// </summary>
    public class FileInfoService : IFileInfoService
    {
        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 磁盘文件列表
        /// </summary>
        public APIResponseEntity<List<FileInfoEntity>> DiskFileList(APIRequestEntity<Data.WebAPIEntity.RequestEntity.FileInfo.DiskFileListEntity> request)
        {
            var response = new APIResponseEntity<List<FileInfoEntity>>();
            response.Body = XCLNetTools.FileHandler.FileDirectory.GetFileList(request.Body.CurrentDirectory, request.Body.RootPath, request.Body.WebRootPath);
            response.IsSuccess = true;
            return response;
        }
    }
}