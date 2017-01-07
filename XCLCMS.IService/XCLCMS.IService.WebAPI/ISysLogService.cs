using XCLCMS.Data.Model;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.SysLog;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;

namespace XCLCMS.IService.WebAPI
{
    public interface ISysLogService : IBaseInfoService
    {
        APIResponseEntity<bool> Delete(APIRequestEntity<ClearConditionEntity> request, long merchantID = 0);

        APIResponseEntity<PageListResponseEntity<Data.Model.SysLog>> PageList(APIRequestEntity<PageListConditionEntity> request);
    }
}