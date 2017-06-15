using Newtonsoft.Json.Serialization;
using System.Web.Http;

namespace XCLCMS.WebAPI
{
    /// <summary>
    /// web api配置
    /// </summary>
    public static class WebApiConfig
    {
        /// <summary>
        /// 注册
        /// </summary>
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "v1/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new DefaultContractResolver();
        }
    }
}