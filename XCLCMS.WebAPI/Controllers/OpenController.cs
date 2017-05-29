using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 开放的API
    /// </summary>
    public class OpenController : BaseAPIController
    {
        private XCLCMS.Data.BLL.UserInfo userInfoBLL = new XCLCMS.Data.BLL.UserInfo();
        private XCLCMS.Data.BLL.Merchant merchantBLL = new XCLCMS.Data.BLL.Merchant();
        private XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new XCLCMS.Data.BLL.MerchantApp();

        public OpenController(XCLCMS.IService.Logger.ILogService logService) : base(logService)
        {
        }

        /// <summary>
        /// 登录
        /// </summary>
        [HttpPost]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.Custom.UserInfoDetailModel>> LogonCheck([FromBody] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Open.LogonCheckEntity> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<XCLCMS.Data.Model.Custom.UserInfoDetailModel>();
                XCLCMS.Data.Model.UserInfo userModel = null;
                if (string.IsNullOrWhiteSpace(request.Body.UserToken))
                {
                    //用户名和密码登录
                    userModel = userInfoBLL.GetModel(request.Body.UserName, XCLCMS.Data.CommonHelper.EncryptHelper.EncryptStringMD5(request.Body.Pwd));
                }
                else
                {
                    //token登录
                    userModel = XCLCMS.WebAPI.Library.Common.GetUserInfoByUserToken(request.Body.UserToken);
                }

                if (null == userModel)
                {
                    response.Message = string.Format("用户名或密码不正确！", request.Body.UserName);
                    response.IsSuccess = false;
                }
                else if (!string.Equals(userModel.UserState, XCLCMS.Data.CommonHelper.EnumType.UserStateEnum.N.ToString()))
                {
                    response.Message = string.Format("用户名{0}已被禁用！", request.Body.UserName);
                    response.IsSuccess = false;
                }
                else
                {
                    response.IsSuccess = true;
                    response.Body = new Data.Model.Custom.UserInfoDetailModel();
                    //用户基本信息
                    response.Body.UserInfo = userModel;
                    //登录令牌
                    response.Body.Token = XCLCMS.Data.CommonHelper.EncryptHelper.CreateToken(new Data.Model.Custom.UserNamePwd()
                    {
                        UserName = userModel.UserName,
                        Pwd = userModel.Pwd
                    });
                    //所在商户
                    response.Body.Merchant = this.merchantBLL.GetModel(userModel.FK_MerchantID);
                    //所在商户应用
                    response.Body.MerchantApp = this.merchantAppBLL.GetModel(userModel.FK_MerchantAppID);
                }

                //使用用户名和密码登录时写入日志
                if (string.IsNullOrWhiteSpace(request.Body.UserToken))
                {
                    iLogService.WriteLog(new XCLCMS.IService.Logger.LogModel()
                    {
                        ClientIP = request.ClientIP,
                        Url = request.Url,
                        RefferUrl = request.Reffer,
                        LogType = XCLCMS.Data.CommonHelper.EnumType.LogTypeEnum.LOGIN.ToString(),
                        LogLevel = IService.Logger.LogEnum.LogLevel.INFO,
                        Title = string.Format("用户{0}，尝试登录系统{1}", request.Body.UserName, response.IsSuccess ? "成功" : "失败")
                    });
                }

                return response;
            });
        }

        /// <summary>
        /// 根据用户名和密码生成登录令牌
        /// </summary>
        [HttpPost]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<object>> CreateUserToken([FromBody] APIRequestEntity<XCLCMS.Data.Model.Custom.UserNamePwd> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<object>();
                response.Body = XCLCMS.Data.CommonHelper.EncryptHelper.CreateToken(request.Body);
                response.IsSuccess = true;
                return response;
            });
        }
    }
}