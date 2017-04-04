using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 个人中心 API
    /// </summary>
    public static class UserCenterAPI
    {
        /// <summary>
        /// 修改用户基本信息
        /// </summary>
        public static APIResponseEntity<bool> UpdateUserInfo(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.UserCenter.UserBaseInfoEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.UserCenter.UserBaseInfoEntity, bool>(request, "UserCenter/UpdateUserInfo", false);
        }
    }
}