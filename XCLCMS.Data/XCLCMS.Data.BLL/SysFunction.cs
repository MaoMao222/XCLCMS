using System.Collections.Generic;

namespace XCLCMS.Data.BLL
{
    /// <summary>
    /// 系统功能表
    /// </summary>
    public partial class SysFunction
    {
        private readonly XCLCMS.Data.DAL.SysFunction dal = new XCLCMS.Data.DAL.SysFunction();

        /// <summary>
        /// 增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.SysFunction model)
        {
            return dal.Add(model);
        }

        /// <summary>
        /// 更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.SysFunction model)
        {
            return dal.Update(model);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.SysFunction GetModel(long SysFunctionID)
        {
            return dal.GetModel(SysFunctionID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.SysFunction> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 判断功能标识是否存在
        /// </summary>
        public bool IsExistCode(string code)
        {
            return dal.IsExistCode(code);
        }

        /// <summary>
        /// 验证某个用户是否拥有指定功能列表中的某个功能权限
        /// </summary>
        public bool CheckUserHasAnyFunction(long userId, List<long> functionList)
        {
            return dal.CheckUserHasAnyFunction(userId, functionList);
        }

        /// <summary>
        /// 获取指定角色的所有功能
        /// </summary>
        /// <param name="sysRoleID">角色ID</param>
        public List<XCLCMS.Data.Model.SysFunction> GetListByRoleID(long sysRoleID)
        {
            return dal.GetListByRoleID(sysRoleID);
        }

        /// <summary>
        /// 获取当前SysFunctionID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        public List<XCLCMS.Data.Model.Custom.SysFunctionSimple> GetLayerListBySysFunctionId(long sysFunctionId)
        {
            return dal.GetLayerListBySysFunctionID(sysFunctionId);
        }

        /// <summary>
        /// 删除指定SysFunctionId下面的子节点
        /// </summary>
        public bool DelChild(XCLCMS.Data.Model.SysFunction model)
        {
            return dal.DelChild(model);
        }

        /// <summary>
        /// 根据SysFunctionID查询其子项
        /// </summary>
        public List<XCLCMS.Data.Model.SysFunction> GetChildListByID(long sysFunctionID)
        {
            return dal.GetChildListByID(sysFunctionID);
        }
    }
}