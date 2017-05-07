using System;

namespace XCLCMS.Data.Model.Custom
{
    /// <summary>
    /// 用户信息详情 实体
    /// </summary>
    [Serializable]
    public class UserInfoDetailModel
    {
        /// <summary>
        /// 用户信息
        /// </summary>
        public XCLCMS.Data.Model.UserInfo UserInfo { get; set; }

        /// <summary>
        /// 登录令牌
        /// </summary>
        public string Token { get; set; }

        /// <summary>
        /// 用户所属商户
        /// </summary>
        public XCLCMS.Data.Model.Merchant Merchant { get; set; }

        /// <summary>
        /// 用户所属商户应用
        /// </summary>
        public XCLCMS.Data.Model.MerchantApp MerchantApp { get; set; }
    }
}