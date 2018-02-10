using System.Collections.Generic;

namespace XCLCMS.Data.BLL.View
{
    public class v_SysWebSetting
    {
        private readonly XCLCMS.Data.DAL.View.v_SysWebSetting dal = new XCLCMS.Data.DAL.View.v_SysWebSetting();

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_SysWebSetting GetModel(long SysWebSettingID)
        {
            return dal.GetModel(SysWebSettingID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysWebSetting> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysWebSetting> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            return dal.GetPageList(pageInfo, condition);
        }
    }
}