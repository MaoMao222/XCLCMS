using System.Collections.Generic;

namespace XCLCMS.Data.BLL.View
{
    public class v_KeyValueInfo
    {
        private readonly XCLCMS.Data.DAL.View.v_KeyValueInfo dal = new XCLCMS.Data.DAL.View.v_KeyValueInfo();

        #region BasicMethod

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_KeyValueInfo GetModel(long KeyValueID)
        {
            return dal.GetModel(KeyValueID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_KeyValueInfo> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        #endregion BasicMethod

        #region Extend Method

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_KeyValueInfo> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            return dal.GetPageList(pageInfo, condition);
        }

        #endregion Extend Method
    }
}