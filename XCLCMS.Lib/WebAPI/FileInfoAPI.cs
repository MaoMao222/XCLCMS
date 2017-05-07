using System.Collections.Generic;
using XCLCMS.Data.WebAPIEntity;
using XCLNetTools.Entity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 文件管理API
    /// </summary>
    public static class FileInfoAPI
    {
        /// <summary>
        /// 磁盘文件列表
        /// </summary>
        public static APIResponseEntity<List<FileInfoEntity>> DiskFileList(APIRequestEntity<Data.WebAPIEntity.RequestEntity.FileInfo.DiskFileListEntity> request)
        {
            return Library.Request<Data.WebAPIEntity.RequestEntity.FileInfo.DiskFileListEntity, List<FileInfoEntity>>(request, "FileInfo/DiskFileList");
        }
    }
}