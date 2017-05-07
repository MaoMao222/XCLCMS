using System;

namespace XCLCMS.Data.Model.Custom
{
    /// <summary>
    /// 上下文
    /// </summary>
    [Serializable]
    public class ContextModel
    {
        /// <summary>
        /// 用户id
        /// </summary>
        public long UserInfoID { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }
    }
}