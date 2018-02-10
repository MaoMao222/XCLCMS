using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;

namespace XCLCMS.Data.DAL
{
    public class KeyValueInfoType : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.KeyValueInfoType model)
        {
            Database db = DatabaseFactory.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_KeyValueInfoType_ADD");
            db.AddInParameter(dbCommand, "FK_KeyValueInfoID", DbType.Int64, model.FK_KeyValueInfoID);
            db.AddInParameter(dbCommand, "FK_TypeID", DbType.Int64, model.FK_TypeID);
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
        /// 批量删除
        /// </summary>
        public bool Delete(long keyValueInfoID)
        {
            string sql = @"
                delete from KeyValueInfoType where FK_keyValueInfoID=@FK_keyValueInfoID
            ";
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(sql);
            db.AddInParameter(dbCommand, "FK_KeyValueInfoID", DbType.Int64, keyValueInfoID);
            return db.ExecuteNonQuery(dbCommand) >= 0;
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        public bool Add(List<XCLCMS.Data.Model.KeyValueInfoType> lst)
        {
            if (null == lst || lst.Count == 0)
            {
                return true;
            }
            lst = lst.Distinct().ToList();

            string sql = @"
                insert into KeyValueInfoType
                select * from @TVP_KeyValueInfoType as tvp
            ";
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(sql);
            dbCommand.Parameters.Add(new SqlParameter("@TVP_KeyValueInfoType", SqlDbType.Structured)
            {
                TypeName = "TVP_KeyValueInfoType",
                Direction = ParameterDirection.Input,
                Value = XCLNetTools.DataSource.DataTableHelper.ToDataTable<XCLCMS.Data.Model.KeyValueInfoType>(lst)
            });
            return db.ExecuteNonQuery(dbCommand) >= 0;
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        public bool Add(long keyValueInfoID, List<long> keyValueInfoTypeIDList, XCLCMS.Data.Model.Custom.ContextModel context = null)
        {
            if (null == keyValueInfoTypeIDList || keyValueInfoTypeIDList.Count == 0)
            {
                return true;
            }
            keyValueInfoTypeIDList = keyValueInfoTypeIDList.Distinct().ToList();

            DateTime dtNow = DateTime.Now;
            var lst = new List<XCLCMS.Data.Model.KeyValueInfoType>();
            keyValueInfoTypeIDList.ForEach(id =>
            {
                var model = new XCLCMS.Data.Model.KeyValueInfoType();
                if (null != context)
                {
                    model.CreaterID = context.UserInfoID;
                    model.CreaterName = context.UserName;
                    model.UpdaterID = context.UserInfoID;
                    model.UpdaterName = context.UserName;
                }
                model.CreateTime = dtNow;
                model.UpdateTime = dtNow;
                model.FK_TypeID = id;
                model.FK_KeyValueInfoID = keyValueInfoID;
                model.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
                lst.Add(model);
            });

            return this.Add(lst);
        }
    }
}