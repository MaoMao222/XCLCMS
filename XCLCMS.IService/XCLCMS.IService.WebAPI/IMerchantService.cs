using System.Collections.Generic;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.Merchant;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;

namespace XCLCMS.IService.WebAPI
{
    /// <summary>
    /// 商户服务
    /// </summary>
    public interface IMerchantService : IBaseInfoService
    {
        APIResponseEntity<bool> Add(APIRequestEntity<Data.Model.Merchant> request);

        APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request);

        APIResponseEntity<Data.Model.Merchant> Detail(APIRequestEntity<long> request);

        APIResponseEntity<Dictionary<string, long>> GetMerchantTypeDic(APIRequestEntity<object> request);

        APIResponseEntity<bool> IsExistMerchantName(APIRequestEntity<IsExistMerchantNameEntity> request);

        APIResponseEntity<PageListResponseEntity<v_Merchant>> PageList(APIRequestEntity<PageListConditionEntity> request);

        APIResponseEntity<List<XCLNetTools.Entity.TextValue>> AllTextValueList(APIRequestEntity<PageListConditionEntity> request);

        APIResponseEntity<bool> Update(APIRequestEntity<Data.Model.Merchant> request);
    }
}