using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace XCLCMS.Lib.Filters
{
    /// <summary>
    /// 权限拦截
    /// </summary>
    [AttributeUsage(AttributeTargets.All, AllowMultiple = false, Inherited = true)]
    public class PermissionFilter : AuthorizeAttribute
    {
        /// <summary>
        /// 是否必须验证登录
        /// </summary>
        public bool IsMustLogin { get; set; }

        /// <summary>
        /// 当前用户
        /// </summary>
        private XCLCMS.Data.Model.UserInfo UserInfo { get; set; }

        /// <summary>
        /// 登录权限验证
        /// </summary>
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (!this.IsMustLogin)
            {
                return true;
            }
            bool flag = false;
            var detail = XCLCMS.Lib.Common.LoginHelper.GetUserInfoFromLoginInfo();
            this.UserInfo = null == detail ? null : detail.UserInfo;
            if (null != this.UserInfo)
            {
                flag = true;
            }
            return flag;
        }

        /// <summary>
        /// 处理无权限的请求
        /// </summary>
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            base.HandleUnauthorizedRequest(filterContext);
            if (filterContext.HttpContext.Request.IsAjaxRequest())
            {
                XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();
                msgModel.IsRedirect = true;
                msgModel.RedirectURL = XCLCMS.Lib.Common.Setting.SettingModel.Admin_LogOnURL;
                msgModel.Message = "登录信息验证失败，请重新登录！";
                filterContext.Result = new JsonResult()
                {
                    Data = msgModel,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            else
            {
                filterContext.Result = new RedirectResult(XCLCMS.Lib.Common.Setting.SettingModel.Admin_LogOnURL);
            }
        }

        /// <summary>
        /// 功能权限验证
        /// </summary>
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            base.OnAuthorization(filterContext);

            if (null == this.UserInfo)
            {
                return;
            }

            bool isPass = false;
            object[] attrs = filterContext.ActionDescriptor.GetCustomAttributes(typeof(XCLCMS.Lib.Filters.FunctionFilter), true);
            if (null != attrs && attrs.Length > 0)
            {
                var funList = attrs.Select(k => ((XCLCMS.Lib.Filters.FunctionFilter)(k)).Function).ToList();
                isPass = XCLCMS.Lib.Permission.PerHelper.HasAnyPermission(this.UserInfo.UserInfoID, funList);
                if (!isPass)
                {
                    throw new HttpException(403, "抱歉，您没有权限执行该操作，若有疑问，请联系管理员！");
                }
            }
        }
    }
}