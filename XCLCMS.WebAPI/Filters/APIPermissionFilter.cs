using System;
using System.Linq;
using System.Net.Http;
using System.Web.Http.Controllers;

namespace XCLCMS.WebAPI.Filters
{
    /// <summary>
    /// web api 权限验证
    /// </summary>
    [AttributeUsage(AttributeTargets.All, AllowMultiple = true, Inherited = true)]
    public class APIPermissionFilter : System.Web.Http.AuthorizeAttribute
    {
        private readonly XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();

        private readonly XCLCMS.Data.WebAPIEntity.APIResponseEntity<object> unauthorizedResponse = new XCLCMS.Data.WebAPIEntity.APIResponseEntity<object>()
        {
            ErrorCode = "403",
            IsException = true,
            IsSuccess = false,
            Message = "您没有权限访问！"
        };

        /// <summary>
        /// 是否必须验证登录
        /// </summary>
        public bool IsMustLogin { get; set; }

        /// <summary>
        /// 判断最终是否有权限访问
        /// </summary>
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            #region 获取参数信息

            var bodyModel = XCLCMS.WebAPI.Library.Common.GetInfoFromActionContext(actionContext);
            if (null == bodyModel)
            {
                this.unauthorizedResponse.Message = "不是完全公开的操作，必须要指定相应的请求参数信息！";
                return false;
            }

            #endregion 获取参数信息

            #region 应用AppKey校验

            var merchantAppModel = this.merchantAppBLL.GetModel(bodyModel.AppKey);
            if (null == merchantAppModel)
            {
                this.unauthorizedResponse.Message = "应用AppKey校验失败，系统已阻止您的访问！";
                return false;
            }
            if (merchantAppModel.RecordState != XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString())
            {
                this.unauthorizedResponse.Message = string.Format("应用号【{0}】已被禁用，系统已阻止您的访问！", merchantAppModel.MerchantAppID);
                return false;
            }

            #endregion 应用AppKey校验

            #region 无需校验

            var openFlagAttrs = actionContext.ActionDescriptor.GetCustomAttributes<XCLCMS.WebAPI.Filters.APIOpenPermissionFilter>();
            if (null != openFlagAttrs && openFlagAttrs.Count > 0)
            {
                return true;
            }

            #endregion 无需校验

            #region 当前登录用户权限校验

            if (!this.IsMustLogin)
            {
                return true;
            }

            var attrs = actionContext.ActionDescriptor.GetCustomAttributes<XCLCMS.Lib.Filters.FunctionFilter>();
            if (null == attrs || attrs.Count == 0)
            {
                return true;
            }

            var userInfo = XCLCMS.WebAPI.Library.Common.GetUserInfoByUserToken(bodyModel.UserToken);

            if (null == userInfo)
            {
                this.unauthorizedResponse.Message = "无效的登录令牌，没有找到任何用户信息，系统已阻止您的访问！";
                return false;
            }

            var funList = attrs.Select(k => k.Function).ToList();
            var hasPermission = XCLCMS.Lib.Permission.PerHelper.HasAnyPermission(userInfo.UserInfoID, funList);
            if (!hasPermission)
            {
                this.unauthorizedResponse.Message = "您没有权限访问该操作！";
            }
            return hasPermission;

            #endregion 当前登录用户权限校验
        }

        /// <summary>
        /// 当判断没有权限访问时，需要执行的内容（IsAuthorized 返回false时，才会执行）
        /// </summary>
        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            actionContext.Response = new System.Net.Http.HttpResponseMessage()
            {
                Content = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(this.unauthorizedResponse), System.Text.Encoding.UTF8)
            };
        }
    }
}