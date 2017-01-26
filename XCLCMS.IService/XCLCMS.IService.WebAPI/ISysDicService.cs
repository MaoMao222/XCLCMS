using System.Collections.Generic;
using XCLCMS.Data.Model;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.SysDic;
using XCLNetTools.Entity.EasyUI;

namespace XCLCMS.IService.WebAPI
{
    /// <summary>
    /// 系统字典服务
    /// </summary>
    public interface ISysDicService : IBaseInfoService
    {
        APIResponseEntity<bool> Add(APIRequestEntity<Data.Model.SysDic> request);

        APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request);

        APIResponseEntity<Data.Model.SysDic> Detail(APIRequestEntity<long> request);

        APIResponseEntity<List<v_SysDic>> GetAllUnderListByID(APIRequestEntity<long> request);

        APIResponseEntity<List<Data.Model.SysDic>> GetChildListByCode(APIRequestEntity<string> request);

        APIResponseEntity<List<Data.Model.SysDic>> GetChildListByID(APIRequestEntity<long> request);

        APIResponseEntity<List<TreeItem>> GetEasyUITreeByCode(APIRequestEntity<GetEasyUITreeByCodeEntity> request);

        APIResponseEntity<List<TreeItem>> GetEasyUITreeByCondition(APIRequestEntity<GetEasyUITreeByConditionEntity> request);

        APIResponseEntity<List<SysDicSimple>> GetLayerListBySysDicID(APIRequestEntity<GetLayerListBySysDicIDEntity> request);

        APIResponseEntity<List<v_SysDic>> GetList(APIRequestEntity<long> request);

        APIResponseEntity<Dictionary<string, long>> GetPassTypeDic(APIRequestEntity<object> request);

        APIResponseEntity<List<v_SysDic>> GetSystemMenuModelList(APIRequestEntity<object> request);

        APIResponseEntity<bool> IsExistSysDicCode(APIRequestEntity<IsExistSysDicCodeEntity> request);

        APIResponseEntity<bool> IsExistSysDicNameInSameLevel(APIRequestEntity<IsExistSysDicNameInSameLevelEntity> request);

        APIResponseEntity<bool> Update(APIRequestEntity<Data.Model.SysDic> request);
    }
}