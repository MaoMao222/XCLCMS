using System.Collections.Generic;
using XCLCMS.Data.Model;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.SysWebSetting;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;

namespace XCLCMS.IService.WebAPI
{
    /// <summary>
    /// 系统配置服务
    /// </summary>
    public interface ISysWebSettingService : IBaseInfoService
    {
        APIResponseEntity<bool> Add(APIRequestEntity<Data.Model.SysWebSetting> request);

        APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request);

        APIResponseEntity<Data.Model.SysWebSetting> Detail(APIRequestEntity<long> request);

        APIResponseEntity<bool> IsExistKeyName(APIRequestEntity<IsExistKeyNameEntity> request);

        APIResponseEntity<PageListResponseEntity<v_SysWebSetting>> PageList(APIRequestEntity<PageListConditionEntity> request);

        APIResponseEntity<bool> Update(APIRequestEntity<Data.Model.SysWebSetting> request);
    }
}