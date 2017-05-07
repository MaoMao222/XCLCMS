using System.Collections.Generic;
using XCLCMS.Data.WebAPIEntity;
using XCLNetTools.Entity;

namespace XCLCMS.IService.WebAPI
{
    public interface IFileInfoService : IBaseInfoService
    {
        APIResponseEntity<List<FileInfoEntity>> DiskFileList(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.FileInfo.DiskFileListEntity> request);
    }
}