using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace XCLCMS.View.AdminWeb.Controllers.Article
{
    /// <summary>
    /// 文章controller
    /// </summary>
    public class ArticleController : BaseController
    {
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_ArticleView)]
        public ActionResult Index()
        {
            XCLCMS.View.AdminWeb.Models.Article.ArticleListVM viewModel = new XCLCMS.View.AdminWeb.Models.Article.ArticleListVM();

            #region 初始化查询条件

            viewModel.Search = new XCLNetSearch.Search();
            viewModel.Search.TypeList = new List<XCLNetSearch.SearchFieldInfo>() {
                new XCLNetSearch.SearchFieldInfo("文章ID","ArticleID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户ID","FK_MerchantID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用ID","FK_MerchantAppID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户名","MerchantName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用名","MerchantAppName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("标题","Title|string|text",""),
                new XCLNetSearch.SearchFieldInfo("作者","AuthorName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("来源","FromInfo|string|text",""),
                new XCLNetSearch.SearchFieldInfo("内容类型","ArticleContentType|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.ArticleContentTypeEnum))),
                new XCLNetSearch.SearchFieldInfo("浏览数","ViewCount|number|text",""),
                new XCLNetSearch.SearchFieldInfo("评论数","CommentCount|number|text",""),
                new XCLNetSearch.SearchFieldInfo("热度","HotCount|number|text",""),
                new XCLNetSearch.SearchFieldInfo("文章状态","ArticleState|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.ArticleStateEnum))),
                new XCLNetSearch.SearchFieldInfo("记录状态","RecordState|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum))),
                new XCLNetSearch.SearchFieldInfo("创建时间","CreateTime|dateTime|text",""),
                new XCLNetSearch.SearchFieldInfo("创建者名","CreaterName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("更新时间","UpdateTime|dateTime|text",""),
                new XCLNetSearch.SearchFieldInfo("更新人名","UpdaterName|string|text","")
            };
            string strWhere = viewModel.Search.StrSQL;

            #endregion 初始化查询条件

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.PageListConditionEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.PageListConditionEntity()
            {
                PagerInfoSimple = base.PageParamsInfo.ToPagerInfoSimple(),
                Where = strWhere
            };
            var response = XCLCMS.Lib.WebAPI.ArticleAPI.PageList(request).Body;
            viewModel.ArticleList = response.ResultList;
            viewModel.PagerModel = response.PagerInfo;

            return View("~/Views/Article/ArticleList.cshtml", viewModel);
        }

        /// <summary>
        /// 添加或编辑首页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_ArticleAdd)]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_ArticleEdit)]
        public ActionResult Add()
        {
            long articleID = XCLNetTools.StringHander.FormHelper.GetLong("ArticleID");

            XCLCMS.View.AdminWeb.Models.Article.ArticleAddVM viewModel = new XCLCMS.View.AdminWeb.Models.Article.ArticleAddVM();

            switch (base.CurrentHandleType)
            {
                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD:
                    viewModel.Article = new Data.Model.View.v_Article();
                    viewModel.Article.IsCanComment = XCLCMS.Data.CommonHelper.EnumType.YesNoEnum.Y.ToString();
                    viewModel.FormAction = Url.Action("AddSubmit", "Article");
                    viewModel.Article.PublishTime = DateTime.Now.Date;
                    viewModel.Article.FK_MerchantID = base.CurrentUserModel.FK_MerchantID;
                    viewModel.Article.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
                    break;

                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.UPDATE:
                    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
                    request.Body = articleID;
                    var response = XCLCMS.Lib.WebAPI.ArticleAPI.Detail(request);

                    viewModel.Article = response.Body;

                    //获取附件列表
                    var attRequest = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.GetObjectAttachmentListEntity>(base.UserToken);
                    attRequest.Body = new Data.WebAPIEntity.RequestEntity.Attachment.GetObjectAttachmentListEntity()
                    {
                        ObjectID = viewModel.Article.ArticleID,
                        ObjectType = XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum.ART.ToString()
                    };
                    var attResponse = XCLCMS.Lib.WebAPI.AttachmentAPI.GetObjectAttachmentList(attRequest);
                    if (null != attResponse.Body && attResponse.Body.Count > 0)
                    {
                        viewModel.AttachmentIDList = attResponse.Body.Select(k => k.AttachmentID).ToList();
                    }

                    viewModel.FormAction = Url.Action("UpdateSubmit", "Article");
                    break;
            }

            viewModel.ArticleStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.ArticleStateEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Article.ArticleState
            });
            viewModel.ArticleContentTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.ArticleContentTypeEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Article.ArticleContentType
            });
            viewModel.URLOpenTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.URLOpenTypeEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = true,
                DefaultValue = viewModel.Article.URLOpenType
            });
            viewModel.FromInfoOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.ArticleFromInfoEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Article.FromInfo
            });
            viewModel.AuthorNameOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.ArticleAuthorNameEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Article.AuthorName
            });
            viewModel.VerifyStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.VerifyStateEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Article.VerifyState
            });
            viewModel.RecordStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Article.RecordState
            });

            return View("~/Views/Article/ArticleAdd.cshtml", viewModel);
        }

        /// <summary>
        /// 查看页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_ArticleView)]
        public ActionResult Show()
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Article.ArticleShowVM();

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
            request.Body = XCLNetTools.StringHander.FormHelper.GetLong("articleID");
            var response = XCLCMS.Lib.WebAPI.ArticleAPI.Detail(request);

            viewModel.Article = response.Body ?? new Data.Model.View.v_Article();

            //获取主图列表
            var mainImgRequest = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.GetAttachmentListByIDListEntity>(base.UserToken);
            mainImgRequest.Body = new Data.WebAPIEntity.RequestEntity.Attachment.GetAttachmentListByIDListEntity();
            mainImgRequest.Body.AttachmentIDList = new List<long>() {
                viewModel.Article.MainImage1.GetValueOrDefault(),
                viewModel.Article.MainImage2.GetValueOrDefault(),
                viewModel.Article.MainImage3.GetValueOrDefault()
            };
            var mainImgResponse = XCLCMS.Lib.WebAPI.AttachmentAPI.GetAttachmentListByIDList(mainImgRequest);
            viewModel.MainImgList = mainImgResponse.Body;

            //获取附件列表
            var attRequest = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.GetObjectAttachmentListEntity>(base.UserToken);
            attRequest.Body = new Data.WebAPIEntity.RequestEntity.Attachment.GetObjectAttachmentListEntity()
            {
                ObjectID = viewModel.Article.ArticleID,
                ObjectType = XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum.ART.ToString()
            };
            var attResponse = XCLCMS.Lib.WebAPI.AttachmentAPI.GetObjectAttachmentList(attRequest);
            viewModel.AttactmentList = attResponse.Body;
            return View("~/Views/Article/ArticleShow.cshtml", viewModel);
        }

        /// <summary>
        /// 将表单值转为viewModel
        /// </summary>
        private XCLCMS.View.AdminWeb.Models.Article.ArticleAddVM GetViewModel(FormCollection fm)
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Article.ArticleAddVM();

            var mainImageIDList = XCLNetTools.StringHander.FormHelper.GetLongList("mainImage");

            viewModel.AttachmentIDList = XCLNetTools.StringHander.FormHelper.GetLongList("txtAttachments");
            viewModel.ArticleTypeIDList = XCLNetTools.StringHander.FormHelper.GetLongList("selArticleType");

            viewModel.Article = new Data.Model.View.v_Article();
            viewModel.Article.ArticleID = XCLNetTools.StringHander.FormHelper.GetLong("ArticleID");
            viewModel.Article.ArticleContentType = XCLNetTools.StringHander.FormHelper.GetString("selArticleContentType");
            viewModel.Article.ArticleState = XCLNetTools.StringHander.FormHelper.GetString("selArticleState");
            viewModel.Article.AuthorName = XCLNetTools.StringHander.FormHelper.GetString("selAuthorName");
            viewModel.Article.BadCount = XCLNetTools.StringHander.FormHelper.GetInt("txtBadCount");
            viewModel.Article.Code = XCLNetTools.StringHander.FormHelper.GetString("txtCode").Trim();
            viewModel.Article.Comments = XCLNetTools.StringHander.FormHelper.GetString("txtComments");
            viewModel.Article.Contents = XCLNetTools.StringHander.FormHelper.GetString("txtContents");
            viewModel.Article.FromInfo = XCLNetTools.StringHander.FormHelper.GetString("selFromInfo");
            viewModel.Article.GoodCount = XCLNetTools.StringHander.FormHelper.GetInt("txtGoodCount");
            viewModel.Article.HotCount = XCLNetTools.StringHander.FormHelper.GetInt("txtHotCount");
            viewModel.Article.IsCanComment = XCLNetTools.StringHander.FormHelper.GetString("ckIsCanComment");
            viewModel.Article.IsEssence = XCLNetTools.StringHander.FormHelper.GetString("ckIsEssence");
            viewModel.Article.IsRecommend = XCLNetTools.StringHander.FormHelper.GetString("ckIsRecommend");
            viewModel.Article.IsTop = XCLNetTools.StringHander.FormHelper.GetString("ckIsTop");
            viewModel.Article.KeyWords = XCLNetTools.StringHander.FormHelper.GetString("txtKeyWords");
            viewModel.Article.LinkUrl = XCLNetTools.StringHander.FormHelper.GetString("txtLinkUrl");
            viewModel.Article.RecordState = XCLNetTools.StringHander.FormHelper.GetString("selRecordState");

            if (null != mainImageIDList && mainImageIDList.Count > 0)
            {
                viewModel.Article.MainImage1 = mainImageIDList.Count >= 1 ? mainImageIDList[0] : 0;
                viewModel.Article.MainImage2 = mainImageIDList.Count >= 2 ? mainImageIDList[1] : 0;
                viewModel.Article.MainImage3 = mainImageIDList.Count >= 3 ? mainImageIDList[2] : 0;
            }
            else
            {
                viewModel.Article.MainImage1 = 0;
                viewModel.Article.MainImage2 = 0;
                viewModel.Article.MainImage3 = 0;
            }

            viewModel.Article.MiddleCount = XCLNetTools.StringHander.FormHelper.GetInt("txtMiddleCount");
            viewModel.Article.PublishTime = XCLNetTools.StringHander.FormHelper.GetDateTimeNull("txtPublishTime");
            viewModel.Article.SubTitle = XCLNetTools.StringHander.FormHelper.GetString("txtSubTitle");
            viewModel.Article.Summary = XCLNetTools.StringHander.FormHelper.GetString("txtSummary");
            viewModel.Article.Tags = XCLNetTools.StringHander.FormHelper.GetString("txtTags");
            viewModel.Article.Title = XCLNetTools.StringHander.FormHelper.GetString("txtTitle");
            viewModel.Article.TopBeginTime = XCLNetTools.StringHander.FormHelper.GetDateTimeNull("txtBeginTop");
            viewModel.Article.TopEndTime = XCLNetTools.StringHander.FormHelper.GetDateTimeNull("txtEndTop");
            viewModel.Article.URLOpenType = XCLNetTools.StringHander.FormHelper.GetString("selURLOpenType");
            viewModel.Article.VerifyState = XCLNetTools.StringHander.FormHelper.GetString("selVerifyState");
            viewModel.Article.ViewCount = XCLNetTools.StringHander.FormHelper.GetInt("txtViewCount");
            viewModel.Article.FK_MerchantID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantID");
            viewModel.Article.FK_MerchantAppID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantAppID");

            return viewModel;
        }

        /// <summary>
        /// 添加文章信息
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_ArticleAdd)]
        public override ActionResult AddSubmit(FormCollection fm)
        {
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();

            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.Article();
            model.ArticleContentType = viewModel.Article.ArticleContentType;
            model.ArticleID = XCLCMS.Lib.WebAPI.Library.CommonAPI_GenerateID(base.UserToken, new Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity()
            {
                IDType = Data.CommonHelper.EnumType.IDTypeEnum.ART.ToString()
            });
            model.ArticleState = viewModel.Article.ArticleState;
            model.AuthorName = viewModel.Article.AuthorName;
            model.BadCount = viewModel.Article.BadCount;
            if (string.IsNullOrWhiteSpace(viewModel.Article.Code))
            {
                model.Code = model.ArticleID.ToString();
            }
            else
            {
                model.Code = viewModel.Article.Code;
            }

            model.CommentCount = viewModel.Article.CommentCount;
            model.Comments = viewModel.Article.Comments;
            model.Contents = viewModel.Article.Contents;
            model.FromInfo = viewModel.Article.FromInfo;
            model.GoodCount = viewModel.Article.GoodCount;
            model.HotCount = viewModel.Article.HotCount;
            model.IsCanComment = viewModel.Article.IsCanComment;
            model.IsEssence = viewModel.Article.IsEssence;
            model.IsRecommend = viewModel.Article.IsRecommend;
            model.IsTop = viewModel.Article.IsTop;
            model.KeyWords = viewModel.Article.KeyWords;
            model.LinkUrl = viewModel.Article.LinkUrl;
            model.MainImage1 = viewModel.Article.MainImage1;
            model.MainImage2 = viewModel.Article.MainImage2;
            model.MainImage3 = viewModel.Article.MainImage3;
            model.MiddleCount = viewModel.Article.MiddleCount;
            model.PublishTime = viewModel.Article.PublishTime;
            model.RecordState = viewModel.Article.RecordState;
            model.SubTitle = viewModel.Article.SubTitle;
            model.Summary = viewModel.Article.Summary;
            model.Tags = viewModel.Article.Tags;
            model.Title = viewModel.Article.Title;
            model.TopBeginTime = viewModel.Article.TopBeginTime;
            model.TopEndTime = viewModel.Article.TopEndTime;
            model.URLOpenType = viewModel.Article.URLOpenType;
            model.VerifyState = viewModel.Article.VerifyState;
            model.ViewCount = viewModel.Article.ViewCount;
            model.FK_MerchantAppID = viewModel.Article.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.Article.FK_MerchantID;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.Article.AddOrUpdateEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.Article.AddOrUpdateEntity();
            request.Body.Article = model;
            request.Body.ArticleAttachmentIDList = viewModel.AttachmentIDList;
            request.Body.ArticleTypeIDList = viewModel.ArticleTypeIDList;
            var response = XCLCMS.Lib.WebAPI.ArticleAPI.Add(request);

            return Json(response);
        }

        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_ArticleEdit)]
        public override ActionResult UpdateSubmit(FormCollection fm)
        {
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();

            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.Article();
            model.ArticleID = viewModel.Article.ArticleID;

            model.RecordState = viewModel.Article.RecordState;
            model.ArticleContentType = viewModel.Article.ArticleContentType;
            model.ArticleState = viewModel.Article.ArticleState;
            model.AuthorName = viewModel.Article.AuthorName;
            model.BadCount = viewModel.Article.BadCount;
            if (string.IsNullOrWhiteSpace(viewModel.Article.Code))
            {
                model.Code = model.ArticleID.ToString();
            }
            else
            {
                model.Code = viewModel.Article.Code;
            }

            model.CommentCount = viewModel.Article.CommentCount;
            model.Comments = viewModel.Article.Comments;
            model.Contents = viewModel.Article.Contents;
            model.FromInfo = viewModel.Article.FromInfo;
            model.GoodCount = viewModel.Article.GoodCount;
            model.HotCount = viewModel.Article.HotCount;
            model.IsCanComment = viewModel.Article.IsCanComment;
            model.IsEssence = viewModel.Article.IsEssence;
            model.IsRecommend = viewModel.Article.IsRecommend;
            model.IsTop = viewModel.Article.IsTop;
            model.KeyWords = viewModel.Article.KeyWords;
            model.LinkUrl = viewModel.Article.LinkUrl;
            model.MainImage1 = viewModel.Article.MainImage1;
            model.MainImage2 = viewModel.Article.MainImage2;
            model.MainImage3 = viewModel.Article.MainImage3;
            model.MiddleCount = viewModel.Article.MiddleCount;
            model.PublishTime = viewModel.Article.PublishTime;
            model.SubTitle = viewModel.Article.SubTitle;
            model.Summary = viewModel.Article.Summary;
            model.Tags = viewModel.Article.Tags;
            model.Title = viewModel.Article.Title;
            model.TopBeginTime = viewModel.Article.TopBeginTime;
            model.TopEndTime = viewModel.Article.TopEndTime;
            model.URLOpenType = viewModel.Article.URLOpenType;
            model.VerifyState = viewModel.Article.VerifyState;
            model.ViewCount = viewModel.Article.ViewCount;
            model.FK_MerchantAppID = viewModel.Article.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.Article.FK_MerchantID;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.Article.AddOrUpdateEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.Article.AddOrUpdateEntity();
            request.Body.Article = model;
            request.Body.ArticleAttachmentIDList = viewModel.AttachmentIDList;
            request.Body.ArticleTypeIDList = viewModel.ArticleTypeIDList;
            var response = XCLCMS.Lib.WebAPI.ArticleAPI.Update(request);

            return Json(response);
        }
    }
}