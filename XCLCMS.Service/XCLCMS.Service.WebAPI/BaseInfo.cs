using XCLCMS.IService.WebAPI;

namespace XCLCMS.Service.WebAPI
{
    /// <summary>
    /// 基类
    /// </summary>
    public class BaseInfo : IBaseInfo
    {
        private XCLCMS.Data.Model.Custom.ContextModel _contextModel = null;

        /// <summary>
        /// 构造
        /// </summary>
        public BaseInfo(XCLCMS.Data.Model.Custom.ContextModel model)
        {
            this._contextModel = model;
        }

        /// <summary>
        /// 当前上下文信息
        /// </summary>
        public XCLCMS.Data.Model.Custom.ContextModel ContextInfo
        {
            get
            {
                return this._contextModel ?? new Data.Model.Custom.ContextModel();
            }
            set
            {
                this._contextModel = value;
            }
        }
    }
}