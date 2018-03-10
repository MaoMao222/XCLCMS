using System.Collections.Generic;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 功能模块 API
    /// </summary>
    public static class SysFunctionAPI
    {
        /// <summary>
        /// 查询功能信息实体
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.SysFunction> Detail(APIRequestEntity<long> request)
        {
            return Library.Request<long, XCLCMS.Data.Model.SysFunction>(request, "SysFunction/Detail");
        }

        /// <summary>
        /// 判断功能标识是否已经存在
        /// </summary>
        public static APIResponseEntity<bool> IsExistCode(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.IsExistCodeEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.IsExistCodeEntity, bool>(request, "SysFunction/IsExistCode");
        }

        /// <summary>
        /// 判断功能名，在同一级别中是否存在
        /// </summary>
        public static APIResponseEntity<bool> IsExistFunctionNameInSameLevel(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.IsExistFunctionNameInSameLevelEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.IsExistFunctionNameInSameLevelEntity, bool>(request, "SysFunction/IsExistFunctionNameInSameLevel");
        }

        /// <summary>
        /// 查询所有功能列表
        /// </summary>
        public static APIResponseEntity<List<XCLCMS.Data.Model.View.v_SysFunction>> GetList(APIRequestEntity<long> request)
        {
            return Library.Request<long, List<XCLCMS.Data.Model.View.v_SysFunction>>(request, "SysFunction/GetList");
        }

        /// <summary>
        /// 获取easyui tree格式的所有功能json
        /// </summary>
        public static APIResponseEntity<List<XCLNetTools.Entity.EasyUI.TreeItem>> GetAllJsonForEasyUITree(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.GetAllJsonForEasyUITreeEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.GetAllJsonForEasyUITreeEntity, List<XCLNetTools.Entity.EasyUI.TreeItem>>(request, "SysFunction/GetAllJsonForEasyUITree");
        }

        /// <summary>
        /// 获取当前SysFunctionID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        public static APIResponseEntity<List<XCLCMS.Data.Model.Custom.SysFunctionSimple>> GetLayerListBySysFunctionId(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.GetLayerListBySysFunctionIdEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.GetLayerListBySysFunctionIdEntity, List<XCLCMS.Data.Model.Custom.SysFunctionSimple>>(request, "SysFunction/GetLayerListBySysFunctionId");
        }

        /// <summary>
        /// 获取指定角色的所有功能
        /// </summary>
        public static APIResponseEntity<List<XCLCMS.Data.Model.SysFunction>> GetListByRoleID(APIRequestEntity<long> request)
        {
            return Library.Request<long, List<XCLCMS.Data.Model.SysFunction>>(request, "SysFunction/GetListByRoleID");
        }

        /// <summary>
        /// 获取普通商户的所有功能数据源列表
        /// </summary>
        public static APIResponseEntity<List<XCLCMS.Data.Model.View.v_SysFunction>> GetNormalMerchantFunctionTreeList(APIRequestEntity<object> request)
        {
            return Library.Request<object, List<XCLCMS.Data.Model.View.v_SysFunction>>(request, "SysFunction/GetNormalMerchantFunctionTreeList");
        }

        /// <summary>
        /// 判断指定用户是否至少拥有权限组中的某个权限
        /// </summary>
        public static APIResponseEntity<bool> HasAnyPermission(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.HasAnyPermissionEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.HasAnyPermissionEntity, bool>(request, "SysFunction/HasAnyPermission");
        }

        /// <summary>
        /// 添加功能
        /// </summary>
        public static APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.SysFunction> request)
        {
            return Library.Request<XCLCMS.Data.Model.SysFunction, bool>(request, "SysFunction/Add", false);
        }

        /// <summary>
        /// 修改功能
        /// </summary>
        public static APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.SysFunction> request)
        {
            return Library.Request<XCLCMS.Data.Model.SysFunction, bool>(request, "SysFunction/Update", false);
        }

        /// <summary>
        /// 删除功能
        /// </summary>
        public static APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            return Library.Request<List<long>, bool>(request, "SysFunction/Delete", false);
        }

        /// <summary>
        /// 删除指定功能的所有节点
        /// </summary>
        public static APIResponseEntity<bool> DelChild(APIRequestEntity<long> request)
        {
            return Library.Request<long, bool>(request, "SysFunction/DelChild", false);
        }
    }
}