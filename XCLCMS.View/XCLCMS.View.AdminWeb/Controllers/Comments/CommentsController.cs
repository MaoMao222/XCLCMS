using System.Collections.Generic;
using System.Web.Mvc;

namespace XCLCMS.View.AdminWeb.Controllers.Comments
{
    /// <summary>
    /// 评论管理
    /// </summary>
    public class CommentsController : BaseController
    {
        /// <summary>
        /// 评论列表
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Comments_View)]
        public ActionResult Index()
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Comments.CommentsListVM();

            #region 初始化查询条件

            viewModel.Search = new XCLNetSearch.Search();
            viewModel.Search.TypeList = new List<XCLNetSearch.SearchFieldInfo>() {
                new XCLNetSearch.SearchFieldInfo("评论ID","CommentsID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户ID","FK_MerchantID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用ID","FK_MerchantAppID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户名","MerchantName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用名","MerchantAppName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("评论对象类别","ObjectType|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum))),
                new XCLNetSearch.SearchFieldInfo("评论对象ID","FK_ObjectID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("评论者","UserName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("电子邮件","Email|string|text",""),
                new XCLNetSearch.SearchFieldInfo("上级评论","ParentCommentID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("评论内容","Contents|string|text",""),
                new XCLNetSearch.SearchFieldInfo("点【好】数","GoodCount|number|text",""),
                new XCLNetSearch.SearchFieldInfo("点【中】数","MiddleCount|number|text",""),
                new XCLNetSearch.SearchFieldInfo("点【差】数","BadCount|number|text",""),
                new XCLNetSearch.SearchFieldInfo("审核状态","VerifyState|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.VerifyStateEnum))),
                new XCLNetSearch.SearchFieldInfo("备注","Remark|string|text",""),
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
            var response = XCLCMS.Lib.WebAPI.CommentsAPI.PageList(request).Body;
            viewModel.CommentsList = response.ResultList;
            viewModel.PagerModel = response.PagerInfo;

            return View(viewModel);
        }

        /// <summary>
        /// 添加与编辑页面首页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Comments_Add)]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Comments_Edit)]
        public ActionResult Add()
        {
            long CommentsID = XCLNetTools.StringHander.FormHelper.GetLong("CommentsID");

            var viewModel = new Models.Comments.CommentsAddVM();

            switch (base.CurrentHandleType)
            {
                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD:
                    viewModel.Comments = new Data.Model.Comments();
                    viewModel.FormAction = Url.Action("AddSubmit", "Comments");
                    viewModel.Comments.FK_MerchantID = base.CurrentUserModel.FK_MerchantID;
                    viewModel.Comments.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
                    break;

                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.UPDATE:
                    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
                    request.Body = CommentsID;
                    var response = XCLCMS.Lib.WebAPI.CommentsAPI.Detail(request);

                    viewModel.Comments = response.Body;
                    viewModel.FormAction = Url.Action("UpdateSubmit", "Comments");
                    break;
            }

            viewModel.RecordStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Comments.RecordState
            });

            viewModel.VerifyStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.VerifyStateEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Comments.VerifyState
            });

            viewModel.ObjectTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Comments.ObjectType
            });

            return View(viewModel);
        }

        /// <summary>
        /// 将表单值转为viewModel
        /// </summary>
        private XCLCMS.View.AdminWeb.Models.Comments.CommentsAddVM GetViewModel(FormCollection fm)
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Comments.CommentsAddVM();
            viewModel.Comments = new Data.Model.Comments();
            viewModel.Comments.FK_MerchantID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantID");
            viewModel.Comments.FK_MerchantAppID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantAppID");
            viewModel.Comments.CommentsID = XCLNetTools.StringHander.FormHelper.GetLong("CommentsID");
            viewModel.Comments.RecordState = fm["selRecordState"];
            viewModel.Comments.ObjectType = fm["selObjectType"];
            viewModel.Comments.FK_ObjectID = XCLNetTools.StringHander.FormHelper.GetLong("txtFK_ObjectID");
            viewModel.Comments.UserName = fm["txtUserName"];
            viewModel.Comments.Email = fm["txtEmail"];
            viewModel.Comments.ParentCommentID = XCLNetTools.StringHander.FormHelper.GetLong("txtParentCommentID");
            viewModel.Comments.Contents = fm["txtContents"];
            viewModel.Comments.Email = fm["txtEmail"];
            viewModel.Comments.GoodCount = XCLNetTools.StringHander.FormHelper.GetInt("txtGoodCount");
            viewModel.Comments.MiddleCount = XCLNetTools.StringHander.FormHelper.GetInt("txtMiddleCount");
            viewModel.Comments.BadCount = XCLNetTools.StringHander.FormHelper.GetInt("txtBadCount");
            viewModel.Comments.VerifyState = fm["selVerifyState"];
            viewModel.Comments.Remark = fm["txtRemark"];
            return viewModel;
        }

        /// <summary>
        /// 添加评论
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Comments_Add)]
        public override ActionResult AddSubmit(FormCollection fm)
        {
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();

            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.Comments();
            model.CommentsID = XCLCMS.Lib.WebAPI.Library.CommonAPI_GenerateID(base.UserToken, new Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity()
            {
                IDType = Data.CommonHelper.EnumType.IDTypeEnum.CMT.ToString()
            });
            model.RecordState = viewModel.Comments.RecordState;
            model.FK_MerchantAppID = viewModel.Comments.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.Comments.FK_MerchantID;
            model.BadCount = viewModel.Comments.BadCount;
            model.Contents = viewModel.Comments.Contents;
            model.Email = viewModel.Comments.Email;
            model.FK_ObjectID = viewModel.Comments.FK_ObjectID;
            model.GoodCount = viewModel.Comments.GoodCount;
            model.MiddleCount = viewModel.Comments.MiddleCount;
            model.ObjectType = viewModel.Comments.ObjectType;
            model.ParentCommentID = viewModel.Comments.ParentCommentID;
            model.Remark = viewModel.Comments.Remark;
            model.UserName = viewModel.Comments.UserName;
            model.VerifyState = viewModel.Comments.VerifyState;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Comments>(base.UserToken);
            request.Body = new Data.Model.Comments();
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.CommentsAPI.Add(request);

            return Json(response);
        }

        /// <summary>
        /// 修改评论
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Comments_Edit)]
        public override ActionResult UpdateSubmit(FormCollection fm)
        {
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();

            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.Comments();
            model.CommentsID = viewModel.Comments.CommentsID;

            model.RecordState = viewModel.Comments.RecordState;
            model.FK_MerchantAppID = viewModel.Comments.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.Comments.FK_MerchantID;

            model.BadCount = viewModel.Comments.BadCount;
            model.Contents = viewModel.Comments.Contents;
            model.Email = viewModel.Comments.Email;
            model.FK_ObjectID = viewModel.Comments.FK_ObjectID;
            model.GoodCount = viewModel.Comments.GoodCount;
            model.MiddleCount = viewModel.Comments.MiddleCount;
            model.ObjectType = viewModel.Comments.ObjectType;
            model.ParentCommentID = viewModel.Comments.ParentCommentID;
            model.Remark = viewModel.Comments.Remark;
            model.UserName = viewModel.Comments.UserName;
            model.VerifyState = viewModel.Comments.VerifyState;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Comments>(base.UserToken);
            request.Body = new Data.Model.Comments();
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.CommentsAPI.Update(request);

            return Json(response);
        }
    }
}