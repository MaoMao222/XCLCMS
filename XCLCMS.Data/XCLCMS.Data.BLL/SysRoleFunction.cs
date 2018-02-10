using System.Collections.Generic;

namespace XCLCMS.Data.BLL
{
    /// <summary>
    /// 角色功能关系表
    /// </summary>
    public partial class SysRoleFunction
    {
        private readonly XCLCMS.Data.DAL.SysRoleFunction dal = new XCLCMS.Data.DAL.SysRoleFunction();

        /// <summary>
        /// 增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.SysRoleFunction model, List<long> functionIdList = null)
        {
            return dal.Add(model, functionIdList);
        }

        /// <summary>
        /// 清理无效的普通商户角色的无效权限
        /// </summary>
        public void ClearInvalidNormalRoleFunctions()
        {
            dal.ClearInvalidNormalRoleFunctions();
        }
    }
}