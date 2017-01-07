namespace XCLCMS.IService.Logger
{
    public class LogEnum
    {
        /// <summary>
        /// 日志级别
        /// </summary>
        public enum LogLevel
        {
            /// <summary>
            /// 一般信息
            /// </summary>
            INFO,

            /// <summary>
            /// 警告
            /// </summary>
            WARN,

            /// <summary>
            /// 异常
            /// </summary>
            ERROR,

            /// <summary>
            /// 调试信息
            /// </summary>
            DEBUG
        }
    }
}