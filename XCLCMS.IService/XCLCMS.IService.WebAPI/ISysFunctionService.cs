using System.Collections.Generic;
using XCLCMS.Data.Model;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction;
using XCLNetTools.Entity.EasyUI;

namespace XCLCMS.IService.WebAPI
{
    /// <summary>
    /// 权限功能服务
    /// </summary>
    public interface ISysFunctionService : IBaseInfoService
    {
        APIResponseEntity<bool> Add(APIRequestEntity<Data.Model.SysFunction> request);

        APIResponseEntity<bool> DelChild(APIRequestEntity<long> request);

        APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request);

        APIResponseEntity<Data.Model.SysFunction> Detail(APIRequestEntity<long> request);

        APIResponseEntity<List<TreeItem>> GetAllJsonForEasyUITree(APIRequestEntity<GetAllJsonForEasyUITreeEntity> request);

        APIResponseEntity<List<SysFunctionSimple>> GetLayerListBySysFunctionId(APIRequestEntity<GetLayerListBySysFunctionIdEntity> request);

        APIResponseEntity<List<v_SysFunction>> GetList(APIRequestEntity<long> request);

        APIResponseEntity<List<Data.Model.SysFunction>> GetListByRoleID(APIRequestEntity<long> request);

        List<long> GetNormalMerchantFunctionIDList();

        APIResponseEntity<List<v_SysFunction>> GetNormalMerchantFunctionTreeList(APIRequestEntity<object> request);

        APIResponseEntity<bool> HasAnyPermission(APIRequestEntity<HasAnyPermissionEntity> request);

        APIResponseEntity<bool> IsExistCode(APIRequestEntity<IsExistCodeEntity> request);

        APIResponseEntity<bool> IsExistFunctionNameInSameLevel(APIRequestEntity<IsExistFunctionNameInSameLevelEntity> request);

        APIResponseEntity<bool> Update(APIRequestEntity<Data.Model.SysFunction> request);
    }
}