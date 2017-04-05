using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.IService.WebAPI
{
    /// <summary>
    /// 个人中心服务
    /// </summary>
    public interface IUserCenterService : IBaseInfoService
    {
        APIResponseEntity<bool> UpdateUserInfo(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.UserCenter.UserBaseInfoEntity> request);

        APIResponseEntity<bool> UpdatePassword(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.UserCenter.PasswordEntity> request);
    }
}