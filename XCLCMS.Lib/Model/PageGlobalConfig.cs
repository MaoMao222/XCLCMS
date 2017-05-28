using System;

namespace XCLCMS.Lib.Model
{
    /// <summary>
    /// 页面全局配置（序列化为json）
    /// </summary>
    [Serializable]
    public class PageGlobalConfig
    {
        /// <summary>
        /// 当前应用程序的应用号
        /// </summary>
        public long AppID { get; set; }

        /// <summary>
        /// 当前应用程序的应用Key
        /// </summary>
        public string AppKey { get; set; }

        /// <summary>
        /// 用户ID
        /// </summary>
        public long UserID { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// 用户token
        /// </summary>
        public string UserToken { get; set; }

        /// <summary>
        /// 当前用户是否已登录
        /// </summary>
        public bool IsLogOn { get; set; }

        /// <summary>
        /// 站点根路径
        /// </summary>
        public string RootURL { get; set; }

        /// <summary>
        /// 枚举json
        /// </summary>
        public string EnumConfig { get; set; }

        /// <summary>
        /// 文件管理器文件列表路径
        /// </summary>
        public string FileManagerFileListURL { get; set; }

        /// <summary>
        /// 文件管理器逻辑文件列表路径
        /// </summary>
        public string FileManagerLogicFileListURL { get; set; }

        /// <summary>
        /// web api服务地址
        /// </summary>
        public string WebAPIServiceURL { get; set; }

        /// <summary>
        /// clientip
        /// </summary>
        public string ClientIP { get; set; }

        /// <summary>
        /// url
        /// </summary>
        public string Url { get; set; }

        /// <summary>
        /// 来源url
        /// </summary>
        public string Reffer { get; set; }
    }
}