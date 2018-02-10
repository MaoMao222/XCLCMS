using System.Collections.Generic;

namespace XCLCMS.Data.BLL.View
{
    public class v_Tags
    {
        private readonly XCLCMS.Data.DAL.View.v_Tags dal = new XCLCMS.Data.DAL.View.v_Tags();

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_Tags GetModel(long TagsID)
        {
            return dal.GetModel(TagsID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Tags> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Tags> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            return dal.GetPageList(pageInfo, condition);
        }
    }
}