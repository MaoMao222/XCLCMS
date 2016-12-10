namespace XCLCMS.Data.BLL.Strategy
{
    /// <summary>
    /// 上下文基类
    /// </summary>
    public class BaseContext
    {
        /// <summary>
        /// 当前上下文信息
        /// </summary>
        public XCLCMS.Data.Model.Custom.ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 操作类型枚举
        /// </summary>
        public XCLCMS.Data.BLL.Strategy.StrategyLib.HandleType HandleType { get; set; }
    }
}