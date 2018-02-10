using System.Collections.Generic;

namespace XCLCMS.Data.BLL.View
{
    /// <summary>
    /// v_SysFunction
    /// </summary>
    public partial class v_SysFunction
    {
        private readonly XCLCMS.Data.DAL.View.v_SysFunction dal = new XCLCMS.Data.DAL.View.v_SysFunction();

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_SysFunction GetModel(long SysFunctionID)
        {
            return dal.GetModel(SysFunctionID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysFunction> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 根据parentID返回列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysFunction> GetList(long parentID)
        {
            return dal.GetList(parentID);
        }
    }
}