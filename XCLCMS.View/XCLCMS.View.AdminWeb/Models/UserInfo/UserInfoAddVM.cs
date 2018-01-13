using System.Collections.Generic;

namespace XCLCMS.View.AdminWeb.Models.UserInfo
{
    /// <summary>
    /// 添加与修改用户信息model
    /// </summary>
    public class UserInfoAddVM
    {
        /// <summary>
        /// 表单action
        /// </summary>
        public string FormAction { get; set; }

        /// <summary>
        /// 用户model
        /// </summary>
        public XCLCMS.Data.Model.View.v_UserInfo UserInfo { get; set; }

        /// <summary>
        /// 角色id list
        /// </summary>
        public List<long> UserRoleIDs { get; set; }

        /// <summary>
        /// 记录状态 select的options
        /// </summary>
        public string RecordStateOptions { get; set; }
    }
}