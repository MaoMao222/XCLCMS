using System;

namespace XCLCMS.IService.Logger
{
    /// <summary>
    /// 日志服务
    /// </summary>
    public interface ILogService
    {
        /// <summary>
        /// 写日志
        /// </summary>
        /// <param name="logLevel">日志级别</param>
        /// <param name="title">标题</param>
        /// <param name="contents">内容</param>
        void WriteLog(LogEnum.LogLevel logLevel, string title, string contents = null);

        /// <summary>
        /// 写日志
        /// </summary>
        /// <param name="ex">异常</param>
        /// <param name="remark">备注</param>
        void WriteLog(Exception ex, string remark = null);

        /// <summary>
        /// 写日志
        /// </summary>
        /// <param name="model">日志实体</param>
        void WriteLog(LogModel model);
    }
}