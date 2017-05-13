using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:SysWebSetting
    /// </summary>
    public partial class SysWebSetting : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public SysWebSetting()
        { }

        #region Method

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.SysWebSetting model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_SysWebSetting_ADD");
            db.AddInParameter(dbCommand, "SysWebSettingID", DbType.Int64, model.SysWebSettingID);
            db.AddInParameter(dbCommand, "KeyName", DbType.AnsiString, model.KeyName);
            db.AddInParameter(dbCommand, "KeyValue", DbType.AnsiString, model.KeyValue);
            db.AddInParameter(dbCommand, "TestKeyValue", DbType.AnsiString, model.TestKeyValue);
            db.AddInParameter(dbCommand, "UATKeyValue", DbType.AnsiString, model.UATKeyValue);
            db.AddInParameter(dbCommand, "PrdKeyValue", DbType.AnsiString, model.PrdKeyValue);
            db.AddInParameter(dbCommand, "ValueType", DbType.AnsiString, model.ValueType);
            db.AddInParameter(dbCommand, "Remark", DbType.AnsiString, model.Remark);
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
        public bool Update(XCLCMS.Data.Model.SysWebSetting model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_SysWebSetting_Update");
            db.AddInParameter(dbCommand, "SysWebSettingID", DbType.Int64, model.SysWebSettingID);
            db.AddInParameter(dbCommand, "KeyName", DbType.AnsiString, model.KeyName);
            db.AddInParameter(dbCommand, "KeyValue", DbType.AnsiString, model.KeyValue);
            db.AddInParameter(dbCommand, "TestKeyValue", DbType.AnsiString, model.TestKeyValue);
            db.AddInParameter(dbCommand, "UATKeyValue", DbType.AnsiString, model.UATKeyValue);
            db.AddInParameter(dbCommand, "PrdKeyValue", DbType.AnsiString, model.PrdKeyValue);
            db.AddInParameter(dbCommand, "ValueType", DbType.AnsiString, model.ValueType);
            db.AddInParameter(dbCommand, "Remark", DbType.AnsiString, model.Remark);
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
        public XCLCMS.Data.Model.SysWebSetting GetModel(long SysWebSettingID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from SysWebSetting  WITH(NOLOCK)  where SysWebSettingID=@SysWebSettingID");
            db.AddInParameter(dbCommand, "SysWebSettingID", DbType.Int64, SysWebSettingID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.SysWebSetting>(dr);
            }
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.SysWebSetting> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM SysWebSetting WITH(NOLOCK)   ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.SysWebSetting>(dr);
            }
        }

        #endregion Method

        #region MethodEx

        /// <summary>
        /// 判断指定配置名是否存在
        /// </summary>
        public bool IsExistKeyName(string keyName)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(" select top 1 1 from SysWebSetting WITH(NOLOCK)   where KeyName=@KeyName");
            db.AddInParameter(dbCommand, "KeyName", DbType.AnsiString, keyName);
            return db.ExecuteScalar(dbCommand) != null;
        }

        #endregion MethodEx
    }
}