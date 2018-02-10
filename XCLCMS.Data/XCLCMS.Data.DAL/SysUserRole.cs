using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Text;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:SysUserRole
    /// </summary>
    public partial class SysUserRole : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.SysUserRole> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select FK_UserInfoID,FK_SysRoleID,RecordState,CreateTime,CreaterID,CreaterName,UpdateTime,UpdaterID,UpdaterName ");
            strSql.Append(" FROM SysUserRole  WITH(NOLOCK)  ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.SysUserRole>(dr);
            }
        }

        /// <summary>
        ///  增加一条数据
        ///  注：如果roleIdList为空，则添加model.FK_SysRoleID，否则，则添加roleIdList
        /// </summary>
        public bool Add(XCLCMS.Data.Model.SysUserRole model, List<long> roleIdList = null)
        {
            if (null == roleIdList || roleIdList.Count == 0)
            {
                if (model.FK_SysRoleID > 0)
                {
                    roleIdList = new List<long>() {
                        model.FK_SysRoleID
                    };
                }
            }

            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_SysUserRole_ADD");
            db.AddInParameter(dbCommand, "FK_UserInfoID", DbType.Int64, model.FK_UserInfoID);
            db.AddInParameter(dbCommand, "RecordState", DbType.AnsiString, model.RecordState);
            db.AddInParameter(dbCommand, "CreateTime", DbType.DateTime, model.CreateTime);
            db.AddInParameter(dbCommand, "CreaterID", DbType.Int64, model.CreaterID);
            db.AddInParameter(dbCommand, "CreaterName", DbType.String, model.CreaterName);
            db.AddInParameter(dbCommand, "UpdateTime", DbType.DateTime, model.UpdateTime);
            db.AddInParameter(dbCommand, "UpdaterID", DbType.Int64, model.UpdaterID);
            db.AddInParameter(dbCommand, "UpdaterName", DbType.String, model.UpdaterName);

            dbCommand.Parameters.Add(new SqlParameter("@FK_SysRoleIDTable", SqlDbType.Structured)
            {
                TypeName = "TVP_IDTable",
                Direction = ParameterDirection.Input,
                Value = XCLNetTools.DataSource.DataTableHelper.ToSingleColumnDataTable<long, long>(roleIdList)
            });

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
    }
}