using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:ObjectTag
    /// </summary>
    public partial class ObjectTag : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.ObjectTag model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_ObjectTag_ADD");
            db.AddInParameter(dbCommand, "ObjectType", DbType.AnsiString, model.ObjectType);
            db.AddInParameter(dbCommand, "FK_ObjectID", DbType.Int64, model.FK_ObjectID);
            db.AddInParameter(dbCommand, "FK_TagsID", DbType.Int64, model.FK_TagsID);
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
        public bool Delete(XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum objectType, long objectID)
        {
            string sql = @"
                delete from ObjectTag where ObjectType=@ObjectType and FK_ObjectID=@FK_ObjectID
            ";
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(sql);
            db.AddInParameter(dbCommand, "ObjectType", DbType.String, objectType);
            db.AddInParameter(dbCommand, "FK_ObjectID", DbType.Int64, objectID);
            return db.ExecuteNonQuery(dbCommand) >= 0;
        }

        /// <summary>
        /// 批量添加（先删再加）
        /// </summary>
        public bool Add(XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum objectType, long objectID, List<long> tagIDList, XCLCMS.Data.Model.Custom.ContextModel context = null)
        {
            var dtNow = DateTime.Now;
            if (null == tagIDList || tagIDList.Count == 0)
            {
                return true;
            }
            tagIDList = tagIDList.Distinct().ToList();

            if (!this.Delete(objectType, objectID))
            {
                return false;
            }

            tagIDList.ForEach(id =>
            {
                var model = new XCLCMS.Data.Model.ObjectTag();
                if (null != context)
                {
                    model.CreaterID = context.UserInfoID;
                    model.CreaterName = context.UserName;
                    model.UpdaterID = context.UserInfoID;
                    model.UpdaterName = context.UserName;
                }
                model.CreateTime = dtNow;
                model.UpdateTime = dtNow;
                model.FK_TagsID = id;
                model.FK_ObjectID = objectID;
                model.ObjectType = objectType.ToString();
                model.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
                this.Add(model);
            });

            return true;
        }
    }
}