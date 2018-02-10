using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:SysRoleFunction
    /// </summary>
    public partial class SysRoleFunction : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        ///  增加一条数据
        ///  注：如果functionIdList为空，则添加model.FK_SysFunctionID，否则，则添加functionIdList
        /// </summary>
        public bool Add(XCLCMS.Data.Model.SysRoleFunction model, List<long> functionIdList = null)
        {
            if (null == functionIdList || functionIdList.Count == 0)
            {
                if (model.FK_SysFunctionID > 0)
                {
                    functionIdList = new List<long>() {
                        model.FK_SysFunctionID
                    };
                }
            }

            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_SysRoleFunction_ADD");
            db.AddInParameter(dbCommand, "FK_SysRoleID", DbType.Int64, model.FK_SysRoleID);
            db.AddInParameter(dbCommand, "RecordState", DbType.AnsiString, model.RecordState);
            db.AddInParameter(dbCommand, "CreateTime", DbType.DateTime, model.CreateTime);
            db.AddInParameter(dbCommand, "CreaterID", DbType.Int64, model.CreaterID);
            db.AddInParameter(dbCommand, "CreaterName", DbType.String, model.CreaterName);
            db.AddInParameter(dbCommand, "UpdateTime", DbType.DateTime, model.UpdateTime);
            db.AddInParameter(dbCommand, "UpdaterID", DbType.Int64, model.UpdaterID);
            db.AddInParameter(dbCommand, "UpdaterName", DbType.String, model.UpdaterName);

            dbCommand.Parameters.Add(new SqlParameter("@FK_SysFunctionIDTable", SqlDbType.Structured)
            {
                TypeName = "TVP_IDTable",
                Direction = ParameterDirection.Input,
                Value = XCLNetTools.DataSource.DataTableHelper.ToSingleColumnDataTable<long, long>(functionIdList)
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

        /// <summary>
        /// 清理无效的普通商户角色的无效权限
        /// </summary>
        public void ClearInvalidNormalRoleFunctions()
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_ClearInvalidNormalRoleFunctions");
            db.ExecuteNonQuery(dbCommand);
        }
    }
}