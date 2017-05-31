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
                new XCLNetSearch.SearchFieldInfo("评论者","UserName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("电子邮件","Email|string|text",""),
                new XCLNetSearch.SearchFieldInfo("点【好】数","GoodCount|number|text",""),
                new XCLNetSearch.SearchFieldInfo("点【中】数","MiddleCount|number|text",""),
                new XCLNetSearch.SearchFieldInfo("点【差】数","BadCount|number|text",""),
                new XCLNetSearch.SearchFieldInfo("评论内容","Contents|string|text",""),
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

            return View(viewModel);
        }

        ///// <summary>
        ///// 将表单值转为viewModel
        ///// </summary>
        //private XCLCMS.View.AdminWeb.Models.Comments.CommentsAddVM GetViewModel(FormCollection fm)
        //{
        //    var viewModel = new XCLCMS.View.AdminWeb.Models.Comments.CommentsAddVM();
        //    viewModel.Comments = new Data.Model.Comments();
        //    viewModel.Comments.FK_MerchantID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantID");
        //    viewModel.Comments.FK_MerchantAppID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantAppID");
        //    viewModel.Comments.CommentsID = XCLNetTools.StringHander.FormHelper.GetLong("CommentsID");
        //    viewModel.Comments.RecordState = fm["selRecordState"];
        //    viewModel.Comments.AdHeight = XCLNetTools.StringHander.FormHelper.GetInt("txtAdHeight");
        //    viewModel.Comments.CommentsType = fm["selCommentsType"];
        //    viewModel.Comments.AdWidth = XCLNetTools.StringHander.FormHelper.GetInt("txtAdWidth");
        //    viewModel.Comments.Code = fm["txtCode"];
        //    viewModel.Comments.Contents = fm["txtContents"];
        //    viewModel.Comments.Email = fm["txtEmail"];
        //    viewModel.Comments.EndTime = XCLNetTools.StringHander.FormHelper.GetDateTimeNull("txtEndTime");
        //    viewModel.Comments.NickName = fm["txtNickName"];
        //    viewModel.Comments.OtherContact = fm["txtOtherContact"];
        //    viewModel.Comments.QQ = fm["txtQQ"];
        //    viewModel.Comments.Remark = fm["txtRemark"];
        //    viewModel.Comments.StartTime = XCLNetTools.StringHander.FormHelper.GetDateTimeNull("txtStartTime");
        //    viewModel.Comments.Tel = fm["txtTel"];
        //    viewModel.Comments.Title = fm["txtTitle"];
        //    viewModel.Comments.URL = fm["txtURL"];
        //    viewModel.Comments.URLOpenType = fm["selURLOpenType"];
        //    return viewModel;
        //}

        ///// <summary>
        ///// 添加评论
        ///// </summary>
        //[XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Comments_Add)]
        //public override ActionResult AddSubmit(FormCollection fm)
        //{
        //    XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();

        //    var viewModel = this.GetViewModel(fm);
        //    var model = new XCLCMS.Data.Model.Comments();
        //    model.CommentsID = XCLCMS.Lib.WebAPI.Library.CommonAPI_GenerateID(base.UserToken, new Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity()
        //    {
        //        IDType = Data.CommonHelper.EnumType.IDTypeEnum.Comments.ToString()
        //    });
        //    model.RecordState = viewModel.Comments.RecordState;
        //    model.FK_MerchantAppID = viewModel.Comments.FK_MerchantAppID;
        //    model.FK_MerchantID = viewModel.Comments.FK_MerchantID;
        //    model.AdHeight = viewModel.Comments.AdHeight;
        //    model.CommentsType = viewModel.Comments.CommentsType;
        //    model.AdWidth = viewModel.Comments.AdWidth;
        //    model.Code = viewModel.Comments.Code;
        //    model.Contents = viewModel.Comments.Contents;
        //    model.Email = viewModel.Comments.Email;
        //    model.EndTime = viewModel.Comments.EndTime;
        //    model.NickName = viewModel.Comments.NickName;
        //    model.OtherContact = viewModel.Comments.OtherContact;
        //    model.QQ = viewModel.Comments.QQ;
        //    model.Remark = viewModel.Comments.Remark;
        //    model.StartTime = viewModel.Comments.StartTime;
        //    model.Tel = viewModel.Comments.Tel;
        //    model.Title = viewModel.Comments.Title;
        //    model.URL = viewModel.Comments.URL;
        //    model.URLOpenType = viewModel.Comments.URLOpenType;

        //    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Comments>(base.UserToken);
        //    request.Body = new Data.Model.Comments();
        //    request.Body = model;
        //    var response = XCLCMS.Lib.WebAPI.CommentsAPI.Add(request);

        //    return Json(response);
        //}

        ///// <summary>
        ///// 修改评论
        ///// </summary>
        //[XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Comments_Edit)]
        //public override ActionResult UpdateSubmit(FormCollection fm)
        //{
        //    XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();

        //    var viewModel = this.GetViewModel(fm);
        //    var model = new XCLCMS.Data.Model.Comments();
        //    model.CommentsID = viewModel.Comments.CommentsID;

        //    model.RecordState = viewModel.Comments.RecordState;
        //    model.FK_MerchantAppID = viewModel.Comments.FK_MerchantAppID;
        //    model.FK_MerchantID = viewModel.Comments.FK_MerchantID;

        //    model.AdHeight = viewModel.Comments.AdHeight;
        //    model.CommentsType = viewModel.Comments.CommentsType;
        //    model.AdWidth = viewModel.Comments.AdWidth;
        //    model.Code = viewModel.Comments.Code;
        //    model.Contents = viewModel.Comments.Contents;
        //    model.Email = viewModel.Comments.Email;
        //    model.EndTime = viewModel.Comments.EndTime;
        //    model.NickName = viewModel.Comments.NickName;
        //    model.OtherContact = viewModel.Comments.OtherContact;
        //    model.QQ = viewModel.Comments.QQ;
        //    model.Remark = viewModel.Comments.Remark;
        //    model.StartTime = viewModel.Comments.StartTime;
        //    model.Tel = viewModel.Comments.Tel;
        //    model.Title = viewModel.Comments.Title;
        //    model.URL = viewModel.Comments.URL;
        //    model.URLOpenType = viewModel.Comments.URLOpenType;

        //    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Comments>(base.UserToken);
        //    request.Body = new Data.Model.Comments();
        //    request.Body = model;
        //    var response = XCLCMS.Lib.WebAPI.CommentsAPI.Update(request);

        //    return Json(response);
        //}
    }
}