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
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.SysLog model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_SysLog_ADD");
            db.AddOutParameter(dbCommand, "SysLogID", DbType.Int64, 8);
            db.AddInParameter(dbCommand, "LogLevel", DbType.AnsiString, model.LogLevel);
            db.AddInParameter(dbCommand, "LogType", DbType.AnsiString, model.LogType);
            db.AddInParameter(dbCommand, "RefferUrl", DbType.AnsiString, model.RefferUrl);
            db.AddInParameter(dbCommand, "Url", DbType.AnsiString, model.Url);
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, model.Code);
            db.AddInParameter(dbCommand, "Title", DbType.AnsiString, model.Title);
            db.AddInParameter(dbCommand, "Contents", DbType.AnsiString, model.Contents);
            db.AddInParameter(dbCommand, "ClientIP", DbType.AnsiString, model.ClientIP);
            db.AddInParameter(dbCommand, "Remark", DbType.AnsiString, model.Remark);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
            db.AddInParameter(dbCommand, "FK_MerchantAppID", DbType.Int64, model.FK_MerchantAppID);
            db.AddInParameter(dbCommand, "CreateTime", DbType.DateTime, model.CreateTime);

            db.AddOutParameter(dbCommand, "ResultCode", DbType.Int32, 4);
            db.AddOutParameter(dbCommand, "ResultMessage", DbType.String, 1000);
            db.ExecuteNonQuery(dbCommand);

            var result = XCLCMS.Data.DAL.Common.Common.GetProcedureResult(dbCommand.Parameters);
            if (result.IsSuccess)
            {
                return true;
            }
            else
            {
                throw new Exception(result.ResultMessage);
            }
        }

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