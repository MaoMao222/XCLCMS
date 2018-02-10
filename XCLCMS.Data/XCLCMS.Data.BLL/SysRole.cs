using System.Collections.Generic;

namespace XCLCMS.Data.BLL
{
    /// <summary>
    /// 角色表
    /// </summary>
    public partial class SysRole
    {
        private readonly XCLCMS.Data.DAL.SysRole dal = new XCLCMS.Data.DAL.SysRole();

        /// <summary>
        /// 增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.SysRole model)
        {
            return dal.Add(model);
        }

        /// <summary>
        /// 更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.SysRole model)
        {
            return dal.Update(model);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.SysRole GetModel(long SysRoleID)
        {
            return dal.GetModel(SysRoleID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.SysRole> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 获取指定userid的角色
        /// </summary>
        public List<XCLCMS.Data.Model.SysRole> GetListByUserID(long userId)
        {
            return dal.GetListByUserID(userId);
        }

        /// <summary>
        /// 判断功能标识是否存在
        /// </summary>
        public bool IsExistCode(string code)
        {
            return dal.IsExistCode(code);
        }

        /// <summary>
        /// 获取当前SysRoleID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        public List<XCLCMS.Data.Model.Custom.SysRoleSimple> GetLayerListBySysRoleID(long sysRoleID)
        {
            return dal.GetLayerListBySysRoleID(sysRoleID);
        }

        /// <summary>
        /// 删除指定SysRoleId下面的子节点
        /// </summary>
        public bool DelChild(XCLCMS.Data.Model.SysRole model)
        {
            return dal.DelChild(model);
        }

        /// <summary>
        /// 根据SysRoleID查询其子项
        /// </summary>
        public List<XCLCMS.Data.Model.SysRole> GetChildListByID(long sysRoleID)
        {
            return dal.GetChildListByID(sysRoleID);
        }

        /// <summary>
        /// 根据code查询model
        /// </summary>
        public XCLCMS.Data.Model.SysRole GetModelByCode(string code)
        {
            return dal.GetModelByCode(code);
        }

        /// <summary>
        /// 获取根节点model
        /// </summary>
        public XCLCMS.Data.Model.SysRole GetRootModel()
        {
            return this.GetModelByCode(CommonHelper.SysRoleConst.SysRoleCodeEnum.Root.ToString());
        }

        /// <summary>
        /// 根据id批量获取实体
        /// </summary>
        public List<XCLCMS.Data.Model.SysRole> GetModelList(List<long> roleIdList)
        {
            return dal.GetModelList(roleIdList);
        }
    }
}