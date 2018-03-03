using System;
using System.Collections.Generic;

namespace XCLCMS.Data.BLL
{
    /// <summary>
    /// 系统日志记录
    /// </summary>
    public partial class SysLog
    {
        private readonly XCLCMS.Data.DAL.SysLog dal = new XCLCMS.Data.DAL.SysLog();

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.SysLog model)
        {
            return dal.Add(model);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.SysLog> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.SysLog> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            return dal.GetPageList(pageInfo, condition);
        }

        /// <summary>
        /// 删除指定时间范围内的记录
        /// </summary>
        /// <param name="startTime">开始时间</param>
        /// <param name="endTime">结束时间</param>
        /// <param name="merchantID">商户号</param>
        public bool ClearListByDateTime(DateTime? startTime, DateTime? endTime, long merchantID)
        {
            return dal.ClearListByDateTime(startTime, endTime, merchantID);
        }
    }
}