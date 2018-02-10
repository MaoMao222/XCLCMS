using System.Collections.Generic;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;

namespace XCLCMS.IService.WebAPI
{
    /// <summary>
    /// 自由数据存储服务
    /// </summary>
    public interface IKeyValueInfoService : IBaseInfoService
    {
        APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.AddOrUpdateEntity> request);

        APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request);

        APIResponseEntity<Data.Model.View.v_KeyValueInfo> Detail(APIRequestEntity<long> request);

        APIResponseEntity<Data.Model.KeyValueInfo> DetailByCode(APIRequestEntity<string> request);

        APIResponseEntity<bool> IsExistCode(APIRequestEntity<IsExistCodeEntity> request);

        APIResponseEntity<PageListResponseEntity<v_KeyValueInfo>> PageList(APIRequestEntity<PageListConditionEntity> request);

        APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.AddOrUpdateEntity> request);
    }
}