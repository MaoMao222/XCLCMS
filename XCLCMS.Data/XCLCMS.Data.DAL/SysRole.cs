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
    /// 数据访问类:SysRole
    /// </summary>
    public partial class SysRole : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.SysRole model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_SysRole_ADD");
            db.AddInParameter(dbCommand, "SysRoleID", DbType.Int64, model.SysRoleID);
            db.AddInParameter(dbCommand, "ParentID", DbType.Int64, model.ParentID);
            db.AddInParameter(dbCommand, "RoleName", DbType.String, model.RoleName);
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, model.Code);
            db.AddInParameter(dbCommand, "Sort", DbType.Int32, model.Sort);
            db.AddInParameter(dbCommand, "Weight", DbType.Int32, model.Weight);
            db.AddInParameter(dbCommand, "Remark", DbType.AnsiString, model.Remark);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
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
        public bool Update(XCLCMS.Data.Model.SysRole model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_SysRole_Update");
            db.AddInParameter(dbCommand, "SysRoleID", DbType.Int64, model.SysRoleID);
            db.AddInParameter(dbCommand, "ParentID", DbType.Int64, model.ParentID);
            db.AddInParameter(dbCommand, "RoleName", DbType.String, model.RoleName);
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, model.Code);
            db.AddInParameter(dbCommand, "Sort", DbType.Int32, model.Sort);
            db.AddInParameter(dbCommand, "Weight", DbType.Int32, model.Weight);
            db.AddInParameter(dbCommand, "Remark", DbType.AnsiString, model.Remark);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
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
        public XCLCMS.Data.Model.SysRole GetModel(long SysRoleID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from SysRole  WITH(NOLOCK)  where SysRoleID=@SysRoleID");
            db.AddInParameter(dbCommand, "SysRoleID", DbType.Int64, SysRoleID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.SysRole>(dr);
            }
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.SysRole> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM SysRole WITH(NOLOCK)   ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            using (var dr = db.ExecuteReader(CommandType.Text, strSql.ToString()))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.SysRole>(dr);
            }
        }

        /// <summary>
        /// 获取指定userid的角色
        /// </summary>
        public List<XCLCMS.Data.Model.SysRole> GetListByUserID(long userId)
        {
            string strSql = @"SELECT
                                        a.*
                                        FROM dbo.SysRole AS a WITH(NOLOCK)
                                        INNER JOIN dbo.SysUserRole AS b  WITH(NOLOCK)  ON b.FK_UserInfoID=@FK_UserInfoID AND b.RecordState='N' AND a.RecordState='N' and a.SysRoleID=b.FK_SysRoleID";
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "FK_UserInfoID", DbType.Int64, userId);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.SysRole>(dr);
            }
        }

        /// <summary>
        /// 判断角色标识是否存在
        /// </summary>
        public bool IsExistCode(string code)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select top 1 1 from SysRole WITH(NOLOCK)   where Code=@Code");
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, code);
            return db.ExecuteScalar(dbCommand) != null;
        }

        /// <summary>
        /// 获取指定SysRoleID所属的层级list，如:根目录/子目录/文件
        /// </summary>
        public List<XCLCMS.Data.Model.Custom.SysRoleSimple> GetLayerListBySysRoleID(long sysRoleID)
        {
            string str = string.Format(@"
                                                        WITH Info1 AS (
	                                                        SELECT SysRoleID, ParentID, RoleName FROM dbo.SysRole  WITH(NOLOCK) WHERE SysRoleID={0}
	                                                        UNION ALL
	                                                        SELECT a.SysRoleID, a.ParentID,a.RoleName FROM dbo.SysRole AS a  WITH(NOLOCK)
	                                                        INNER JOIN Info1 AS b ON a.SysRoleID=b.ParentID
                                                        )
                                                        SELECT SysRoleID, ParentID,RoleName FROM Info1
                              ", sysRoleID);
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(str.ToString());
            List<XCLCMS.Data.Model.Custom.SysRoleSimple> lst = null;
            using (var dr = db.ExecuteReader(dbCommand))
            {
                lst = XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.Custom.SysRoleSimple>(dr);
            }
            if (null != lst)
            {
                lst.Reverse();
            }
            return lst;
        }

        /// <summary>
        /// 删除指定SysRoleID下面的子节点
        /// </summary>
        public bool DelChild(XCLCMS.Data.Model.SysRole model)
        {
            string strSql = string.Format("update SysRole set RecordState='{0}',UpdateTime=@UpdateTime,UpdaterID=@UpdaterID,UpdaterName=@UpdaterName where ParentID=@SysRoleID and RecordState='{1}' and ParentID>0",
                                    XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.D.ToString(), XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString());

            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "SysRoleID", DbType.Int64, model.SysRoleID);
            db.AddInParameter(dbCommand, "UpdateTime", DbType.DateTime, model.UpdateTime);
            db.AddInParameter(dbCommand, "UpdaterID", DbType.Int64, model.UpdaterID);
            db.AddInParameter(dbCommand, "UpdaterName", DbType.String, model.UpdaterName);
            return db.ExecuteNonQuery(dbCommand) > 0;
        }

        /// <summary>
        /// 根据SysRoleID查询其子项
        /// </summary>
        public List<XCLCMS.Data.Model.SysRole> GetChildListByID(long sysRoleID)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append(@"SELECT
                                        a.*
                                        FROM dbo.SysRole AS a WITH(NOLOCK)
                                        where ParentID=@ParentID and RecordState='N'
                                        ");
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "ParentID", DbType.Int64, sysRoleID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.SysRole>(dr);
            }
        }

        /// <summary>
        /// 根据code查询model
        /// </summary>
        public XCLCMS.Data.Model.SysRole GetModelByCode(string code)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append(@"SELECT
                                        top 1
                                        a.*
                                        FROM dbo.SysRole AS a WITH(NOLOCK)
                                        where a.RecordState='N' and a.Code=@Code
                                        ");

            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, code);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.SysRole>(dr);
            }
        }

        /// <summary>
        /// 根据id批量获取实体
        /// </summary>
        public List<XCLCMS.Data.Model.SysRole> GetModelList(List<long> roleIdList)
        {
            if (null == roleIdList || roleIdList.Count == 0)
            {
                return new List<Model.SysRole>();
            }
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(@"
                                                                                                        SELECT a.* FROM dbo.SysRole AS a WITH(NOLOCK)
                                                                                                        INNER JOIN @TVP_RoleID AS b ON a.SysRoleID=b.ID
                                                                                                    ");
            dbCommand.Parameters.Add(new SqlParameter("@TVP_RoleID", SqlDbType.Structured)
            {
                TypeName = "TVP_IDTable",
                Direction = ParameterDirection.Input,
                Value = XCLNetTools.DataSource.DataTableHelper.ToSingleColumnDataTable<long, long>(roleIdList)
            });
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.SysRole>(dr);
            }
        }
    }
}