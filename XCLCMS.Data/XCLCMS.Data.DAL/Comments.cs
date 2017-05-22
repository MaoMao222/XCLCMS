using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Data;
using System.Data.Common;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 评论管理
    /// </summary>
    public class Comments : XCLCMS.Data.DAL.Common.BaseDAL
    {
        #region Method

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.Comments model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Comments_ADD");
            db.AddInParameter(dbCommand, "CommentsID", DbType.Int64, model.CommentsID);
            db.AddInParameter(dbCommand, "ObjectType", DbType.AnsiString, model.ObjectType);
            db.AddInParameter(dbCommand, "FK_ObjectID", DbType.Int64, model.FK_ObjectID);
            db.AddInParameter(dbCommand, "UserName", DbType.String, model.UserName);
            db.AddInParameter(dbCommand, "Email", DbType.AnsiString, model.Email);
            db.AddInParameter(dbCommand, "ParentCommentID", DbType.Int64, model.ParentCommentID);
            db.AddInParameter(dbCommand, "GoodCount", DbType.Int32, model.GoodCount);
            db.AddInParameter(dbCommand, "MiddleCount", DbType.Int32, model.MiddleCount);
            db.AddInParameter(dbCommand, "BadCount", DbType.Int32, model.BadCount);
            db.AddInParameter(dbCommand, "Contents", DbType.String, model.Contents);
            db.AddInParameter(dbCommand, "VerifyState", DbType.AnsiString, model.VerifyState);
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
        public bool Update(XCLCMS.Data.Model.Comments model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Comments_Update");
            db.AddInParameter(dbCommand, "CommentsID", DbType.Int64, model.CommentsID);
            db.AddInParameter(dbCommand, "ObjectType", DbType.AnsiString, model.ObjectType);
            db.AddInParameter(dbCommand, "FK_ObjectID", DbType.Int64, model.FK_ObjectID);
            db.AddInParameter(dbCommand, "UserName", DbType.String, model.UserName);
            db.AddInParameter(dbCommand, "Email", DbType.AnsiString, model.Email);
            db.AddInParameter(dbCommand, "ParentCommentID", DbType.Int64, model.ParentCommentID);
            db.AddInParameter(dbCommand, "GoodCount", DbType.Int32, model.GoodCount);
            db.AddInParameter(dbCommand, "MiddleCount", DbType.Int32, model.MiddleCount);
            db.AddInParameter(dbCommand, "BadCount", DbType.Int32, model.BadCount);
            db.AddInParameter(dbCommand, "Contents", DbType.String, model.Contents);
            db.AddInParameter(dbCommand, "VerifyState", DbType.AnsiString, model.VerifyState);
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
        public XCLCMS.Data.Model.Comments GetModel(long CommentsID)
        {
            XCLCMS.Data.Model.Comments model = new XCLCMS.Data.Model.Comments();
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from Comments WITH(NOLOCK)   where CommentsID=@CommentsID");
            db.AddInParameter(dbCommand, "CommentsID", DbType.Int64, CommentsID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.Comments>(dr);
            }
        }

        #endregion Method
    }
}