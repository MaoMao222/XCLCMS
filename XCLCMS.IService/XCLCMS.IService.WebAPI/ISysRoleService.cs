using System.Collections.Generic;
using XCLCMS.Data.Model;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole;
using XCLNetTools.Entity.EasyUI;

namespace XCLCMS.IService.WebAPI
{
    public interface ISysRoleService : IBaseInfoService
    {
        APIResponseEntity<bool> Add(APIRequestEntity<AddOrUpdateEntity> request);

        APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request);

        APIResponseEntity<Data.Model.SysRole> Detail(APIRequestEntity<long> request);

        APIResponseEntity<List<TreeItem>> GetAllJsonForEasyUITree(APIRequestEntity<GetAllJsonForEasyUITreeEntity> request);

        APIResponseEntity<List<SysRoleSimple>> GetLayerListBySysRoleID(APIRequestEntity<GetLayerListBySysRoleIDEntity> request);

        APIResponseEntity<List<v_SysRole>> GetList(APIRequestEntity<long> request);

        APIResponseEntity<List<Data.Model.SysRole>> GetRoleByUserID(APIRequestEntity<long> request);

        APIResponseEntity<bool> IsExistCode(APIRequestEntity<IsExistCodeEntity> request);

        APIResponseEntity<bool> IsExistRoleNameInSameLevel(APIRequestEntity<IsExistRoleNameInSameLevelEntity> request);

        APIResponseEntity<bool> Update(APIRequestEntity<AddOrUpdateEntity> request);
    }
}