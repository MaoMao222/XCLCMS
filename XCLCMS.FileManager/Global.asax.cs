using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace XCLCMS.FileManager
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            XCLNetTools.FileHandler.FileDirectory.MakeDirectory(XCLNetTools.FileHandler.ComFile.MapPath(XCLCMS.FileManager.Common.Library.FileManager_UploadPath));
            XCLNetTools.FileHandler.FileDirectory.MakeDirectory(XCLNetTools.FileHandler.ComFile.MapPath(XCLCMS.FileManager.Common.Library.FileManager_UploadPathTemp));
        }
    }
}