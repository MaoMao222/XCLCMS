using System.Collections.Generic;

namespace XCLCMS.Data.BLL.View
{
    public class v_Ads
    {
        private readonly XCLCMS.Data.DAL.View.v_Ads dal = new XCLCMS.Data.DAL.View.v_Ads();

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_Ads GetModel(long AdsID)
        {
            return dal.GetModel(AdsID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Ads> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Ads> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            return dal.GetPageList(pageInfo, condition);
        }
    }
}