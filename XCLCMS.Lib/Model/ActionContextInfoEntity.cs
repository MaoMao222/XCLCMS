using System;

namespace XCLCMS.Lib.Model
{
    /// <summary>
    /// 请求上下文基本信息实体
    /// </summary>
    [Serializable]
    public class ActionContextInfoEntity
    {
        /// <summary>
        /// 应用号
        /// </summary>
        public long AppID { get; set; }

        /// <summary>
        /// 应用key
        /// </summary>
        public string AppKey { get; set; }

        /// <summary>
        /// 用户token令牌
        /// </summary>
        public string UserToken { get; set; }
    }
}