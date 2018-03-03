using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Filters;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.WebAPI.Filters
{
    /// <summary>
    /// API异常处理
    /// </summary>
    [AttributeUsage(AttributeTargets.All, AllowMultiple = true, Inherited = true)]
    public class APIExceptionFilter : FilterAttribute, IExceptionFilter
    {
        /// <summary>
        /// 异常处理
        /// </summary>
        public Task ExecuteExceptionFilterAsync(HttpActionExecutedContext actionExecutedContext, CancellationToken cancellationToken)
        {
            return Task.Run(() =>
            {
                XCLCMS.WebAPI.Library.Log.WriteLog(actionExecutedContext.Exception, "Web API发生错误");
                actionExecutedContext.Response = new System.Net.Http.HttpResponseMessage()
                {
                    Content = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(new APIResponseEntity<object>()
                    {
                        IsSuccess = false,
                        Message = actionExecutedContext.Exception.Message,
                        MessageMore = actionExecutedContext.Exception.StackTrace
                    }), System.Text.Encoding.UTF8)
                };
            });
        }
    }
}