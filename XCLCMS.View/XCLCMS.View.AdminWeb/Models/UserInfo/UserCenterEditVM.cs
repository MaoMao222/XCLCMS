using System;

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
        /// 密码
        /// </summary>
        public UserCenterPasswordInfo PasswordInfo { get; set; }

        /// <summary>
        /// 商户资料
        /// </summary>
        public UserCenterMerchantInfo MerchantInfo { get; set; }

        /// <summary>
        /// 个人资料的表单url
        /// </summary>
        public string UserBaseInfoFormAction { get; set; }

        /// <summary>
        /// 修改密码的表单url
        /// </summary>
        public string PasswordFormAction { get; set; }

        /// <summary>
        /// 商户资料的表单url
        /// </summary>
        public string MerchantInfoFormAction { get; set; }
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

    public class UserCenterPasswordInfo
    {
        public string OldPwd { get; set; }
        public string NewPwd { get; set; }
    }

    public class UserCenterMerchantInfo
    {
        public string MerchantName { get; set; }
        public string MerchantTypeName { get; set; }
        public string Domain { get; set; }
        public string ContactName { get; set; }
        public string Tel { get; set; }
        public string Landline { get; set; }
        public string Email { get; set; }
        public string QQ { get; set; }
        public long FK_PassType { get; set; }
        public string PassNumber { get; set; }
        public string Address { get; set; }
        public string OtherContact { get; set; }
        public string MerchantStateName { get; set; }

        /// <summary>
        /// 证件类型select的option
        /// </summary>
        public string PassTypeOptions { get; set; }
    }
}