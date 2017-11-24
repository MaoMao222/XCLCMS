using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:MerchantApp
    /// </summary>
    public partial class MerchantApp : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public MerchantApp()
        { }

        #region Method

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.MerchantApp model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_MerchantApp_ADD");
            db.AddInParameter(dbCommand, "MerchantAppID", DbType.Int64, model.MerchantAppID);
            db.AddInParameter(dbCommand, "MerchantAppName", DbType.AnsiString, model.MerchantAppName);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
            db.AddInParameter(dbCommand, "AppKey", DbType.AnsiString, model.AppKey);
            db.AddInParameter(dbCommand, "ResourceVersion", DbType.AnsiString, model.ResourceVersion);
            db.AddInParameter(dbCommand, "Email", DbType.AnsiString, model.Email);
            db.AddInParameter(dbCommand, "CopyRight", DbType.AnsiString, model.CopyRight);
            db.AddInParameter(dbCommand, "MetaDescription", DbType.AnsiString, model.MetaDescription);
            db.AddInParameter(dbCommand, "MetaKeyWords", DbType.AnsiString, model.MetaKeyWords);
            db.AddInParameter(dbCommand, "MetaTitle", DbType.AnsiString, model.MetaTitle);
            db.AddInParameter(dbCommand, "WebURL", DbType.AnsiString, model.WebURL);
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
        public bool Update(XCLCMS.Data.Model.MerchantApp model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_MerchantApp_Update");
            db.AddInParameter(dbCommand, "MerchantAppID", DbType.Int64, model.MerchantAppID);
            db.AddInParameter(dbCommand, "MerchantAppName", DbType.AnsiString, model.MerchantAppName);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
            db.AddInParameter(dbCommand, "AppKey", DbType.AnsiString, model.AppKey);
            db.AddInParameter(dbCommand, "ResourceVersion", DbType.AnsiString, model.ResourceVersion);
            db.AddInParameter(dbCommand, "Email", DbType.AnsiString, model.Email);
            db.AddInParameter(dbCommand, "CopyRight", DbType.AnsiString, model.CopyRight);
            db.AddInParameter(dbCommand, "MetaDescription", DbType.AnsiString, model.MetaDescription);
            db.AddInParameter(dbCommand, "MetaKeyWords", DbType.AnsiString, model.MetaKeyWords);
            db.AddInParameter(dbCommand, "MetaTitle", DbType.AnsiString, model.MetaTitle);
            db.AddInParameter(dbCommand, "WebURL", DbType.AnsiString, model.WebURL);
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
        public XCLCMS.Data.Model.MerchantApp GetModel(long MerchantAppID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from MerchantApp  WITH(NOLOCK)  where MerchantAppID=@MerchantAppID");
            db.AddInParameter(dbCommand, "MerchantAppID", DbType.Int64, MerchantAppID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.MerchantApp>(dr);
            }
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.MerchantApp> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM MerchantApp WITH(NOLOCK)   ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            using (var dr = db.ExecuteReader(CommandType.Text, strSql.ToString()))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.MerchantApp>(dr);
            }
        }

        #endregion Method

        #region Extend Method

        /// <summary>
        /// 获取指定商户的所有应用
        /// </summary>
        public List<XCLCMS.Data.Model.MerchantApp> GetModelList(long merchantID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from MerchantApp  WITH(NOLOCK)  where FK_MerchantID=@FK_MerchantID");
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, merchantID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.MerchantApp>(dr);
            }
        }

        /// <summary>
        /// 判断指定MerchantAppName是否存在
        /// </summary>
        public bool IsExistMerchantAppName(string merchantAppName)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select top 1 1 from MerchantApp  WITH(NOLOCK)  where MerchantAppName=@MerchantAppName");
            db.AddInParameter(dbCommand, "MerchantAppName", DbType.AnsiString, merchantAppName);
            return db.ExecuteScalar(dbCommand) != null;
        }

        /// <summary>
        /// 根据appkey查询实体
        /// </summary>
        public XCLCMS.Data.Model.MerchantApp GetModel(string appKey)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select top 1 * from MerchantApp  WITH(NOLOCK)  where AppKey=@AppKey");
            db.AddInParameter(dbCommand, "AppKey", DbType.AnsiString, appKey);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.MerchantApp>(dr);
            }
        }

        #endregion Extend Method
    }
}