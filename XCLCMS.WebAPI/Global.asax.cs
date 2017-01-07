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
            var webApiBaseType = typeof(XCLCMS.IService.WebAPI.IBaseInfoService);
            var loggerType = typeof(XCLCMS.IService.Logger.ILogService);
            var assembly = Assembly.GetExecutingAssembly();
            var builder = new ContainerBuilder();
            var config = GlobalConfiguration.Configuration;
            builder.RegisterApiControllers(assembly).PropertiesAutowired();
            builder.RegisterWebApiFilterProvider(config);
            //web api服务注册
            builder.RegisterAssemblyTypes(Assembly.Load("XCLCMS.Service.WebAPI")).Where(k => webApiBaseType.IsAssignableFrom(k) && k != webApiBaseType).AsImplementedInterfaces().InstancePerLifetimeScope();
            //XCLNetLogger服务注册
            builder.RegisterAssemblyTypes(Assembly.Load("XCLCMS.Service.Logger")).Where(k => loggerType.IsAssignableFrom(k) && k != loggerType).AsImplementedInterfaces().SingleInstance();
            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }
    }
}