using System;
using System.Web;
using XCLCMS.Lib.Model;

namespace XCLCMS.Lib.Common
{
    /// <summary>
    /// 日志记录（调用web api）
    /// </summary>
    public static class Log
    {
        private static XCLCMS.Lib.Model.LogContext GetContext()
        {
            var context = new XCLCMS.Lib.Model.LogContext();
            var app = XCLCMS.Lib.Common.Comm.GetCurrentApplicationMerchantApp();
            context.MerchantID = (app?.FK_MerchantID).Value;
            context.MerchantAppID = (app?.MerchantAppID).Value;
            context.UserToken = XCLCMS.Lib.Common.Comm.GetCurrentApplicationMerchantMainUserToken();
            if (string.IsNullOrWhiteSpace(context.UserToken))
            {
                context.UserToken = XCLCMS.Lib.Common.LoginHelper.GetUserInfoFromLoginInfo()?.Token;
            }
            context.ClientIP = XCLNetTools.Common.IPHelper.GetClientIP();
            return context;
        }

        /// <summary>
        /// 写日志
        /// </summary>
        public static void WriteLog(XCLCMS.Data.Model.SysLog model)
        {
            try
            {
                var context = Log.GetContext();
                if (null == model.ClientIP)
                {
                    model.ClientIP = context.ClientIP;
                }
                model.FK_MerchantID = context.MerchantID;
                model.FK_MerchantAppID = context.MerchantAppID;
                if (null == model.RefferUrl)
                {
                    model.RefferUrl = HttpContext.Current?.Request?.UrlReferrer?.AbsoluteUri;
                }
                if (null == model.Url)
                {
                    model.Url = HttpContext.Current?.Request?.Url?.AbsoluteUri;
                }
                var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.SysLog>(context.UserToken);
                request.Body = model;
                XCLCMS.Lib.WebAPI.SysLogAPI.Add(request);
            }
            catch
            {
                //
            }
        }

        /// <summary>
        /// 写异常日志
        /// </summary>
        public static void WriteLog(Exception ex, string remark = null)
        {
            var model = new XCLCMS.Data.Model.SysLog();
            model.Code = "500";
            model.Contents = ex.Message;
            model.LogLevel = XCLCMS.Data.CommonHelper.EnumType.LogLevelEnum.ERROR.ToString();
            model.LogType = XCLCMS.Data.CommonHelper.EnumType.LogTypeEnum.SYSTEM.ToString();
            model.Remark = remark;
            model.Title = "系统出错了";
            Log.WriteLog(model);
        }

        /// <summary>
        /// 写日志
        /// </summary>
        public static void WriteLog(XCLCMS.Data.CommonHelper.EnumType.LogLevelEnum logLevel, string title, string contents = null)
        {
            var model = new XCLCMS.Data.Model.SysLog();
            model.Code = null;
            model.Contents = contents;
            model.LogLevel = logLevel.ToString();
            model.LogType = XCLCMS.Data.CommonHelper.EnumType.LogTypeEnum.SYSTEM.ToString();
            model.Remark = null;
            model.Title = title;
            Log.WriteLog(model);
        }
    }
}