using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:SysDic
    /// </summary>
    public partial class SysDic : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.SysDic GetModel(long SysDicID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from SysDic  WITH(NOLOCK)  where SysDicID=@SysDicID");
            db.AddInParameter(dbCommand, "SysDicID", DbType.Int64, SysDicID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.SysDic>(dr);
            }
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.SysDic> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM SysDic  WITH(NOLOCK)  ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.SysDic>(dr);
            }
        }

        /// <summary>
        /// 获取指定sysDicID所属的层级list
        /// </summary>
        public List<XCLCMS.Data.Model.Custom.SysDicSimple> GetLayerListBySysDicID(long sysDicID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(string.Format("select * from fun_SysDic_GetLayerListByID({0})", sysDicID));
            List<XCLCMS.Data.Model.Custom.SysDicSimple> lst = null;
            using (var dr = db.ExecuteReader(dbCommand))
            {
                lst = XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.Custom.SysDicSimple>(dr);
            }
            if (null != lst)
            {
                lst.Reverse();
            }
            return lst;
        }

        /// <summary>
        /// 判断指定唯一标识是否存在
        /// </summary>
        public bool IsExistCode(string code)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select top 1 1 from SysDic  WITH(NOLOCK)  where Code=@Code");
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, code);
            return db.ExecuteScalar(dbCommand) != null;
        }

        /// <summary>
        /// 删除指定sysDicID下面的子节点
        /// </summary>
        public bool DelChild(XCLCMS.Data.Model.SysDic model)
        {
            string strSql = string.Format("update SysDic set RecordState='{0}',UpdateTime=@UpdateTime,UpdaterID=@UpdaterID,UpdaterName=@UpdaterName where ParentID=@SysDicID and RecordState='{1}'",
                                    XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.D.ToString(), XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString());

            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "SysDicID", DbType.Int64, model.SysDicID);
            db.AddInParameter(dbCommand, "UpdateTime", DbType.DateTime, model.UpdateTime);
            db.AddInParameter(dbCommand, "UpdaterID", DbType.Int64, model.UpdaterID);
            db.AddInParameter(dbCommand, "UpdaterName", DbType.String, model.UpdaterName);
            return db.ExecuteNonQuery(dbCommand) > 0;
        }

        /// <summary>
        /// 根据code查询其子项
        /// </summary>
        public List<XCLCMS.Data.Model.SysDic> GetChildListByCode(string code)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append(@"SELECT
                                        b.*
                                        FROM dbo.SysDic AS a WITH(NOLOCK)
                                        INNER JOIN dbo.SysDic AS b  WITH(NOLOCK)  ON a.Code=@Code AND a.SysDicID=b.ParentID
                                        where b.RecordState='N'
                                        ");

            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, code);

            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.SysDic>(dr);
            }
        }

        /// <summary>
        /// 根据SysDicID查询其子项
        /// </summary>
        public List<XCLCMS.Data.Model.SysDic> GetChildListByID(long sysDicID)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append(@"SELECT
                                        a.*
                                        FROM dbo.SysDic AS a WITH(NOLOCK)
                                        where ParentID=@ParentID and RecordState='N'
                                        ");

            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "ParentID", DbType.Int64, sysDicID);

            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.SysDic>(dr);
            }
        }

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.SysDic model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_SysDic_ADD");
            db.AddInParameter(dbCommand, "SysDicID", DbType.Int64, model.SysDicID);
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, model.Code);
            db.AddInParameter(dbCommand, "ParentID", DbType.Int64, model.ParentID);
            db.AddInParameter(dbCommand, "DicName", DbType.AnsiString, model.DicName);
            db.AddInParameter(dbCommand, "DicValue", DbType.AnsiString, model.DicValue);
            db.AddInParameter(dbCommand, "Sort", DbType.Int32, model.Sort);
            db.AddInParameter(dbCommand, "Remark", DbType.AnsiString, model.Remark);
            db.AddInParameter(dbCommand, "FK_FunctionID", DbType.Int64, model.FK_FunctionID);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
            db.AddInParameter(dbCommand, "FK_MerchantAppID", DbType.Int64, model.FK_MerchantAppID);
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
        public bool Update(XCLCMS.Data.Model.SysDic model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_SysDic_Update");
            db.AddInParameter(dbCommand, "SysDicID", DbType.Int64, model.SysDicID);
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, model.Code);
            db.AddInParameter(dbCommand, "ParentID", DbType.Int64, model.ParentID);
            db.AddInParameter(dbCommand, "DicName", DbType.AnsiString, model.DicName);
            db.AddInParameter(dbCommand, "DicValue", DbType.AnsiString, model.DicValue);
            db.AddInParameter(dbCommand, "Sort", DbType.Int32, model.Sort);
            db.AddInParameter(dbCommand, "Remark", DbType.AnsiString, model.Remark);
            db.AddInParameter(dbCommand, "FK_FunctionID", DbType.Int64, model.FK_FunctionID);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
            db.AddInParameter(dbCommand, "FK_MerchantAppID", DbType.Int64, model.FK_MerchantAppID);
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
        /// 根据code查询model
        /// </summary>
        public XCLCMS.Data.Model.SysDic GetModelByCode(string code)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append(@"SELECT
                                        top 1
                                        a.*
                                        FROM dbo.SysDic AS a WITH(NOLOCK)
                                        where a.RecordState='N' and a.Code=@Code
                                        ");

            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, code);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.SysDic>(dr);
            }
        }
    }
}