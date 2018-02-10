using System.Collections.Generic;

namespace XCLCMS.Data.BLL.View
{
    public class v_MerchantApp
    {
        private readonly XCLCMS.Data.DAL.View.v_MerchantApp dal = new XCLCMS.Data.DAL.View.v_MerchantApp();

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_MerchantApp GetModel(long MerchantAppID)
        {
            return dal.GetModel(MerchantAppID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_MerchantApp> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_MerchantApp> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            return dal.GetPageList(pageInfo, condition);
        }
    }
}