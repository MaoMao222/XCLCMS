using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace XCLCMS.View.AdminWeb.Controllers.Tags
{
    /// <summary>
    /// 标签 Controller
    /// </summary>
    public class TagsController : BaseController
    {
        /// <summary>
        /// 标签列表
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Tags_View)]
        public ActionResult Index()
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Tags.TagsListVM();

            #region 初始化查询条件

            viewModel.Search = new XCLNetSearch.Search();
            viewModel.Search.TypeList = new List<XCLNetSearch.SearchFieldInfo>() {
                new XCLNetSearch.SearchFieldInfo("标签ID","TagsID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户ID","FK_MerchantID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用ID","FK_MerchantAppID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户名","MerchantName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用名","MerchantAppName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("标签名称","TagName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("描述","Description|string|text",""),
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
            var response = XCLCMS.Lib.WebAPI.TagsAPI.PageList(request).Body;
            viewModel.TagsList = response.ResultList;
            viewModel.PagerModel = response.PagerInfo;

            return View(viewModel);
        }

        /// <summary>
        /// 添加与编辑页面首页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Tags_Add)]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Tags_Edit)]
        public ActionResult Add()
        {
            long TagsID = XCLNetTools.StringHander.FormHelper.GetLong("TagsID");

            var viewModel = new Models.Tags.TagsAddVM();

            switch (base.CurrentHandleType)
            {
                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD:
                    viewModel.Tags = new Data.Model.Tags();
                    viewModel.FormAction = Url.Action("AddSubmit", "Tags");
                    viewModel.Tags.FK_MerchantID = base.CurrentUserModel.FK_MerchantID;
                    viewModel.Tags.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
                    break;

                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.UPDATE:
                    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
                    request.Body = TagsID;
                    var response = XCLCMS.Lib.WebAPI.TagsAPI.Detail(request);

                    viewModel.Tags = response.Body;
                    viewModel.FormAction = Url.Action("UpdateSubmit", "Tags");
                    break;
            }

            viewModel.RecordStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Tags.RecordState
            });

            return View(viewModel);
        }

        /// <summary>
        /// 将表单值转为viewModel
        /// </summary>
        private XCLCMS.View.AdminWeb.Models.Tags.TagsAddVM GetViewModel(FormCollection fm)
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Tags.TagsAddVM();
            viewModel.Tags = new Data.Model.Tags();
            viewModel.Tags.Description = fm["txtDescription"];
            viewModel.Tags.FK_MerchantID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantID");
            viewModel.Tags.FK_MerchantAppID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantAppID");
            viewModel.Tags.TagsID = XCLNetTools.StringHander.FormHelper.GetLong("TagsID");
            viewModel.Tags.RecordState = fm["selRecordState"];
            viewModel.Tags.TagName = fm["txtTagName"];
            return viewModel;
        }

        /// <summary>
        /// 添加标签
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Tags_Add)]
        public override ActionResult AddSubmit(FormCollection fm)
        {
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();

            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.Tags();
            model.TagsID = XCLCMS.Lib.WebAPI.Library.CommonAPI_GenerateID(base.UserToken, new Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity()
            {
                IDType = Data.CommonHelper.EnumType.IDTypeEnum.LIK.ToString()
            });
            model.RecordState = viewModel.Tags.RecordState;
            model.TagName = viewModel.Tags.TagName;
            model.FK_MerchantAppID = viewModel.Tags.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.Tags.FK_MerchantID;
            model.Description = viewModel.Tags.Description;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Tags>(base.UserToken);
            request.Body = new Data.Model.Tags();
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.TagsAPI.Add(request);

            return Json(response);
        }

        /// <summary>
        /// 修改标签
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Tags_Edit)]
        public override ActionResult UpdateSubmit(FormCollection fm)
        {
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();

            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.Tags();
            model.TagsID = viewModel.Tags.TagsID;

            model.RecordState = viewModel.Tags.RecordState;
            model.TagName = viewModel.Tags.TagName;
            model.FK_MerchantAppID = viewModel.Tags.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.Tags.FK_MerchantID;
            model.Description = viewModel.Tags.Description;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Tags>(base.UserToken);
            request.Body = new Data.Model.Tags();
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.TagsAPI.Update(request);

            return Json(response);
        }
    }
}