using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 开放 API
    /// </summary>
    public static class OpenAPI
    {
        /// <summary>
        /// 登录检查
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.Custom.UserInfoDetailModel> LogonCheck(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Open.LogonCheckEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.Open.LogonCheckEntity, XCLCMS.Data.Model.Custom.UserInfoDetailModel>(request, "Open/LogonCheck", false);
        }
    }
}