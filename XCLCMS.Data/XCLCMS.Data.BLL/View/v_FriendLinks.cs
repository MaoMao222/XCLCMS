using System.Collections.Generic;

namespace XCLCMS.Data.BLL.View
{
    public class v_FriendLinks
    {
        private readonly XCLCMS.Data.DAL.View.v_FriendLinks dal = new XCLCMS.Data.DAL.View.v_FriendLinks();

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_FriendLinks GetModel(long FriendLinkID)
        {
            return dal.GetModel(FriendLinkID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_FriendLinks> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_FriendLinks> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            return dal.GetPageList(pageInfo, condition);
        }
    }
}