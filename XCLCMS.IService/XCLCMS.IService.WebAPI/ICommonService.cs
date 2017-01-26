using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.Common;

namespace XCLCMS.IService.WebAPI
{
    /// <summary>
    /// 公共服务
    /// </summary>
    public interface ICommonService : IBaseInfoService
    {
        APIResponseEntity<bool> ClearRubbishData(APIRequestEntity<object> request);

        APIResponseEntity<long> GenerateID(APIRequestEntity<GenerateIDEntity> request);
    }
}