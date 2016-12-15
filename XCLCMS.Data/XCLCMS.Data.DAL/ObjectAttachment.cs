using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:ObjectAttachment
    /// </summary>
    public partial class ObjectAttachment : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public ObjectAttachment()
        { }

        #region Method

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.ObjectAttachment> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select ObjectType,FK_ObjectID,FK_AttachmentID,RecordState,CreateTime,CreaterID,CreaterName,UpdateTime,UpdaterID,UpdaterName ");
            strSql.Append(" FROM ObjectAttachment  WITH(NOLOCK)  ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            using (var dr = db.ExecuteReader(CommandType.Text, strSql.ToString()))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.ObjectAttachment>(dr);
            }
        }

        #endregion Method

        #region Extend Method

        /// <summary>
        /// 批量删除
        /// </summary>
        public bool Delete(XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum objectType, long objectID)
        {
            string sql = @"
                delete from ObjectAttachment where ObjectType=@ObjectType and FK_ObjectID=@FK_ObjectID
            ";
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(sql);
            db.AddInParameter(dbCommand, "ObjectType", DbType.String, objectType);
            db.AddInParameter(dbCommand, "FK_ObjectID", DbType.Int64, objectID);
            return db.ExecuteNonQuery(dbCommand) >= 0;
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        public bool Add(List<XCLCMS.Data.Model.ObjectAttachment> lst)
        {
            if (null == lst || lst.Count == 0)
            {
                return true;
            }
            lst = lst.Distinct().ToList();

            string sql = @"
                insert into ObjectAttachment
                select * from @TVP_ObjectAttachment as tvp
            ";
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(sql);
            dbCommand.Parameters.Add(new SqlParameter("@TVP_ObjectAttachment", SqlDbType.Structured)
            {
                TypeName = "TVP_ObjectAttachment",
                Direction = ParameterDirection.Input,
                Value = XCLNetTools.DataSource.DataTableHelper.ToDataTable<XCLCMS.Data.Model.ObjectAttachment>(lst)
            });
            return db.ExecuteNonQuery(dbCommand) >= 0;
        }

        /// <summary>
        /// 批量添加（先删再加）
        /// </summary>
        public bool Add(XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum objectType, long objectID, List<long> attachmentIDList, XCLCMS.Data.Model.Custom.ContextModel context = null)
        {
            if (null == attachmentIDList || attachmentIDList.Count == 0)
            {
                return true;
            }
            attachmentIDList = attachmentIDList.Distinct().ToList();

            if (!this.Delete(CommonHelper.EnumType.ObjectTypeEnum.ART, objectID))
            {
                return false;
            }

            DateTime dtNow = DateTime.Now;
            var lst = new List<XCLCMS.Data.Model.ObjectAttachment>();

            attachmentIDList.ForEach(id =>
            {
                var model = new XCLCMS.Data.Model.ObjectAttachment();
                if (null != context)
                {
                    model.CreaterID = context.UserInfoID;
                    model.CreaterName = context.UserName;
                    model.UpdaterID = context.UserInfoID;
                    model.UpdaterName = context.UserName;
                }
                model.CreateTime = dtNow;
                model.UpdateTime = dtNow;
                model.FK_AttachmentID = id;
                model.FK_ObjectID = objectID;
                model.ObjectType = objectType.ToString();
                model.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
                lst.Add(model);
            });

            return this.Add(lst);
        }

        /// <summary>
        /// 返回指定类型的附件列表
        /// </summary>
        public List<XCLCMS.Data.Model.ObjectAttachment> GetModelList(XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum objectType, long objectID)
        {
            string sql = @"
                select * from ObjectAttachment WITH(NOLOCK)   where ObjectType=@ObjectType and FK_ObjectID=@FK_ObjectID
            ";
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(sql);
            db.AddInParameter(dbCommand, "ObjectType", DbType.String, objectType.ToString());
            db.AddInParameter(dbCommand, "FK_ObjectID", DbType.Int64, objectID);

            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.ObjectAttachment>(dr);
            }
        }

        #endregion Extend Method
    }
}