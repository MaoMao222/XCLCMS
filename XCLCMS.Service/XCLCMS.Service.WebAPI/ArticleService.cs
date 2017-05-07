using System;
using System.Collections.Generic;
using System.Linq;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.IService.WebAPI;
using XCLNetTools.Generic;

namespace XCLCMS.Service.WebAPI
{
    /// <summary>
    /// 文章
    /// </summary>
    public class ArticleService : IArticleService
    {
        private XCLCMS.Data.BLL.Article articleBLL = new Data.BLL.Article();
        private XCLCMS.Data.BLL.View.v_Article vArticleBLL = new XCLCMS.Data.BLL.View.v_Article();
        private XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();
        private XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();
        private XCLCMS.Data.BLL.SysDic sysDicBLL = new Data.BLL.SysDic();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 查询文章信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.View.v_Article> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.View.v_Article>();
            response.Body = vArticleBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 查询指定文章关联的其它文章信息
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.Custom.ArticleRelationDetailModel> RelationDetail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.Custom.ArticleRelationDetailModel>();
            var condition = new Data.Model.Custom.ArticleRelationDetailCondition()
            {
                ArticleID = request.Body,
                IsASC = false,
                ArticleRecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString(),
                TopCount = 6
            };
            response.Body = articleBLL.GetRelationDetail(condition);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 查询文章信息分页列表
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Article>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            var pager = request.Body.PagerInfoSimple.ToPagerInfo();
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Article>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_Article>();
            response.Body.ResultList = vArticleBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
            {
                OrderBy = "[ArticleID] desc",
                Where = request.Body.Where
            });
            response.Body.PagerInfo = pager;
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 查询文章信息分页列表(简单分页)
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Article>> SimplePageList(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Article.SimplePageListEntity> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Article>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_Article>();
            response.Body.ResultList = vArticleBLL.GetPageList(request.Body.PageInfo, request.Body.Condition);
            response.Body.PagerInfo = request.Body.PageInfo;
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 检查文章code是否已存在
        /// </summary>
        public APIResponseEntity<bool> IsExistCode(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Article.IsExistCodeEntity> request)
        {
            #region 初始化

            var response = new APIResponseEntity<bool>()
            {
                IsSuccess = true,
                Message = "该唯一标识可以使用！"
            };
            request.Body.Code = (request.Body.Code ?? "").Trim();
            XCLCMS.Data.Model.Article model = null;

            #endregion 初始化

            #region 数据校验

            if (string.IsNullOrEmpty(request.Body.Code))
            {
                response.Message = "请指定Code参数！";
                response.IsSuccess = false;
                return response;
            }

            #endregion 数据校验

            #region 构建response

            if (request.Body.ArticleID > 0)
            {
                model = articleBLL.GetModel(request.Body.ArticleID);
                if (null != model && string.Equals(request.Body.Code, model.Code, StringComparison.OrdinalIgnoreCase))
                {
                    return response;
                }
            }

            if (articleBLL.IsExistCode(request.Body.Code))
            {
                response.IsSuccess = false;
                response.Message = "该唯一标识已被占用！";
                return response;
            }
            return response;

            #endregion 构建response
        }

        /// <summary>
        /// 新增文章信息
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Article.AddOrUpdateEntity> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            if (null == request.Body.Article)
            {
                response.IsSuccess = false;
                response.Message = "请指定文章信息！";
                return response;
            }
            if (string.IsNullOrWhiteSpace(request.Body.Article.Code))
            {
                request.Body.Article.Code = request.Body.Article.ArticleID.ToString();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.AuthorName))
            {
                request.Body.Article.AuthorName = request.Body.Article.AuthorName.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.Code))
            {
                request.Body.Article.Code = request.Body.Article.Code.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.Comments))
            {
                request.Body.Article.Comments = request.Body.Article.Comments.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.Contents))
            {
                request.Body.Article.Contents = request.Body.Article.Contents.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.FromInfo))
            {
                request.Body.Article.FromInfo = request.Body.Article.FromInfo.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.KeyWords))
            {
                request.Body.Article.KeyWords = request.Body.Article.KeyWords.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.LinkUrl))
            {
                request.Body.Article.LinkUrl = request.Body.Article.LinkUrl.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.SubTitle))
            {
                request.Body.Article.SubTitle = request.Body.Article.SubTitle.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.Summary))
            {
                request.Body.Article.Summary = request.Body.Article.Summary.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.Tags))
            {
                request.Body.Article.Tags = request.Body.Article.Tags.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.Title))
            {
                request.Body.Article.Title = request.Body.Article.Title.Trim();
            }

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.Article.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            //必须指定文章信息
            if (string.IsNullOrEmpty(request.Body.Article.Title))
            {
                response.IsSuccess = false;
                response.Message = "请指定文章标题！";
                return response;
            }

            //如果内容类型为链接，则必须指定链接地址
            if (string.IsNullOrWhiteSpace(request.Body.Article.LinkUrl) && string.Equals(request.Body.Article.ArticleContentType, XCLCMS.Data.CommonHelper.EnumType.ArticleContentTypeEnum.URL.ToString(), StringComparison.OrdinalIgnoreCase))
            {
                response.IsSuccess = false;
                response.Message = "请指定跳转链接地址！";
                return response;
            }

            //code是否被占用
            if (!string.IsNullOrEmpty(request.Body.Article.Code) && this.articleBLL.IsExistCode(request.Body.Article.Code))
            {
                response.IsSuccess = false;
                response.Message = "文章标识Code被占用，请重新指定！";
                return response;
            }

            //应用号与商户一致
            if (!this.merchantAppBLL.IsTheSameMerchantInfoID(request.Body.Article.FK_MerchantID, request.Body.Article.FK_MerchantAppID))
            {
                response.IsSuccess = false;
                response.Message = "商户号与应用号不匹配，请核对后再试！";
                return response;
            }

            //过滤非法文章分类
            if (request.Body.ArticleTypeIDList.IsNotNullOrEmpty())
            {
                request.Body.ArticleTypeIDList = request.Body.ArticleTypeIDList.Where(k =>
                {
                    var typeModel = this.sysDicBLL.GetModel(k);
                    return null != typeModel && typeModel.FK_MerchantID == request.Body.Article.FK_MerchantID;
                }).ToList();
            }

            #endregion 数据校验

            var articleContext = new Data.BLL.Strategy.Article.ArticleContext();
            articleContext.ContextInfo = this.ContextInfo;
            articleContext.Article = request.Body.Article;
            articleContext.HandleType = Data.BLL.Strategy.StrategyLib.HandleType.ADD;
            articleContext.ArticleTypeIDList = request.Body.ArticleTypeIDList;
            articleContext.ArticleAttachmentIDList = request.Body.ArticleAttachmentIDList;

            XCLCMS.Data.BLL.Strategy.ExecuteStrategy strategy = new Data.BLL.Strategy.ExecuteStrategy(new List<Data.BLL.Strategy.BaseStrategy>() {
                    new XCLCMS.Data.BLL.Strategy.Article.Article(),
                    new XCLCMS.Data.BLL.Strategy.Article.ObjectAttachment(),
                    new XCLCMS.Data.BLL.Strategy.Article.ArticleType(),
                    new XCLCMS.Data.BLL.Strategy.Article.Tags()
                });
            strategy.Execute(articleContext);

            if (strategy.Result != Data.BLL.Strategy.StrategyLib.ResultEnum.FAIL)
            {
                response.Message = "添加成功！";
                response.IsSuccess = true;
            }
            else
            {
                response.Message = strategy.ResultMessage;
                response.IsSuccess = false;
            }

            return response;
        }

        /// <summary>
        /// 修改文章信息
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Article.AddOrUpdateEntity> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            if (null == request.Body.Article)
            {
                response.IsSuccess = false;
                response.Message = "请指定文章信息！";
                return response;
            }
            if (string.IsNullOrWhiteSpace(request.Body.Article.Code))
            {
                request.Body.Article.Code = request.Body.Article.ArticleID.ToString();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.AuthorName))
            {
                request.Body.Article.AuthorName = request.Body.Article.AuthorName.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.Code))
            {
                request.Body.Article.Code = request.Body.Article.Code.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.Comments))
            {
                request.Body.Article.Comments = request.Body.Article.Comments.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.Contents))
            {
                request.Body.Article.Contents = request.Body.Article.Contents.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.FromInfo))
            {
                request.Body.Article.FromInfo = request.Body.Article.FromInfo.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.KeyWords))
            {
                request.Body.Article.KeyWords = request.Body.Article.KeyWords.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.LinkUrl))
            {
                request.Body.Article.LinkUrl = request.Body.Article.LinkUrl.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.SubTitle))
            {
                request.Body.Article.SubTitle = request.Body.Article.SubTitle.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.Summary))
            {
                request.Body.Article.Summary = request.Body.Article.Summary.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.Tags))
            {
                request.Body.Article.Tags = request.Body.Article.Tags.Trim();
            }
            if (!string.IsNullOrEmpty(request.Body.Article.Title))
            {
                request.Body.Article.Title = request.Body.Article.Title.Trim();
            }

            var model = this.articleBLL.GetModel(request.Body.Article.ArticleID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的文章信息！";
                return response;
            }

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.Article.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            //必须指定文章信息
            if (string.IsNullOrEmpty(request.Body.Article.Title))
            {
                response.IsSuccess = false;
                response.Message = "请指定文章标题！";
                return response;
            }

            //如果内容类型为链接，则必须指定链接地址
            if (string.IsNullOrWhiteSpace(request.Body.Article.LinkUrl) && string.Equals(request.Body.Article.ArticleContentType, XCLCMS.Data.CommonHelper.EnumType.ArticleContentTypeEnum.URL.ToString(), StringComparison.OrdinalIgnoreCase))
            {
                response.IsSuccess = false;
                response.Message = "请指定跳转链接地址！";
                return response;
            }

            //code是否被占用
            if (!string.IsNullOrEmpty(request.Body.Article.Code) && !string.Equals(model.Code, request.Body.Article.Code, StringComparison.OrdinalIgnoreCase) && this.articleBLL.IsExistCode(request.Body.Article.Code))
            {
                response.IsSuccess = false;
                response.Message = "文章标识Code被占用，请重新指定！";
                return response;
            }

            //应用号与商户一致
            if (!this.merchantAppBLL.IsTheSameMerchantInfoID(request.Body.Article.FK_MerchantID, request.Body.Article.FK_MerchantAppID))
            {
                response.IsSuccess = false;
                response.Message = "商户号与应用号不匹配，请核对后再试！";
                return response;
            }

            //过滤非法文章分类
            if (request.Body.ArticleTypeIDList.IsNotNullOrEmpty())
            {
                request.Body.ArticleTypeIDList = request.Body.ArticleTypeIDList.Where(k =>
                {
                    var typeModel = this.sysDicBLL.GetModel(k);
                    return null != typeModel && typeModel.FK_MerchantID == request.Body.Article.FK_MerchantID;
                }).ToList();
            }

            #endregion 数据校验

            model.RecordState = request.Body.Article.RecordState;
            model.ArticleContentType = request.Body.Article.ArticleContentType;
            model.ArticleState = request.Body.Article.ArticleState;
            model.AuthorName = request.Body.Article.AuthorName;
            model.BadCount = request.Body.Article.BadCount;
            if (string.IsNullOrWhiteSpace(request.Body.Article.Code))
            {
                model.Code = model.ArticleID.ToString();
            }
            else
            {
                model.Code = request.Body.Article.Code;
            }
            model.CommentCount = request.Body.Article.CommentCount;
            model.Comments = request.Body.Article.Comments;
            model.Contents = request.Body.Article.Contents;
            model.FromInfo = request.Body.Article.FromInfo;
            model.GoodCount = request.Body.Article.GoodCount;
            model.HotCount = request.Body.Article.HotCount;
            model.IsCanComment = request.Body.Article.IsCanComment;
            model.IsEssence = request.Body.Article.IsEssence;
            model.IsRecommend = request.Body.Article.IsRecommend;
            model.IsTop = request.Body.Article.IsTop;
            model.KeyWords = request.Body.Article.KeyWords;
            model.LinkUrl = request.Body.Article.LinkUrl;
            model.MainImage1 = request.Body.Article.MainImage1;
            model.MainImage2 = request.Body.Article.MainImage2;
            model.MainImage3 = request.Body.Article.MainImage3;
            model.MiddleCount = request.Body.Article.MiddleCount;
            model.PublishTime = request.Body.Article.PublishTime;
            model.SubTitle = request.Body.Article.SubTitle;
            model.Summary = request.Body.Article.Summary;
            model.Tags = request.Body.Article.Tags;
            model.Title = request.Body.Article.Title;
            model.TopBeginTime = request.Body.Article.TopBeginTime;
            model.TopEndTime = request.Body.Article.TopEndTime;
            model.URLOpenType = request.Body.Article.URLOpenType;
            model.VerifyState = request.Body.Article.VerifyState;
            model.ViewCount = request.Body.Article.ViewCount;
            model.FK_MerchantAppID = request.Body.Article.FK_MerchantAppID;
            model.FK_MerchantID = request.Body.Article.FK_MerchantID;

            var articleContext = new Data.BLL.Strategy.Article.ArticleContext();
            articleContext.ContextInfo = this.ContextInfo;
            articleContext.Article = model;
            articleContext.HandleType = Data.BLL.Strategy.StrategyLib.HandleType.UPDATE;
            articleContext.ArticleTypeIDList = request.Body.ArticleTypeIDList;
            articleContext.ArticleAttachmentIDList = request.Body.ArticleAttachmentIDList;

            XCLCMS.Data.BLL.Strategy.ExecuteStrategy strategy = new Data.BLL.Strategy.ExecuteStrategy(new List<Data.BLL.Strategy.BaseStrategy>() {
                new XCLCMS.Data.BLL.Strategy.Article.Article(),
                new XCLCMS.Data.BLL.Strategy.Article.ObjectAttachment(),
                new XCLCMS.Data.BLL.Strategy.Article.ArticleType(),
                new XCLCMS.Data.BLL.Strategy.Article.Tags()
            });
            strategy.Execute(articleContext);

            if (strategy.Result != Data.BLL.Strategy.StrategyLib.ResultEnum.FAIL)
            {
                response.Message = "修改成功！";
                response.IsSuccess = true;
            }
            else
            {
                response.Message = strategy.ResultMessage;
                response.IsSuccess = false;
            }

            return response;
        }

        /// <summary>
        /// 删除文章信息
        /// </summary>
        public APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            var response = new APIResponseEntity<bool>();

            if (request.Body.IsNotNullOrEmpty())
            {
                request.Body = request.Body.Where(k => k > 0).Distinct().ToList();
            }

            if (request.Body.IsNullOrEmpty())
            {
                response.IsSuccess = false;
                response.Message = "请指定要删除的文章ID！";
                return response;
            }

            foreach (var k in request.Body)
            {
                var articleModel = articleBLL.GetModel(k);
                if (null == articleModel)
                {
                    continue;
                }

                articleModel.UpdaterID = this.ContextInfo.UserInfoID;
                articleModel.UpdaterName = this.ContextInfo.UserName;
                articleModel.UpdateTime = DateTime.Now;
                articleModel.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.R.ToString();
                this.articleBLL.Update(articleModel);
            }

            response.IsSuccess = true;
            response.Message = "已成功删除文章信息！";
            response.IsRefresh = true;

            return response;
        }
    }
}