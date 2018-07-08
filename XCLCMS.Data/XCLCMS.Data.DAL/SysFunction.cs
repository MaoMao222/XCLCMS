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
    /// 数据访问类:SysFunction
    /// </summary>
    public partial class SysFunction : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.SysFunction model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_SysFunction_ADD");
            db.AddInParameter(dbCommand, "SysFunctionID", DbType.Int64, model.SysFunctionID);
            db.AddInParameter(dbCommand, "ParentID", DbType.Int64, model.ParentID);
            db.AddInParameter(dbCommand, "FunctionName", DbType.AnsiString, model.FunctionName);
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, model.Code);
            db.AddInParameter(dbCommand, "Remark", DbType.String, model.Remark);
            db.AddInParameter(dbCommand, "RecordState", DbType.AnsiString, model.RecordState);
            db.AddInParameter(dbCommand, "CreateTime", DbType.DateTime, model.CreateTime);
            db.AddInParameter(dbCommand, "CreaterID", DbType.Int64, model.CreaterID);
            db.AddInParameter(dbCommand, "CreaterName", DbType.String, model.CreaterName);
            db.AddInParameter(dbCommand, "UpdateTime", DbType.DateTime, model.UpdateTime);
            db.AddInParameter(dbCommand, "UpdaterID", DbType.Int64, model.UpdaterID);
            db.AddInParameter(dbCommand, "UpdaterName", DbType.String, model.UpdaterName);

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
        ///  更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.SysFunction model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_SysFunction_Update");
            db.AddInParameter(dbCommand, "SysFunctionID", DbType.Int64, model.SysFunctionID);
            db.AddInParameter(dbCommand, "ParentID", DbType.Int64, model.ParentID);
            db.AddInParameter(dbCommand, "FunctionName", DbType.AnsiString, model.FunctionName);
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, model.Code);
            db.AddInParameter(dbCommand, "Remark", DbType.String, model.Remark);
            db.AddInParameter(dbCommand, "RecordState", DbType.AnsiString, model.RecordState);
            db.AddInParameter(dbCommand, "CreateTime", DbType.DateTime, model.CreateTime);
            db.AddInParameter(dbCommand, "CreaterID", DbType.Int64, model.CreaterID);
            db.AddInParameter(dbCommand, "CreaterName", DbType.String, model.CreaterName);
            db.AddInParameter(dbCommand, "UpdateTime", DbType.DateTime, model.UpdateTime);
            db.AddInParameter(dbCommand, "UpdaterID", DbType.Int64, model.UpdaterID);
            db.AddInParameter(dbCommand, "UpdaterName", DbType.String, model.UpdaterName);

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
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.SysFunction GetModel(long SysFunctionID)
        {
            XCLCMS.Data.Model.SysFunction model = new XCLCMS.Data.Model.SysFunction();
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from SysFunction  WITH(NOLOCK)  where SysFunctionID=@SysFunctionID");
            db.AddInParameter(dbCommand, "SysFunctionID", DbType.Int64, SysFunctionID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.SysFunction>(dr);
            }
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.SysFunction> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select SysFunctionID,ParentID,FunctionName,Code,Remark,RecordState,CreateTime,CreaterID,CreaterName,UpdateTime,UpdaterID,UpdaterName ");
            strSql.Append(" FROM SysFunction  WITH(NOLOCK)  ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.SysFunction>(dr);
            }
        }

        /// <summary>
        /// 判断功能标识是否存在
        /// </summary>
        public bool IsExistCode(string code)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select top 1 1 from SysFunction  WITH(NOLOCK)  where Code=@Code");
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, code);
            return db.ExecuteScalar(dbCommand) != null;
        }

        /// <summary>
        /// 验证某个用户是否拥有指定功能列表中的某个功能权限
        /// </summary>
        public bool CheckUserHasAnyFunction(long userId, List<long> functionList)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_CheckUserHasAnyFunction");
            db.AddInParameter(dbCommand, "UserInfoID", DbType.Int64, userId);
            db.AddOutParameter(dbCommand, "IsPass", DbType.Byte, 1);

            dbCommand.Parameters.Add(new SqlParameter("@FunctionListTable", SqlDbType.Structured)
            {
                TypeName = "TVP_IDTable",
                Direction = ParameterDirection.Input,
                Value = XCLNetTools.DataSource.DataTableHelper.ToSingleColumnDataTable<long, long>(functionList)
            });

            db.ExecuteNonQuery(dbCommand);
            return XCLNetTools.Common.DataTypeConvert.ToInt(dbCommand.Parameters["@IsPass"].Value) == 1;
        }

        /// <summary>
        /// 获取指定角色的所有功能
        /// </summary>
        /// <param name="sysRoleID">角色ID</param>
        public List<XCLCMS.Data.Model.SysFunction> GetListByRoleID(long sysRoleID)
        {
            string strSql = @"WITH Info1 AS (
	                                    SELECT DISTINCT a.FK_SysFunctionID FROM dbo.SysRoleFunction AS a  WITH(NOLOCK)  WHERE RecordState='N' AND FK_SysRoleID=@SysRoleID
                                    )
                                    SELECT
                                    a.*
                                    FROM dbo.SysFunction AS a WITH(NOLOCK)
                                    INNER JOIN Info1 AS b ON a.SysFunctionID=b.FK_SysFunctionID AND a.RecordState='N'
                                    ";
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "SysRoleID", DbType.Int64, sysRoleID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.SysFunction>(dr);
            }
        }

        /// <summary>
        /// 获取指定SysFunctionID所属的层级list，如:根目录/子目录/文件
        /// </summary>
        public List<XCLCMS.Data.Model.Custom.SysFunctionSimple> GetLayerListBySysFunctionID(long sysFunctionID)
        {
            string str = string.Format(@"
                                                        WITH Info1 AS (
	                                                        SELECT SysFunctionID, ParentID, FunctionName FROM dbo.SysFunction  WITH(NOLOCK) WHERE SysFunctionID={0}
	                                                        UNION ALL
	                                                        SELECT a.SysFunctionID, a.ParentID,a.FunctionName FROM dbo.SysFunction AS a  WITH(NOLOCK)
	                                                        INNER JOIN Info1 AS b ON a.SysFunctionID=b.ParentID
                                                        )
                                                        SELECT SysFunctionID, ParentID,FunctionName FROM Info1
                              ", sysFunctionID);
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(str.ToString());
            List<XCLCMS.Data.Model.Custom.SysFunctionSimple> lst = null;
            using (var dr = db.ExecuteReader(dbCommand))
            {
                lst = XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.Custom.SysFunctionSimple>(dr);
            }
            if (null != lst)
            {
                lst.Reverse();
            }
            return lst;
        }

        /// <summary>
        /// 删除指定SysFunctionID下面的子节点
        /// </summary>
        public bool DelChild(XCLCMS.Data.Model.SysFunction model)
        {
            string strSql = string.Format("update SysFunction set RecordState='{0}',UpdateTime=@UpdateTime,UpdaterID=@UpdaterID,UpdaterName=@UpdaterName where ParentID=@SysFunctionID and RecordState='{1}' and ParentID>0",
                                    XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.D.ToString(), XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString());

            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "SysFunctionID", DbType.Int64, model.SysFunctionID);
            db.AddInParameter(dbCommand, "UpdateTime", DbType.DateTime, model.UpdateTime);
            db.AddInParameter(dbCommand, "UpdaterID", DbType.Int64, model.UpdaterID);
            db.AddInParameter(dbCommand, "UpdaterName", DbType.String, model.UpdaterName);
            return db.ExecuteNonQuery(dbCommand) > 0;
        }

        /// <summary>
        /// 根据SysFunctionID查询其子项
        /// </summary>
        public List<XCLCMS.Data.Model.SysFunction> GetChildListByID(long sysFunctionID)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append(@"SELECT
                                        a.*
                                        FROM dbo.SysFunction AS a WITH(NOLOCK)
                                        where ParentID=@ParentID and RecordState='N'
                                        ");
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "ParentID", DbType.Int64, sysFunctionID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.SysFunction>(dr);
            }
        }
    }
}