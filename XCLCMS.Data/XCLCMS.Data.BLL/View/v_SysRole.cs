using System.Collections.Generic;

namespace XCLCMS.Data.BLL.View
{
    /// <summary>
    /// v_SysRole
    /// </summary>
    public partial class v_SysRole
    {
        private readonly XCLCMS.Data.DAL.View.v_SysRole dal = new XCLCMS.Data.DAL.View.v_SysRole();

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_SysRole GetModel(long SysRoleID)
        {
            return dal.GetModel(SysRoleID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysRole> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 根据parentID返回列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysRole> GetList(long parentID)
        {
            return dal.GetList(parentID);
        }

        /// <summary>
        /// 根据code查询model
        /// </summary>
        public XCLCMS.Data.Model.View.v_SysRole GetModelByCode(string code)
        {
            return dal.GetModelByCode(code);
        }

        /// <summary>
        /// 判断指定角色是否为根节点
        /// </summary>
        public bool IsRoot(long sysRoleID)
        {
            var model = this.GetModel(sysRoleID);
            if (null != model)
            {
                return model.IsRoot == 1;
            }
            return false;
        }

        /// <summary>
        /// 返回商户下的所有角色
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysRole> GetListByMerchantID(long merchantID)
        {
            return dal.GetListByMerchantID(merchantID);
        }

        /// <summary>
        /// 返回商户下的所有角色数量
        /// </summary>
        public int GetCountByMerchantID(long merchantID)
        {
            var lst = this.GetListByMerchantID(merchantID);
            return null == lst ? 0 : lst.Count;
        }
    }
}