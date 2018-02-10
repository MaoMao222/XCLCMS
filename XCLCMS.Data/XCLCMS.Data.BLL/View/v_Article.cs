using System.Collections.Generic;

namespace XCLCMS.Data.BLL.View
{
    public class v_Article
    {
        private readonly XCLCMS.Data.DAL.View.v_Article dal = new XCLCMS.Data.DAL.View.v_Article();

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_Article GetModel(long ArticleID)
        {
            return dal.GetModel(ArticleID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Article> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Article> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            return dal.GetPageList(pageInfo, condition);
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Article> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLCMS.Data.Model.Custom.ArticleSearchCondition condition)
        {
            return dal.GetPageList(pageInfo, condition);
        }
    }
}