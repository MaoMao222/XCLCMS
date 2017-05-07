using System;

namespace XCLCMS.Data.Model.Custom
{
    /// <summary>
    /// 角色简版实体
    /// </summary>
    [Serializable]
    public class SysRoleSimple
    {
        /// <summary>
        /// 角色ID
        /// </summary>
        public long SysRoleID
        {
            get;
            set;
        }

        /// <summary>
        /// 父ID
        /// </summary>
        public long ParentID
        {
            get;
            set;
        }

        /// <summary>
        /// 角色名
        /// </summary>
        public string RoleName
        {
            get;
            set;
        }
    }
}