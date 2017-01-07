using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XCLCMS.IService.Logger
{
    /// <summary>
    /// 要写入的日志model
    /// </summary>
    public class LogModel
    {
        /// <summary>
        /// 日志级别  (默认INFO)
        /// </summary>
        public XCLCMS.IService.Logger.LogEnum.LogLevel LogLevel { get; set; } = LogEnum.LogLevel.INFO;

        /// <summary>
        /// 分类
        /// </summary>
        public string LogType { get; set; }

        /// <summary>
        /// 来源
        /// </summary>
        public string RefferUrl { get; set; }

        /// <summary>
        /// 当前写日志的页面
        /// </summary>
        public string Url { get; set; }

        /// <summary>
        /// 日志代码
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public string Contents { get; set; }

        /// <summary>
        /// 客户端ip
        /// </summary>
        public string ClientIP { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }

        /// <summary>
        /// 创建时间  (默认为DateTime.Now)
        /// </summary>
        public DateTime CreateTime { get; set; } = DateTime.Now;
    }
}