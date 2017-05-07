namespace XCLCMS.Data.BLL.Strategy
{
    /// <summary>
    /// 上下文基类
    /// </summary>
    public class BaseContext
    {
        private XCLCMS.Data.Model.Custom.ContextModel _contextInfo = null;

        /// <summary>
        /// 当前上下文信息
        /// </summary>
        public XCLCMS.Data.Model.Custom.ContextModel ContextInfo
        {
            get
            {
                return this._contextInfo ?? new Model.Custom.ContextModel();
            }
            set
            {
                this._contextInfo = value;
            }
        }

        /// <summary>
        /// 操作类型枚举
        /// </summary>
        public XCLCMS.Data.BLL.Strategy.StrategyLib.HandleType HandleType { get; set; }
    }
}