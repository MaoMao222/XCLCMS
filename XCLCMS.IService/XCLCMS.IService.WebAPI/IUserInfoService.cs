using System.Collections.Generic;
using XCLCMS.Data.Model;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.UserInfo;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;

namespace XCLCMS.IService.WebAPI
{
    public interface IUserInfoService : IBaseInfoService
    {
        APIResponseEntity<bool> Add(APIRequestEntity<AddOrUpdateEntity> request);

        APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request);

        APIResponseEntity<Data.Model.UserInfo> Detail(APIRequestEntity<long> request);

        APIResponseEntity<bool> IsExistUserName(APIRequestEntity<string> request);

        APIResponseEntity<PageListResponseEntity<v_UserInfo>> PageList(APIRequestEntity<PageListConditionEntity> request);

        APIResponseEntity<bool> Update(APIRequestEntity<AddOrUpdateEntity> request);
    }
}