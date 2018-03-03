using System.Linq;
using System.Web.Mvc;
using XCLNetTools.Generic;

namespace XCLCMS.View.AdminWeb.Controllers
{
    /// <summary>
    /// 基类
    /// </summary>
    [XCLCMS.Lib.Filters.PermissionFilter(IsMustLogin = true)]
    public class BaseController : XCLCMS.Lib.Base.AbstractBaseController
    {
        #region 拦截器

        /// <summary>
        /// 拦截action
        /// </summary>
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

            //主模板数据
            XCLCMS.View.AdminWeb.Models.Main.MainVM mainViewModel = new XCLCMS.View.AdminWeb.Models.Main.MainVM();

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<object>(base.UserToken);
            request.Body = new object();
            var response = XCLCMS.Lib.WebAPI.SysDicAPI.GetSystemMenuModelList(request);

            var allMenuList = response.Body;
            if (allMenuList.IsNotNullOrEmpty())
            {
                mainViewModel.MenuList = allMenuList.Where(k => k.FK_FunctionID == null || XCLCMS.Lib.Permission.PerHelper.HasPermission(base.UserID, (XCLCMS.Data.CommonHelper.Function.FunctionEnum)k.FK_FunctionID)).ToList();
            }
            ViewBag.MainViewModel = mainViewModel;
        }

        #endregion 拦截器
    }
}