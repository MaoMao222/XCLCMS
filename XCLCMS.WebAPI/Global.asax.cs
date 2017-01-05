using Autofac;
using Autofac.Integration.WebApi;
using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace XCLCMS.WebAPI
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            //autofac配置
            var webApiBaseType = typeof(XCLCMS.IService.WebAPI.IBaseInfo);
            var assembly = Assembly.GetExecutingAssembly();
            var builder = new ContainerBuilder();
            var config = GlobalConfiguration.Configuration;
            builder.RegisterApiControllers(assembly);
            builder.RegisterWebApiFilterProvider(config);
            builder.RegisterAssemblyTypes(Assembly.Load("XCLCMS.Service.WebAPI")).Where(k => webApiBaseType.IsAssignableFrom(k) && k != webApiBaseType).AsImplementedInterfaces().InstancePerLifetimeScope();
            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);

            //XCLNetLogger配置信息
            XCLNetLogger.Config.LogConfig.SetConfig(Server.MapPath("~/Config/XCLNetLogger.config"));
        }
    }
}