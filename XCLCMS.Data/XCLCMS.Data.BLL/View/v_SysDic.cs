using System.Collections.Generic;

namespace XCLCMS.Data.BLL.View
{
    public class v_SysDic
    {
        private readonly XCLCMS.Data.DAL.View.v_SysDic dal = new XCLCMS.Data.DAL.View.v_SysDic();

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_SysDic GetModel(long SysDicID)
        {
            return dal.GetModel(SysDicID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysDic> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 根据parentID返回列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysDic> GetList(long parentID)
        {
            return dal.GetList(parentID);
        }

        /// <summary>
        /// 递归获取指定code下的所有列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysDic> GetAllUnderListByCode(string code)
        {
            return dal.GetAllUnderListByCode(code);
        }

        /// <summary>
        /// 递归获取指定SysDicID下的所有列表（不包含该SysDicID的记录）
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysDic> GetAllUnderListByID(long sysDicID)
        {
            return dal.GetAllUnderListByID(sysDicID);
        }

        /// <summary>
        /// 获取所有系统菜单信息
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysDic> GetSystemMenuModelList()
        {
            return dal.GetSystemMenuModelList();
        }

        /// <summary>
        /// 判断指定字典是否为根节点
        /// </summary>
        public bool IsRoot(long sysDicID)
        {
            var model = this.GetModel(sysDicID);
            if (null != model)
            {
                return model.IsRoot == 1;
            }
            return false;
        }
    }
}