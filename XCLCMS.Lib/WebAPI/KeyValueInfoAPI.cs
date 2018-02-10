using System.Collections.Generic;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 自由数据存储管理 API
    /// </summary>
    public static class KeyValueInfoAPI
    {
        /// <summary>
        /// 查询信息实体
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.View.v_KeyValueInfo> Detail(APIRequestEntity<long> request)
        {
            return Library.Request<long, XCLCMS.Data.Model.View.v_KeyValueInfo>(request, "KeyValueInfo/Detail");
        }

        /// <summary>
        /// 根据code来查询信息实体
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.KeyValueInfo> DetailByCode(APIRequestEntity<string> request)
        {
            return Library.Request<string, XCLCMS.Data.Model.KeyValueInfo>(request, "KeyValueInfo/DetailByCode");
        }

        /// <summary>
        /// 查询信息分页列表
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_KeyValueInfo>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            return Library.Request<PageListConditionEntity, XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_KeyValueInfo>>(request, "KeyValueInfo/PageList");
        }

        /// <summary>
        /// 检查code是否已存在
        /// </summary>
        public static APIResponseEntity<bool> IsExistCode(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.IsExistCodeEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.IsExistCodeEntity, bool>(request, "KeyValueInfo/IsExistCode");
        }

        /// <summary>
        /// 新增信息
        /// </summary>
        public static APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.AddOrUpdateEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.AddOrUpdateEntity, bool>(request, "KeyValueInfo/Add", false);
        }

        /// <summary>
        /// 修改信息
        /// </summary>
        public static APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.AddOrUpdateEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.AddOrUpdateEntity, bool>(request, "KeyValueInfo/Update", false);
        }

        /// <summary>
        /// 删除信息
        /// </summary>
        public static APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            return Library.Request<List<long>, bool>(request, "KeyValueInfo/Delete", false);
        }
    }
}