using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Data;
using System.Data.Common;
using XCLCMS.Data.Model.Custom;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:FriendLinks
    /// </summary>
    public partial class FriendLinks : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public FriendLinks()
        { }

        #region Method

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.FriendLinks model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_FriendLinks_ADD");
            db.AddInParameter(dbCommand, "FriendLinkID", DbType.Int64, model.FriendLinkID);
            db.AddInParameter(dbCommand, "Title", DbType.String, model.Title);
            db.AddInParameter(dbCommand, "Description", DbType.String, model.Description);
            db.AddInParameter(dbCommand, "URL", DbType.AnsiString, model.URL);
            db.AddInParameter(dbCommand, "ContactName", DbType.String, model.ContactName);
            db.AddInParameter(dbCommand, "Email", DbType.AnsiString, model.Email);
            db.AddInParameter(dbCommand, "QQ", DbType.AnsiString, model.QQ);
            db.AddInParameter(dbCommand, "Tel", DbType.AnsiString, model.Tel);
            db.AddInParameter(dbCommand, "Remark", DbType.String, model.Remark);
            db.AddInParameter(dbCommand, "OtherContact", DbType.String, model.OtherContact);
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
        public bool Update(XCLCMS.Data.Model.FriendLinks model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_FriendLinks_Update");
            db.AddInParameter(dbCommand, "FriendLinkID", DbType.Int64, model.FriendLinkID);
            db.AddInParameter(dbCommand, "Title", DbType.String, model.Title);
            db.AddInParameter(dbCommand, "Description", DbType.String, model.Description);
            db.AddInParameter(dbCommand, "URL", DbType.AnsiString, model.URL);
            db.AddInParameter(dbCommand, "ContactName", DbType.String, model.ContactName);
            db.AddInParameter(dbCommand, "Email", DbType.AnsiString, model.Email);
            db.AddInParameter(dbCommand, "QQ", DbType.AnsiString, model.QQ);
            db.AddInParameter(dbCommand, "Tel", DbType.AnsiString, model.Tel);
            db.AddInParameter(dbCommand, "Remark", DbType.String, model.Remark);
            db.AddInParameter(dbCommand, "OtherContact", DbType.String, model.OtherContact);
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
        public XCLCMS.Data.Model.FriendLinks GetModel(long FriendLinkID)
        {
            XCLCMS.Data.Model.FriendLinks model = new XCLCMS.Data.Model.FriendLinks();
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from FriendLinks WITH(NOLOCK)   where FriendLinkID=@FriendLinkID");
            db.AddInParameter(dbCommand, "FriendLinkID", DbType.Int64, FriendLinkID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.FriendLinks>(dr);
            }
        }

        #endregion Method

        #region MethodEx

        /// <summary>
        /// 判断指定标题是否存在
        /// </summary>
        public bool IsExist(FriendLinks_TitleCondition condition)
        {
            return null != this.GetModel(condition);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.FriendLinks GetModel(FriendLinks_TitleCondition condition)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select top 1 * from FriendLinks with(nolock) where Title=@Title and FK_MerchantID=@FK_MerchantID and FK_MerchantAppID=@FK_MerchantAppID");
            db.AddInParameter(dbCommand, "Title", DbType.String, condition.Title);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, condition.FK_MerchantID);
            db.AddInParameter(dbCommand, "FK_MerchantAppID", DbType.Int64, condition.FK_MerchantAppID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.FriendLinks>(dr);
            }
        }

        #endregion MethodEx
    }
}