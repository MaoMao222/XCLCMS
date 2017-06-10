using Microsoft.Practices.EnterpriseLibrary.Data;
using RazorEngine.Templating;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;
using XCLNetTools.Generic;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:Article
    /// </summary>
    public partial class Article : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public Article()
        { }

        #region Method

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.Article model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Article_ADD");
            db.AddInParameter(dbCommand, "ArticleID", DbType.Int64, model.ArticleID);
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, model.Code);
            db.AddInParameter(dbCommand, "Title", DbType.String, model.Title);
            db.AddInParameter(dbCommand, "SubTitle", DbType.String, model.SubTitle);
            db.AddInParameter(dbCommand, "AuthorName", DbType.String, model.AuthorName);
            db.AddInParameter(dbCommand, "FromInfo", DbType.String, model.FromInfo);
            db.AddInParameter(dbCommand, "ArticleContentType", DbType.AnsiString, model.ArticleContentType);
            db.AddInParameter(dbCommand, "Contents", DbType.String, model.Contents);
            db.AddInParameter(dbCommand, "Summary", DbType.String, model.Summary);
            db.AddInParameter(dbCommand, "MainImage1", DbType.Int64, model.MainImage1);
            db.AddInParameter(dbCommand, "MainImage2", DbType.Int64, model.MainImage2);
            db.AddInParameter(dbCommand, "MainImage3", DbType.Int64, model.MainImage3);
            db.AddInParameter(dbCommand, "ViewCount", DbType.Int32, model.ViewCount);
            db.AddInParameter(dbCommand, "IsCanComment", DbType.AnsiString, model.IsCanComment);
            db.AddInParameter(dbCommand, "CommentCount", DbType.Int32, model.CommentCount);
            db.AddInParameter(dbCommand, "GoodCount", DbType.Int32, model.GoodCount);
            db.AddInParameter(dbCommand, "MiddleCount", DbType.Int32, model.MiddleCount);
            db.AddInParameter(dbCommand, "BadCount", DbType.Int32, model.BadCount);
            db.AddInParameter(dbCommand, "HotCount", DbType.Int32, model.HotCount);
            db.AddInParameter(dbCommand, "URLOpenType", DbType.AnsiString, model.URLOpenType);
            db.AddInParameter(dbCommand, "ArticleState", DbType.AnsiString, model.ArticleState);
            db.AddInParameter(dbCommand, "VerifyState", DbType.AnsiString, model.VerifyState);
            db.AddInParameter(dbCommand, "IsRecommend", DbType.AnsiString, model.IsRecommend);
            db.AddInParameter(dbCommand, "IsEssence", DbType.AnsiString, model.IsEssence);
            db.AddInParameter(dbCommand, "IsTop", DbType.AnsiString, model.IsTop);
            db.AddInParameter(dbCommand, "TopBeginTime", DbType.DateTime, model.TopBeginTime);
            db.AddInParameter(dbCommand, "TopEndTime", DbType.DateTime, model.TopEndTime);
            db.AddInParameter(dbCommand, "KeyWords", DbType.String, model.KeyWords);
            db.AddInParameter(dbCommand, "Tags", DbType.String, model.Tags);
            db.AddInParameter(dbCommand, "Comments", DbType.String, model.Comments);
            db.AddInParameter(dbCommand, "LinkUrl", DbType.AnsiString, model.LinkUrl);
            db.AddInParameter(dbCommand, "PublishTime", DbType.DateTime, model.PublishTime);
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
        public bool Update(XCLCMS.Data.Model.Article model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_Article_Update");
            db.AddInParameter(dbCommand, "ArticleID", DbType.Int64, model.ArticleID);
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, model.Code);
            db.AddInParameter(dbCommand, "Title", DbType.String, model.Title);
            db.AddInParameter(dbCommand, "SubTitle", DbType.String, model.SubTitle);
            db.AddInParameter(dbCommand, "AuthorName", DbType.String, model.AuthorName);
            db.AddInParameter(dbCommand, "FromInfo", DbType.String, model.FromInfo);
            db.AddInParameter(dbCommand, "ArticleContentType", DbType.AnsiString, model.ArticleContentType);
            db.AddInParameter(dbCommand, "Contents", DbType.String, model.Contents);
            db.AddInParameter(dbCommand, "Summary", DbType.String, model.Summary);
            db.AddInParameter(dbCommand, "MainImage1", DbType.Int64, model.MainImage1);
            db.AddInParameter(dbCommand, "MainImage2", DbType.Int64, model.MainImage2);
            db.AddInParameter(dbCommand, "MainImage3", DbType.Int64, model.MainImage3);
            db.AddInParameter(dbCommand, "ViewCount", DbType.Int32, model.ViewCount);
            db.AddInParameter(dbCommand, "IsCanComment", DbType.AnsiString, model.IsCanComment);
            db.AddInParameter(dbCommand, "CommentCount", DbType.Int32, model.CommentCount);
            db.AddInParameter(dbCommand, "GoodCount", DbType.Int32, model.GoodCount);
            db.AddInParameter(dbCommand, "MiddleCount", DbType.Int32, model.MiddleCount);
            db.AddInParameter(dbCommand, "BadCount", DbType.Int32, model.BadCount);
            db.AddInParameter(dbCommand, "HotCount", DbType.Int32, model.HotCount);
            db.AddInParameter(dbCommand, "URLOpenType", DbType.AnsiString, model.URLOpenType);
            db.AddInParameter(dbCommand, "ArticleState", DbType.AnsiString, model.ArticleState);
            db.AddInParameter(dbCommand, "VerifyState", DbType.AnsiString, model.VerifyState);
            db.AddInParameter(dbCommand, "IsRecommend", DbType.AnsiString, model.IsRecommend);
            db.AddInParameter(dbCommand, "IsEssence", DbType.AnsiString, model.IsEssence);
            db.AddInParameter(dbCommand, "IsTop", DbType.AnsiString, model.IsTop);
            db.AddInParameter(dbCommand, "TopBeginTime", DbType.DateTime, model.TopBeginTime);
            db.AddInParameter(dbCommand, "TopEndTime", DbType.DateTime, model.TopEndTime);
            db.AddInParameter(dbCommand, "KeyWords", DbType.String, model.KeyWords);
            db.AddInParameter(dbCommand, "Tags", DbType.String, model.Tags);
            db.AddInParameter(dbCommand, "Comments", DbType.String, model.Comments);
            db.AddInParameter(dbCommand, "LinkUrl", DbType.AnsiString, model.LinkUrl);
            db.AddInParameter(dbCommand, "PublishTime", DbType.DateTime, model.PublishTime);
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
        public XCLCMS.Data.Model.Article GetModel(long ArticleID)
        {
            XCLCMS.Data.Model.Article model = new XCLCMS.Data.Model.Article();
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from Article WITH(NOLOCK)   where ArticleID=@ArticleID");
            db.AddInParameter(dbCommand, "ArticleID", DbType.Int64, ArticleID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.Article>(dr);
            }
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.Article> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM Article  WITH(NOLOCK)  ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.Article>(dr);
            }
        }

        #endregion Method

        #region MethodEx

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.Article> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            condition.TableName = "Article";
            return XCLCMS.Data.DAL.Common.Common.GetPageList<XCLCMS.Data.Model.Article>(pageInfo, condition);
        }

        /// <summary>
        /// 判断指定code是否存在
        /// </summary>
        public bool IsExistCode(string code)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select top 1 1 from Article  WITH(NOLOCK)  where Code=@Code");
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, code);
            return db.ExecuteScalar(dbCommand) != null;
        }

        /// <summary>
        /// 获取指定文章的相关联的其它文章信息（相同商户且相同应用）
        /// </summary>
        public XCLCMS.Data.Model.Custom.ArticleRelationDetailModel GetRelationDetail(XCLCMS.Data.Model.Custom.ArticleRelationDetailCondition condition)
        {
            var result = new XCLCMS.Data.Model.Custom.ArticleRelationDetailModel();

            var model = this.GetModel(condition.ArticleID);
            if (null == model)
            {
                return result;
            }

            Database db = base.CreateDatabase();
            string sql = RazorEngine.Engine.Razor.RunCompile(Properties.Resources.Article_GetRelationDetail, "XCLCMS.Data.DAL.Article.GetRelationDetail", null, new
            {
                ArticleRecordState = null == condition.ArticleRecordState ? string.Empty : " and tb_Article.RecordState=@ArticleRecordState",
                IsASC = condition.IsASC
            });
            DbCommand dbCommand = db.GetSqlStringCommand(sql);
            db.AddInParameter(dbCommand, "ArticleID", DbType.Int64, condition.ArticleID);
            db.AddInParameter(dbCommand, "IsASC", DbType.Byte, condition.IsASC ? 1 : 0);
            db.AddInParameter(dbCommand, "TopCount", DbType.Int32, condition.TopCount ?? 10);
            db.AddInParameter(dbCommand, "ArticleRecordState", DbType.AnsiString, condition.ArticleRecordState);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
            db.AddInParameter(dbCommand, "FK_MerchantAppID", DbType.Int64, model.FK_MerchantAppID);
            var ds = db.ExecuteDataSet(dbCommand);
            if (null != ds && null != ds.Tables && ds.Tables.Count == 3)
            {
                var lst = XCLNetTools.Generic.ListHelper.DataTableToList<XCLCMS.Data.Model.Article>(ds.Tables[0]);
                if (lst.IsNotNullOrEmpty())
                {
                    result.PreArticle = lst[0];
                }
                lst = XCLNetTools.Generic.ListHelper.DataTableToList<XCLCMS.Data.Model.Article>(ds.Tables[1]);
                if (lst.IsNotNullOrEmpty())
                {
                    result.NextArticle = lst[0];
                }
                result.SameTypeArticleList = XCLNetTools.Generic.ListHelper.DataTableToList<XCLCMS.Data.Model.Article>(ds.Tables[2]) as List<XCLCMS.Data.Model.Article>;
            }
            return result;
        }

        #endregion MethodEx
    }
}