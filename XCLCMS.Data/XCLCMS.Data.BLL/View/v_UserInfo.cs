using System.Collections.Generic;

namespace XCLCMS.Data.BLL.View
{
    /// <summary>
    /// v_UserInfo
    /// </summary>
    public partial class v_UserInfo
    {
        private readonly XCLCMS.Data.DAL.View.v_UserInfo dal = new XCLCMS.Data.DAL.View.v_UserInfo();

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_UserInfo GetModel(long UserInfoID)
        {
            return dal.GetModel(UserInfoID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_UserInfo> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_UserInfo> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            return dal.GetPageList(pageInfo, condition);
        }
    }
}