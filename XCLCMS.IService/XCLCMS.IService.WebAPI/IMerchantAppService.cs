using System.Collections.Generic;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.MerchantApp;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;

namespace XCLCMS.IService.WebAPI
{
    /// <summary>
    /// 商户应用服务
    /// </summary>
    public interface IMerchantAppService : IBaseInfoService
    {
        APIResponseEntity<bool> Add(APIRequestEntity<Data.Model.MerchantApp> request);

        APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request);

        APIResponseEntity<Data.Model.MerchantApp> Detail(APIRequestEntity<long> request);

        APIResponseEntity<MerchantAppInfoModel> DetailByAppKey(APIRequestEntity<object> request);

        APIResponseEntity<bool> IsExistMerchantAppName(APIRequestEntity<IsExistMerchantAppNameEntity> request);

        APIResponseEntity<PageListResponseEntity<v_MerchantApp>> PageList(APIRequestEntity<PageListConditionEntity> request);

        APIResponseEntity<List<XCLNetTools.Entity.TextValue>> AllTextValueList(APIRequestEntity<PageListConditionEntity> request);

        APIResponseEntity<bool> Update(APIRequestEntity<Data.Model.MerchantApp> request);
    }
}