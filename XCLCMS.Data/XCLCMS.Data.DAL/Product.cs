using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using XCLCMS.Data.Model.Custom;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:Product
    /// </summary>
    public partial class Product : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.Product model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Product_ADD");
            db.AddInParameter(dbCommand, "ProductID", DbType.Int64, model.ProductID);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
            db.AddInParameter(dbCommand, "FK_MerchantAppID", DbType.Int64, model.FK_MerchantAppID);
            db.AddInParameter(dbCommand, "ProductName", DbType.String, model.ProductName);
            db.AddInParameter(dbCommand, "Description", DbType.String, model.Description);
            db.AddInParameter(dbCommand, "Price", DbType.Decimal, model.Price);
            db.AddInParameter(dbCommand, "SaleType", DbType.AnsiString, model.SaleType);
            db.AddInParameter(dbCommand, "SaleTitle", DbType.String, model.SaleTitle);
            db.AddInParameter(dbCommand, "PayedActionType", DbType.AnsiString, model.PayedActionType);
            db.AddInParameter(dbCommand, "PayedRemark", DbType.String, model.PayedRemark);
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
        public bool Update(XCLCMS.Data.Model.Product model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Product_Update");
            db.AddInParameter(dbCommand, "ProductID", DbType.Int64, model.ProductID);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
            db.AddInParameter(dbCommand, "FK_MerchantAppID", DbType.Int64, model.FK_MerchantAppID);
            db.AddInParameter(dbCommand, "ProductName", DbType.String, model.ProductName);
            db.AddInParameter(dbCommand, "Description", DbType.String, model.Description);
            db.AddInParameter(dbCommand, "Price", DbType.Decimal, model.Price);
            db.AddInParameter(dbCommand, "SaleType", DbType.AnsiString, model.SaleType);
            db.AddInParameter(dbCommand, "SaleTitle", DbType.String, model.SaleTitle);
            db.AddInParameter(dbCommand, "PayedActionType", DbType.AnsiString, model.PayedActionType);
            db.AddInParameter(dbCommand, "PayedRemark", DbType.String, model.PayedRemark);
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
        public XCLCMS.Data.Model.Product GetModel(long ProductID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from Product WITH(NOLOCK)   where ProductID=@ProductID");
            db.AddInParameter(dbCommand, "ProductID", DbType.Int64, ProductID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.Product>(dr);
            }
        }

        /// <summary>
        /// 查询指定对象的所有产品列表
        /// </summary>
        public List<XCLCMS.Data.Model.Product> GetModelListByObject(Product_ObjectProductCondition condition)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(@"
                                                                                                            SELECT
                                                                                                            b.*
                                                                                                            FROM dbo.ObjectProduct AS a WITH(NOLOCK)
                                                                                                            INNER JOIN dbo.Product AS b WITH(NOLOCK) ON a.FK_ProductID=b.ProductID
                                                                                                            WHERE a.ObjectType=@ObjectType AND a.FK_ObjectID=@FK_ObjectID AND b.FK_MerchantID=@FK_MerchantID AND b.FK_MerchantAppID=@FK_MerchantAppID AND b.RecordState=@RecordState
                                                                                                        ");
            db.AddInParameter(dbCommand, "ObjectType", DbType.String, condition.ObjectType);
            db.AddInParameter(dbCommand, "FK_ObjectID", DbType.Int64, condition.ObjectID);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, condition.FK_MerchantID);
            db.AddInParameter(dbCommand, "FK_MerchantAppID", DbType.Int64, condition.FK_MerchantAppID);
            db.AddInParameter(dbCommand, "RecordState", DbType.String, condition.RecordState);
            var ds = db.ExecuteDataSet(dbCommand);
            return XCLNetTools.Generic.ListHelper.DataSetToList<XCLCMS.Data.Model.Product>(ds).ToList();
        }
    }
}