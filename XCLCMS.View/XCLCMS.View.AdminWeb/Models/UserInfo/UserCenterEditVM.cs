using System;
using static XCLCMS.Data.CommonHelper.EnumType;

namespace XCLCMS.View.AdminWeb.Models.UserInfo
{
    /// <summary>
    /// 个人中心信息修改
    /// </summary>
    public class UserCenterEditVM
    {
        /// <summary>
        /// 个人资料
        /// </summary>
        public UserCenterUserBaseInfo UserBaseInfo { get; set; }

        /// <summary>
        /// 个人资料的表单url
        /// </summary>
        public string UserBaseInfoFormAction { get; set; }
    }

    public class UserCenterUserBaseInfo
    {
        public string UserName { get; set; }
        public string MerchantName { get; set; }
        public string MerchantAppName { get; set; }
        public string RealName { get; set; }
        public string NickName { get; set; }
        public string SexType { get; set; }
        public DateTime? Birthday { get; set; }
        public int Age { get; set; }
        public string Tel { get; set; }
        public string QQ { get; set; }
        public string Email { get; set; }
        public string OtherContact { get; set; }
        public string UserStateName { get; set; }
    }
}