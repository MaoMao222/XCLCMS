using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:SysLog
    /// </summary>
    public partial class SysLog : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.SysLog> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM SysLog  WITH(NOLOCK)  ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.SysLog>(dr);
            }
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.SysLog> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            condition.TableName = "SysLog";
            return XCLCMS.Data.DAL.Common.Common.GetPageList<XCLCMS.Data.Model.SysLog>(pageInfo, condition);
        }

        /// <summary>
        /// 删除指定时间范围内的记录
        /// </summary>
        /// <param name="startTime">开始时间</param>
        /// <param name="endTime">结束时间</param>
        /// <param name="merchantID">商户号</param>
        public bool ClearListByDateTime(DateTime? startTime, DateTime? endTime, long merchantID)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append(" DELETE FROM dbo.SysLog WHERE 1=1 ");
            if (merchantID > 0)
            {
                strSql.Append(" and FK_MerchantID= " + merchantID);
            }
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());

            if (null != startTime)
            {
                dbCommand.CommandText += " and CreateTime>=@StartTime ";
                db.AddInParameter(dbCommand, "StartTime", DbType.DateTime, (DateTime)startTime);
            }

            if (null != endTime)
            {
                dbCommand.CommandText += " and CreateTime<=@EndTime ";
                db.AddInParameter(dbCommand, "EndTime", DbType.DateTime, (DateTime)endTime);
            }

            return db.ExecuteNonQuery(dbCommand) >= 0;
        }
    }
}