using System.Collections.Generic;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 用户管理 API
    /// </summary>
    public static class UserInfoAPI
    {
        /// <summary>
        /// 查询用户信息实体
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.View.v_UserInfo> Detail(APIRequestEntity<long> request)
        {
            return Library.Request<long, XCLCMS.Data.Model.View.v_UserInfo>(request, "UserInfo/Detail");
        }

        /// <summary>
        /// 查询用户信息分页列表
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_UserInfo>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            return Library.Request<PageListConditionEntity, XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_UserInfo>>(request, "UserInfo/PageList");
        }

        /// <summary>
        /// 判断用户名是否存在
        /// </summary>
        public static APIResponseEntity<bool> IsExistUserName(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.UserInfo.IsExistUserNameEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.UserInfo.IsExistUserNameEntity, bool>(request, "UserInfo/IsExistUserName");
        }

        /// <summary>
        /// 新增用户信息
        /// </summary>
        public static APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity, bool>(request, "UserInfo/Add", false);
        }

        /// <summary>
        /// 修改用户信息
        /// </summary>
        public static APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity, bool>(request, "UserInfo/Update", false);
        }

        /// <summary>
        /// 删除用户信息
        /// </summary>
        public static APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            return Library.Request<List<long>, bool>(request, "UserInfo/Delete", false);
        }
    }
}