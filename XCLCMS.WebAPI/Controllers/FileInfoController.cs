using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;
using XCLNetTools.Entity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 文件管理
    /// </summary>
    public class FileInfoController : BaseAPIController
    {
        private XCLCMS.IService.WebAPI.IFileInfoService _iFileInfoService = null;

        private XCLCMS.IService.WebAPI.IFileInfoService iFileInfoService
        {
            get
            {
                if (null != this._iFileInfoService && null == this._iFileInfoService.ContextInfo)
                {
                    this._iFileInfoService.ContextInfo = base.ContextModel;
                }
                return this._iFileInfoService;
            }
            set
            {
                this._iFileInfoService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public FileInfoController(XCLCMS.IService.WebAPI.IFileInfoService fileInfoService, XCLCMS.IService.Logger.ILogService logService) : base(logService)
        {
            this.iFileInfoService = fileInfoService;
        }

        /// <summary>
        /// 磁盘文件列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FileManager_DiskFileView)]
        public async Task<APIResponseEntity<List<FileInfoEntity>>> DiskFileList([FromUri]  APIRequestEntity<Data.WebAPIEntity.RequestEntity.FileInfo.DiskFileListEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iFileInfoService.DiskFileList(request);
            });
        }
    }
}