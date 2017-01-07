using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.Common;

namespace XCLCMS.IService.WebAPI
{
    public interface ICommonService : IBaseInfoService
    {
        APIResponseEntity<bool> ClearRubbishData(APIRequestEntity<object> request);

        APIResponseEntity<long> GenerateID(APIRequestEntity<GenerateIDEntity> request);
    }
}