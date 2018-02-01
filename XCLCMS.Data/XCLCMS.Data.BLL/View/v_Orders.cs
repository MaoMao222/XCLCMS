using System.Collections.Generic;

namespace XCLCMS.Data.BLL.View
{
    public class v_Orders
    {
        private readonly XCLCMS.Data.DAL.View.v_Orders dal = new XCLCMS.Data.DAL.View.v_Orders();

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_Orders GetModel(long AdsID)
        {
            return dal.GetModel(AdsID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Orders> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Orders> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            return dal.GetPageList(pageInfo, condition);
        }
    }
}