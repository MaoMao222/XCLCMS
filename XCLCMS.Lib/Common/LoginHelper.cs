using System;
using System.Web;

namespace XCLCMS.Lib.Common
{
    /// <summary>
    /// 登录相关
    /// </summary>
    public static class LoginHelper
    {
        /// <summary>
        /// 登录信息的session名 or Cookie名
        /// </summary>
        public const string UserLoginFlagName = "XCLCMS_UserLogin";

        /// <summary>
        /// 是否已登录
        /// </summary>
        public static bool IsLogOn
        {
            get
            {
                return null != LoginHelper.GetUserInfoFromLoginInfo();
            }
        }

        /// <summary>
        /// 设置登录与退出的登录令牌信息（session/cookie...）
        /// </summary>
        public static void SetLogInfo(XCLNetTools.Enum.CommonEnum.LoginTypeEnum type, string userToken)
        {
            var context = HttpContext.Current;
            switch (type)
            {
                //退出
                case XCLNetTools.Enum.CommonEnum.LoginTypeEnum.OFF:
                    XCLNetTools.Http.CookieHelper.DelCookies(LoginHelper.UserLoginFlagName);
                    context.Session.Remove(LoginHelper.UserLoginFlagName);
                    break;
                //登录
                case XCLNetTools.Enum.CommonEnum.LoginTypeEnum.ON:
                    if (string.IsNullOrWhiteSpace(userToken))
                    {
                        throw new ArgumentException("必须指定用户的登录令牌信息！");
                    }
                    XCLNetTools.Http.CookieHelper.SetCookies(LoginHelper.UserLoginFlagName, userToken, 30);
                    context.Session[LoginHelper.UserLoginFlagName] = userToken;
                    break;
            }
        }

        /// <summary>
        /// 根据session或cookie中的登录令牌来获取当前用户model
        /// </summary>
        public static XCLCMS.Data.Model.Custom.UserInfoDetailModel GetUserInfoFromLoginInfo()
        {
            string loginString = HttpContext.Current.Session[LoginHelper.UserLoginFlagName] as string;
            if (string.IsNullOrEmpty(loginString))
            {
                loginString = XCLNetTools.Http.CookieHelper.GetCookies(LoginHelper.UserLoginFlagName);
            }
            if (string.IsNullOrEmpty(loginString))
            {
                return null;
            }
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.Open.LogonCheckEntity>(loginString);
            request.Body = new Data.WebAPIEntity.RequestEntity.Open.LogonCheckEntity();
            request.Body.UserToken = loginString;
            var response = XCLCMS.Lib.WebAPI.OpenAPI.LogonCheck(request);
            if (null != response && response.IsSuccess && null != response.Body && null != response.Body.UserInfo)
            {
                return response.Body;
            }
            return null;
        }
    }
}