using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.SysLog;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;

namespace XCLCMS.IService.WebAPI
{
    /// <summary>
    /// 系统日志服务
    /// </summary>
    public interface ISysLogService : IBaseInfoService
    {
        APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.SysLog> request);

        APIResponseEntity<bool> Delete(APIRequestEntity<ClearConditionEntity> request);

        APIResponseEntity<PageListResponseEntity<Data.Model.SysLog>> PageList(APIRequestEntity<PageListConditionEntity> request);
    }
}