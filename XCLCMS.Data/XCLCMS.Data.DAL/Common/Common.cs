using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace XCLCMS.Data.DAL.Common
{
    /// <summary>
    /// DAL层公共方法
    /// </summary>
    public class Common
    {
        /// <summary>
        /// 分页
        /// </summary>
        public static List<T> GetPageList<T>(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition) where T : new()
        {
            condition.PageIndex = pageInfo.PageIndex;
            condition.PageSize = pageInfo.PageSize;

            string strSql = XCLNetTools.DataBase.SQLLibrary.CreatePagerQuerySqlString(condition);
            using (var db = new XCLCMS.Data.DAL.Common.BaseDAL().CreateSqlConnection())
            {
                var ps = new DynamicParameters();
                ps.Add("@TotalCount", dbType: DbType.Int32, direction: ParameterDirection.Output);
                using (var dr = db.ExecuteReader(strSql, ps))
                {
                    var lst = XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<T>(dr);
                    pageInfo.RecordCount = ps.Get<int>("@TotalCount");
                    return lst;
                }
            }
        }

        /// <summary>
        /// 垃圾数据清理
        /// </summary>
        public static void ClearRubbishData()
        {
            using (var db = new XCLCMS.Data.DAL.Common.BaseDAL().CreateSqlConnection())
            {
                db.Execute("sp_ClearRubbishData", commandType: CommandType.StoredProcedure);
            }
        }

        /// <summary>
        /// 从存储过程参数中获取存储过程的执行结果
        /// </summary>
        /// <param name="parameters">存储过程参数</param>
        public static XCLCMS.Data.Model.Custom.ProcedureResultModel GetProcedureResult(DbParameterCollection parameters)
        {
            XCLCMS.Data.Model.Custom.ProcedureResultModel model = new XCLCMS.Data.Model.Custom.ProcedureResultModel();
            model.IsSuccess = true;

            if (null != parameters && parameters.Count > 0)
            {
                if (parameters.Contains("@ResultCode"))
                {
                    model.ResultCode = Int32.Parse(Convert.ToString(parameters["@ResultCode"].Value));
                    model.IsSuccess = (model.ResultCode == 1);
                }
                if (parameters.Contains("@ResultMessage"))
                {
                    model.ResultMessage = Convert.ToString(parameters["@ResultMessage"].Value);
                }
            }

            return model;
        }
    }
}