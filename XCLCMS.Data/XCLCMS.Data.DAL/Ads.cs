using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Data;
using System.Data.Common;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:Ads
    /// </summary>
    public partial class Ads : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public Ads()
        { }

        #region Method

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.Ads model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Ads_ADD");
            db.AddInParameter(dbCommand, "AdsID", DbType.Int64, model.AdsID);
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, model.Code);
            db.AddInParameter(dbCommand, "AdsType", DbType.AnsiString, model.AdsType);
            db.AddInParameter(dbCommand, "Title", DbType.String, model.Title);
            db.AddInParameter(dbCommand, "Contents", DbType.String, model.Contents);
            db.AddInParameter(dbCommand, "AdWidth", DbType.Int32, model.AdWidth);
            db.AddInParameter(dbCommand, "AdHeight", DbType.Int32, model.AdHeight);
            db.AddInParameter(dbCommand, "URL", DbType.AnsiString, model.URL);
            db.AddInParameter(dbCommand, "URLOpenType", DbType.AnsiString, model.URLOpenType);
            db.AddInParameter(dbCommand, "StartTime", DbType.DateTime, model.StartTime);
            db.AddInParameter(dbCommand, "EndTime", DbType.DateTime, model.EndTime);
            db.AddInParameter(dbCommand, "NickName", DbType.String, model.NickName);
            db.AddInParameter(dbCommand, "Email", DbType.AnsiString, model.Email);
            db.AddInParameter(dbCommand, "QQ", DbType.AnsiString, model.QQ);
            db.AddInParameter(dbCommand, "Tel", DbType.AnsiString, model.Tel);
            db.AddInParameter(dbCommand, "OtherContact", DbType.String, model.OtherContact);
            db.AddInParameter(dbCommand, "Remark", DbType.String, model.Remark);
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
        public bool Update(XCLCMS.Data.Model.Ads model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Ads_Update");
            db.AddInParameter(dbCommand, "AdsID", DbType.Int64, model.AdsID);
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, model.Code);
            db.AddInParameter(dbCommand, "AdsType", DbType.AnsiString, model.AdsType);
            db.AddInParameter(dbCommand, "Title", DbType.String, model.Title);
            db.AddInParameter(dbCommand, "Contents", DbType.String, model.Contents);
            db.AddInParameter(dbCommand, "AdWidth", DbType.Int32, model.AdWidth);
            db.AddInParameter(dbCommand, "AdHeight", DbType.Int32, model.AdHeight);
            db.AddInParameter(dbCommand, "URL", DbType.AnsiString, model.URL);
            db.AddInParameter(dbCommand, "URLOpenType", DbType.AnsiString, model.URLOpenType);
            db.AddInParameter(dbCommand, "StartTime", DbType.DateTime, model.StartTime);
            db.AddInParameter(dbCommand, "EndTime", DbType.DateTime, model.EndTime);
            db.AddInParameter(dbCommand, "NickName", DbType.String, model.NickName);
            db.AddInParameter(dbCommand, "Email", DbType.AnsiString, model.Email);
            db.AddInParameter(dbCommand, "QQ", DbType.AnsiString, model.QQ);
            db.AddInParameter(dbCommand, "Tel", DbType.AnsiString, model.Tel);
            db.AddInParameter(dbCommand, "OtherContact", DbType.String, model.OtherContact);
            db.AddInParameter(dbCommand, "Remark", DbType.String, model.Remark);
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
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.Ads GetModel(long AdsID)
        {
            XCLCMS.Data.Model.Ads model = new XCLCMS.Data.Model.Ads();
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from Ads WITH(NOLOCK)   where AdsID=@AdsID");
            db.AddInParameter(dbCommand, "AdsID", DbType.Int64, AdsID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.Ads>(dr);
            }
        }

        #endregion Method

        #region MethodEx

        /// <summary>
        /// 判断指定code是否存在
        /// </summary>
        public bool IsExistCode(string code)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select top 1 1 from Ads  WITH(NOLOCK)  where Code=@Code");
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, code);
            return db.ExecuteScalar(dbCommand) != null;
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.Ads GetModel(string code)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select top 1 * from Ads with(nolock) where Code=@Code");
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, code);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.Ads>(dr);
            }
        }

        #endregion MethodEx
    }
}