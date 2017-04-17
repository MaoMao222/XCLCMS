using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 个人中心
    /// </summary>
    public class UserCenterController : BaseAPIController
    {
        private XCLCMS.IService.WebAPI.IUserCenterService _iUserCenterService = null;

        private XCLCMS.IService.WebAPI.IUserCenterService iUserCenterService
        {
            get
            {
                if (null != this._iUserCenterService && null == this._iUserCenterService.ContextInfo)
                {
                    this._iUserCenterService.ContextInfo = base.ContextModel;
                }
                return this._iUserCenterService;
            }
            set
            {
                this._iUserCenterService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public UserCenterController(XCLCMS.IService.WebAPI.IUserCenterService userCenterService, XCLCMS.IService.Logger.ILogService logService) : base(logService)
        {
            this.iUserCenterService = userCenterService;
        }

        /// <summary>
        /// 修改用户基本信息
        /// </summary>
        [HttpPost]
        public async Task<APIResponseEntity<bool>> UpdateUserInfo([FromBody] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.UserCenter.UserBaseInfoEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iUserCenterService.UpdateUserInfo(request);
            });
        }

        /// <summary>
        /// 修改密码
        /// </summary>
        [HttpPost]
        public async Task<APIResponseEntity<bool>> UpdatePassword([FromBody] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.UserCenter.PasswordEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iUserCenterService.UpdatePassword(request);
            });
        }
    }
}