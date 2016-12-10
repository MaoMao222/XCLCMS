namespace XCLCMS.Data.WebAPIBLL
{
    /// <summary>
    /// 基类
    /// </summary>
    public class BaseInfo
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
                return this._contextModel ?? new Model.Custom.ContextModel();
            }
            set
            {
                this._contextModel = value;
            }
        }

        /// <summary>
        /// 当前用户ID
        /// </summary>
        public long UserID
        {
            get
            {
                return this.ContextInfo.UserInfoID;
            }
        }
    }
}