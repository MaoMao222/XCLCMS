using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Transactions;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:Attachment
    /// </summary>
    public partial class Attachment : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.Attachment model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Attachment_ADD");
            db.AddInParameter(dbCommand, "AttachmentID", DbType.Int64, model.AttachmentID);
            db.AddInParameter(dbCommand, "ParentID", DbType.Int64, model.ParentID);
            db.AddInParameter(dbCommand, "OriginFileName", DbType.AnsiString, model.OriginFileName);
            db.AddInParameter(dbCommand, "FileName", DbType.AnsiString, model.FileName);
            db.AddInParameter(dbCommand, "Title", DbType.String, model.Title);
            db.AddInParameter(dbCommand, "ViewType", DbType.AnsiString, model.ViewType);
            db.AddInParameter(dbCommand, "FormatType", DbType.AnsiString, model.FormatType);
            db.AddInParameter(dbCommand, "Ext", DbType.AnsiString, model.Ext);
            db.AddInParameter(dbCommand, "URL", DbType.AnsiString, model.URL);
            db.AddInParameter(dbCommand, "Description", DbType.String, model.Description);
            db.AddInParameter(dbCommand, "DownLoadCount", DbType.Int32, model.DownLoadCount);
            db.AddInParameter(dbCommand, "ViewCount", DbType.Int32, model.ViewCount);
            db.AddInParameter(dbCommand, "FileSize", DbType.Decimal, model.FileSize);
            db.AddInParameter(dbCommand, "ImgWidth", DbType.Int32, model.ImgWidth);
            db.AddInParameter(dbCommand, "ImgHeight", DbType.Int32, model.ImgHeight);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
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
        public bool Update(XCLCMS.Data.Model.Attachment model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Attachment_Update");
            db.AddInParameter(dbCommand, "AttachmentID", DbType.Int64, model.AttachmentID);
            db.AddInParameter(dbCommand, "ParentID", DbType.Int64, model.ParentID);
            db.AddInParameter(dbCommand, "OriginFileName", DbType.AnsiString, model.OriginFileName);
            db.AddInParameter(dbCommand, "FileName", DbType.AnsiString, model.FileName);
            db.AddInParameter(dbCommand, "Title", DbType.String, model.Title);
            db.AddInParameter(dbCommand, "ViewType", DbType.AnsiString, model.ViewType);
            db.AddInParameter(dbCommand, "FormatType", DbType.AnsiString, model.FormatType);
            db.AddInParameter(dbCommand, "Ext", DbType.AnsiString, model.Ext);
            db.AddInParameter(dbCommand, "URL", DbType.AnsiString, model.URL);
            db.AddInParameter(dbCommand, "Description", DbType.String, model.Description);
            db.AddInParameter(dbCommand, "DownLoadCount", DbType.Int32, model.DownLoadCount);
            db.AddInParameter(dbCommand, "ViewCount", DbType.Int32, model.ViewCount);
            db.AddInParameter(dbCommand, "FileSize", DbType.Decimal, model.FileSize);
            db.AddInParameter(dbCommand, "ImgWidth", DbType.Int32, model.ImgWidth);
            db.AddInParameter(dbCommand, "ImgHeight", DbType.Int32, model.ImgHeight);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
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
        public XCLCMS.Data.Model.Attachment GetModel(long AttachmentID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from Attachment WITH(NOLOCK)   where AttachmentID=@AttachmentID");
            db.AddInParameter(dbCommand, "AttachmentID", DbType.Int64, AttachmentID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.Attachment>(dr);
            }
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.Attachment> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select *  FROM Attachment  WITH(NOLOCK)  ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            using (var dr = db.ExecuteReader(CommandType.Text, strSql.ToString()))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.Attachment>(dr);
            }
        }

        /// <summary>
        /// 获取指定id的子记录信息
        /// </summary>
        public List<XCLCMS.Data.Model.Attachment> GetListByParentID(long parentId)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from Attachment  WITH(NOLOCK)  where ParentID=@ParentID");
            db.AddInParameter(dbCommand, "ParentID", DbType.Int64, parentId);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.Attachment>(dr);
            }
        }

        /// <summary>
        /// 获取与指定附件相关的附件列表（不包含该指定的附件id）
        /// </summary>
        public List<XCLCMS.Data.Model.Attachment> GetCorrelativeList(long attachmentID)
        {
            var model = this.GetModel(attachmentID);
            if (null == model)
            {
                return new List<Model.Attachment>();
            }
            XCLCMS.Data.Model.Attachment tempModel = null;
            List<XCLCMS.Data.Model.Attachment> temp = null;
            List<XCLCMS.Data.Model.Attachment> result = new List<Model.Attachment>();

            temp = this.GetListByParentID(model.AttachmentID);

            if (null != temp && temp.Count > 0)
            {
                result.AddRange(temp);
            }

            if (model.ParentID > 0)
            {
                temp = this.GetListByParentID(model.ParentID);
                if (null != temp && temp.Count > 0)
                {
                    result.AddRange(temp);
                }

                tempModel = this.GetModel(model.ParentID);
                if (null != tempModel)
                {
                    result.Add(tempModel);
                }
            }

            if (result.Count > 0)
            {
                result = result.Distinct().Where(k => k.AttachmentID != attachmentID).ToList();
            }

            return result;
        }

        /// <summary>
        /// 批量删除
        /// </summary>
        public bool Delete(List<long> idLst, XCLCMS.Data.Model.Custom.ContextModel context)
        {
            if (null == idLst || idLst.Count == 0)
            {
                return true;
            }
            DateTime dtNow = DateTime.Now;
            using (var scope = new TransactionScope())
            {
                foreach (var id in idLst)
                {
                    var model = this.GetModel(id);
                    if (null == model)
                    {
                        continue;
                    }
                    //删除当前记录
                    model.UpdaterID = context.UserInfoID;
                    model.UpdaterName = context.UserName;
                    model.UpdateTime = dtNow;
                    model.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.D.ToString();
                    if (!this.Update(model))
                    {
                        return false;
                    }
                    //更新子记录的parentid为0
                    var subLst = this.GetListByParentID(id);
                    if (null != subLst && subLst.Count > 0)
                    {
                        foreach (var subModel in subLst)
                        {
                            subModel.ParentID = 0;
                            subModel.UpdaterID = context.UserInfoID;
                            subModel.UpdaterName = context.UserName;
                            subModel.UpdateTime = dtNow;
                            if (!this.Update(subModel))
                            {
                                return false;
                            }
                        }
                    }
                }
                scope.Complete();
            }
            return true;
        }

        /// <summary>
        /// 根据文件id查询文件信息
        /// </summary>
        public List<XCLCMS.Data.Model.Attachment> GetList(List<long> ids)
        {
            if (null == ids || ids.Count == 0)
            {
                return new List<Model.Attachment>();
            }
            ids = ids.Distinct().ToList();

            string sql = @"
                select a.* from Attachment as a WITH(NOLOCK)
                inner join @TVP_ID as b on a.AttachmentID=b.ID
            ";

            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(sql);
            dbCommand.Parameters.Add(new SqlParameter("@TVP_ID", SqlDbType.Structured)
            {
                TypeName = "TVP_IDTable",
                Direction = ParameterDirection.Input,
                Value = XCLNetTools.DataSource.DataTableHelper.ToSingleColumnDataTable<long, long>(ids)
            });
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.Attachment>(dr);
            }
        }
    }
}