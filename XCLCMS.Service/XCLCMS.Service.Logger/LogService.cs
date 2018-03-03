using System;
using System.Web;
using XCLCMS.IService.Logger;

namespace XCLCMS.Service.Logger
{
    /// <summary>
    /// XCLNetLogger 服务
    /// </summary>
    public class LogService : ILogService
    {
        public readonly XCLCMS.Data.BLL.SysLog sysLogBLL = new Data.BLL.SysLog();

        public void WriteLog(LogModel model)
        {
            XCLNetLogger.Log.WriteLog(new XCLNetLogger.Model.LogModel()
            {
                ClientIP = model.ClientIP,
                Code = model.Code,
                Contents = model.Contents,
                CreateTime = model.CreateTime,
                LogLevel = (XCLNetLogger.Config.LogConfig.LogLevel)((int)model.LogLevel),
                LogType = model.LogType,
                RefferUrl = model.RefferUrl,
                Remark = model.Remark,
                Title = model.Title,
                Url = model.Url
            });

            var m = new XCLCMS.Data.Model.SysLog();
            m.ClientIP = model.ClientIP;
            m.Code = model.Code;
            m.Contents = model.Contents;
            m.CreateTime = model.CreateTime;
            m.LogLevel = model.LogLevel.ToString();
            m.
        }

        public void WriteLog(Exception ex, string remark = null)
        {
            XCLNetLogger.Log.WriteLog(ex, remark);
        }

        public void WriteLog(LogEnum.LogLevel logLevel, string title, string contents = null)
        {
            XCLNetLogger.Log.WriteLog((XCLNetLogger.Config.LogConfig.LogLevel)((int)logLevel), title, contents);
        }
    }
}