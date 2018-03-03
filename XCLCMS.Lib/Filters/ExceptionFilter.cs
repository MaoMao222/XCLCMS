using System;
using System.Web;
using System.Web.Mvc;

namespace XCLCMS.Lib.Filters
{
    /// <summary>
    /// 异常处理
    /// </summary>
    [AttributeUsage(AttributeTargets.All, AllowMultiple = true, Inherited = true)]
    public class ExceptionFilter : FilterAttribute, IExceptionFilter
    {
        /// <summary>
        /// 异常
        /// </summary>
        public void OnException(ExceptionContext filterContext)
        {
            var ex = filterContext.Exception;
            var request = filterContext.RequestContext.HttpContext.Request;

            //获取异常信息
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();
            msgModel.IsSuccess = false;
            msgModel.Date = DateTime.Now;
            msgModel.ErrorCode = "";
            msgModel.FromUrl = request.UrlReferrer?.AbsoluteUri;
            msgModel.Message = ex.Message;
            msgModel.MessageMore = ex.StackTrace;
            msgModel.Title = "系统出错了";
            msgModel.Url = request.Url?.AbsoluteUri;
            var httpExp = ex as HttpException;
            if (null != httpExp)
            {
                msgModel.ErrorCode = Convert.ToString(httpExp.GetHttpCode());
            }
            if (string.IsNullOrWhiteSpace(msgModel.ErrorCode))
            {
                msgModel.ErrorCode = "500";
            }

            //写入日志
            var logModel = new XCLCMS.Data.Model.SysLog();
            logModel.Contents = string.Format("{0}——{1}", msgModel.Message, msgModel.MessageMore);
            logModel.LogLevel = XCLCMS.Data.CommonHelper.EnumType.LogLevelEnum.ERROR.ToString();
            logModel.RefferUrl = msgModel.FromUrl ?? string.Empty;
            logModel.Title = msgModel.Title;
            logModel.Url = msgModel.Url ?? string.Empty;
            logModel.Code = msgModel.ErrorCode;
            XCLCMS.Lib.Common.Log.WriteLog(logModel);

            //输出异常
            //msgModel.MessageMore = null;
            if (msgModel.IsAjax)
            {
                filterContext.Result = new JsonResult()
                {
                    Data = msgModel,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            else
            {
                filterContext.Result = new ViewResult()
                {
                    ViewName = "~/Views/Common/Error.cshtml",
                    ViewData = new ViewDataDictionary(msgModel)
                };
            }

            filterContext.ExceptionHandled = true;
            filterContext.HttpContext.Response.StatusCode = 500;
        }
    }
}