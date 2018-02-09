using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Data;
using System.Data.Common;

namespace XCLCMS.Data.DAL
{
    public class Orders : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.Orders model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Orders_ADD");
			db.AddInParameter(dbCommand, "OrderID", DbType.Int64, model.OrderID);
			db.AddInParameter(dbCommand, "FK_ProductID", DbType.Int64, model.FK_ProductID);
			db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
			db.AddInParameter(dbCommand, "FK_MerchantAppID", DbType.Int64, model.FK_MerchantAppID);
			db.AddInParameter(dbCommand, "FK_UserID", DbType.Int64, model.FK_UserID);
			db.AddInParameter(dbCommand, "UserName", DbType.String, model.UserName);
			db.AddInParameter(dbCommand, "Price", DbType.Decimal, model.Price);
			db.AddInParameter(dbCommand, "PayStatus", DbType.AnsiString, model.PayStatus);
			db.AddInParameter(dbCommand, "PayType", DbType.AnsiString, model.PayType);
			db.AddInParameter(dbCommand, "DealDoneTime", DbType.DateTime, model.DealDoneTime);
			db.AddInParameter(dbCommand, "FlowStatus", DbType.Int32, model.FlowStatus);
			db.AddInParameter(dbCommand, "ContactName", DbType.String, model.ContactName);
			db.AddInParameter(dbCommand, "Email", DbType.AnsiString, model.Email);
			db.AddInParameter(dbCommand, "Mobile", DbType.AnsiString, model.Mobile);
			db.AddInParameter(dbCommand, "OtherContact", DbType.String, model.OtherContact);
			db.AddInParameter(dbCommand, "TransactionNO", DbType.AnsiString, model.TransactionNO);
			db.AddInParameter(dbCommand, "Version", DbType.Int32, model.Version);
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
        public bool Update(XCLCMS.Data.Model.Orders model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Orders_Update");
			db.AddInParameter(dbCommand, "OrderID", DbType.Int64, model.OrderID);
			db.AddInParameter(dbCommand, "FK_ProductID", DbType.Int64, model.FK_ProductID);
			db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
			db.AddInParameter(dbCommand, "FK_MerchantAppID", DbType.Int64, model.FK_MerchantAppID);
			db.AddInParameter(dbCommand, "FK_UserID", DbType.Int64, model.FK_UserID);
			db.AddInParameter(dbCommand, "UserName", DbType.String, model.UserName);
			db.AddInParameter(dbCommand, "Price", DbType.Decimal, model.Price);
			db.AddInParameter(dbCommand, "PayStatus", DbType.AnsiString, model.PayStatus);
			db.AddInParameter(dbCommand, "PayType", DbType.AnsiString, model.PayType);
			db.AddInParameter(dbCommand, "DealDoneTime", DbType.DateTime, model.DealDoneTime);
			db.AddInParameter(dbCommand, "FlowStatus", DbType.Int32, model.FlowStatus);
			db.AddInParameter(dbCommand, "ContactName", DbType.String, model.ContactName);
			db.AddInParameter(dbCommand, "Email", DbType.AnsiString, model.Email);
			db.AddInParameter(dbCommand, "Mobile", DbType.AnsiString, model.Mobile);
			db.AddInParameter(dbCommand, "OtherContact", DbType.String, model.OtherContact);
			db.AddInParameter(dbCommand, "TransactionNO", DbType.AnsiString, model.TransactionNO);
			db.AddInParameter(dbCommand, "Version", DbType.Int32, model.Version);
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
        public XCLCMS.Data.Model.Orders GetModel(long OrderID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from Orders WITH(NOLOCK)   where OrderID=@OrderID");
            db.AddInParameter(dbCommand, "OrderID", DbType.Int64, OrderID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.Orders>(dr);
            }
        }
    }
}