using System;

namespace XCLCMS.IService.Logger
{
    public interface ILogService
    {
        void WriteLog(LogEnum.LogLevel logLevel, string title, string contents = null);

        void WriteLog(Exception ex, string remark = null);

        void WriteLog(LogModel model);
    }
}