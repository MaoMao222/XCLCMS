using System;
using System.Web;

namespace XCLCMS.WebAPI.Library
{
    /// <summary>
    /// 日志记录（写库）
    /// </summary>
    public static class Log
    {
        /// <summary>
        /// 写日志
        /// </summary>
        public static void WriteLog(XCLCMS.Data.Model.SysLog model)
        {
            var sysLogBLL = new Data.BLL.SysLog();
            var merchantAppBLL = new Data.BLL.MerchantApp();
            var app = merchantAppBLL.GetModel(XCLCMS.Lib.Common.Comm.AppKey);
            model.FK_MerchantAppID = app.MerchantAppID;
            model.FK_MerchantID = app.FK_MerchantID;
            model.RefferUrl = HttpContext.Current?.Request?.UrlReferrer?.AbsoluteUri;
            model.Url = HttpContext.Current?.Request?.Url?.AbsoluteUri;
            model.CreateTime = DateTime.Now;
            model.SysLogID = 0;
            model.ClientIP = XCLNetTools.Common.IPHelper.GetClientIP();
            sysLogBLL.Add(model);
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
            model.ClientIP = XCLNetTools.Common.IPHelper.GetClientIP();
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