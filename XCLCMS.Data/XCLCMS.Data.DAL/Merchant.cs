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
    /// 数据访问类:Merchant
    /// </summary>
    public partial class Merchant : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.Merchant model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Merchant_ADD");
            db.AddInParameter(dbCommand, "MerchantID", DbType.Int64, model.MerchantID);
            db.AddInParameter(dbCommand, "MerchantName", DbType.String, model.MerchantName);
            db.AddInParameter(dbCommand, "FK_MerchantType", DbType.Int64, model.FK_MerchantType);
            db.AddInParameter(dbCommand, "MerchantSystemType", DbType.AnsiString, model.MerchantSystemType);
            db.AddInParameter(dbCommand, "Domain", DbType.AnsiString, model.Domain);
            db.AddInParameter(dbCommand, "LogoURL", DbType.AnsiString, model.LogoURL);
            db.AddInParameter(dbCommand, "ContactName", DbType.String, model.ContactName);
            db.AddInParameter(dbCommand, "Tel", DbType.AnsiString, model.Tel);
            db.AddInParameter(dbCommand, "Landline", DbType.AnsiString, model.Landline);
            db.AddInParameter(dbCommand, "Email", DbType.AnsiString, model.Email);
            db.AddInParameter(dbCommand, "QQ", DbType.AnsiString, model.QQ);
            db.AddInParameter(dbCommand, "FK_PassType", DbType.Int64, model.FK_PassType);
            db.AddInParameter(dbCommand, "PassNumber", DbType.AnsiString, model.PassNumber);
            db.AddInParameter(dbCommand, "Address", DbType.String, model.Address);
            db.AddInParameter(dbCommand, "OtherContact", DbType.String, model.OtherContact);
            db.AddInParameter(dbCommand, "MerchantRemark", DbType.String, model.MerchantRemark);
            db.AddInParameter(dbCommand, "RegisterTime", DbType.DateTime, model.RegisterTime);
            db.AddInParameter(dbCommand, "MerchantState", DbType.AnsiString, model.MerchantState);
            db.AddInParameter(dbCommand, "Remark", DbType.AnsiString, model.Remark);
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
        public bool Update(XCLCMS.Data.Model.Merchant model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Merchant_Update");
            db.AddInParameter(dbCommand, "MerchantID", DbType.Int64, model.MerchantID);
            db.AddInParameter(dbCommand, "MerchantName", DbType.String, model.MerchantName);
            db.AddInParameter(dbCommand, "FK_MerchantType", DbType.Int64, model.FK_MerchantType);
            db.AddInParameter(dbCommand, "MerchantSystemType", DbType.AnsiString, model.MerchantSystemType);
            db.AddInParameter(dbCommand, "Domain", DbType.AnsiString, model.Domain);
            db.AddInParameter(dbCommand, "LogoURL", DbType.AnsiString, model.LogoURL);
            db.AddInParameter(dbCommand, "ContactName", DbType.String, model.ContactName);
            db.AddInParameter(dbCommand, "Tel", DbType.AnsiString, model.Tel);
            db.AddInParameter(dbCommand, "Landline", DbType.AnsiString, model.Landline);
            db.AddInParameter(dbCommand, "Email", DbType.AnsiString, model.Email);
            db.AddInParameter(dbCommand, "QQ", DbType.AnsiString, model.QQ);
            db.AddInParameter(dbCommand, "FK_PassType", DbType.Int64, model.FK_PassType);
            db.AddInParameter(dbCommand, "PassNumber", DbType.AnsiString, model.PassNumber);
            db.AddInParameter(dbCommand, "Address", DbType.String, model.Address);
            db.AddInParameter(dbCommand, "OtherContact", DbType.String, model.OtherContact);
            db.AddInParameter(dbCommand, "MerchantRemark", DbType.String, model.MerchantRemark);
            db.AddInParameter(dbCommand, "RegisterTime", DbType.DateTime, model.RegisterTime);
            db.AddInParameter(dbCommand, "MerchantState", DbType.AnsiString, model.MerchantState);
            db.AddInParameter(dbCommand, "Remark", DbType.AnsiString, model.Remark);
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
        public XCLCMS.Data.Model.Merchant GetModel(long MerchantID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from Merchant  WITH(NOLOCK)  where MerchantID=@MerchantID");
            db.AddInParameter(dbCommand, "MerchantID", DbType.Int64, MerchantID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.Merchant>(dr);
            }
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.Merchant> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM Merchant  WITH(NOLOCK)  ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            using (var dr = db.ExecuteReader(CommandType.Text, strSql.ToString()))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.Merchant>(dr);
            }
        }

        /// <summary>
        /// 判断指定MerchantName是否存在
        /// </summary>
        public bool IsExistMerchantName(string merchantName)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select top 1 1 from Merchant  WITH(NOLOCK)  where MerchantName=@MerchantName");
            db.AddInParameter(dbCommand, "MerchantName", DbType.AnsiString, merchantName);
            return db.ExecuteScalar(dbCommand) != null;
        }

        /// <summary>
        /// 批量删除商户数据
        /// </summary>
        public bool Delete(List<long> idLst, XCLCMS.Data.Model.Custom.ContextModel context)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Merchant_Del");

            dbCommand.Parameters.Add(new SqlParameter("@MerchantID", SqlDbType.Structured)
            {
                TypeName = "TVP_IDTable",
                Direction = ParameterDirection.Input,
                Value = XCLNetTools.DataSource.DataTableHelper.ToSingleColumnDataTable<long, long>(idLst)
            });
            dbCommand.Parameters.Add(new SqlParameter("@Context", SqlDbType.Structured)
            {
                TypeName = "TVP_Context",
                Direction = ParameterDirection.Input,
                Value = XCLNetTools.DataSource.DataTableHelper.ToDataTable(new List<XCLCMS.Data.Model.Custom.ContextModel>() { context })
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