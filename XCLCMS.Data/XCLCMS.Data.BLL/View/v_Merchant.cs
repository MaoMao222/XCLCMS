using System.Collections.Generic;

namespace XCLCMS.Data.BLL.View
{
    public class v_Merchant
    {
        private readonly XCLCMS.Data.DAL.View.v_Merchant dal = new XCLCMS.Data.DAL.View.v_Merchant();

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_Merchant GetModel(long ArticleID)
        {
            return dal.GetModel(ArticleID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Merchant> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Merchant> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            return dal.GetPageList(pageInfo, condition);
        }
    }
}