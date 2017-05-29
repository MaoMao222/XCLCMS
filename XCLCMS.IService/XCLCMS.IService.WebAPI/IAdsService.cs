using System.Collections.Generic;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.Ads;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;

namespace XCLCMS.IService.WebAPI
{
    /// <summary>
    /// 广告服务
    /// </summary>
    public interface IAdsService : IBaseInfoService
    {
        APIResponseEntity<bool> Add(APIRequestEntity<Data.Model.Ads> request);

        APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request);

        APIResponseEntity<Data.Model.Ads> Detail(APIRequestEntity<long> request);

        APIResponseEntity<Data.Model.Ads> DetailByCode(APIRequestEntity<string> request);

        APIResponseEntity<bool> IsExistCode(APIRequestEntity<IsExistCodeEntity> request);

        APIResponseEntity<PageListResponseEntity<v_Ads>> PageList(APIRequestEntity<PageListConditionEntity> request);

        APIResponseEntity<bool> Update(APIRequestEntity<Data.Model.Ads> request);
    }
}