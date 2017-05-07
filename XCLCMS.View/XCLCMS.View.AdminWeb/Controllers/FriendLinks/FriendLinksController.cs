using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace XCLCMS.View.AdminWeb.Controllers.FriendLinks
{
    /// <summary>
    /// 友情链接 controller
    /// </summary>
    public class FriendLinksController : BaseController
    {
        /// <summary>
        /// 友情链接列表
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FriendLinks_View)]
        public ActionResult Index()
        {
            XCLCMS.View.AdminWeb.Models.FriendLinks.FriendLinksListVM viewModel = new XCLCMS.View.AdminWeb.Models.FriendLinks.FriendLinksListVM();

            #region 初始化查询条件

            viewModel.Search = new XCLNetSearch.Search();
            viewModel.Search.TypeList = new List<XCLNetSearch.SearchFieldInfo>() {
                new XCLNetSearch.SearchFieldInfo("友链ID","FriendLinkID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户ID","FK_MerchantID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用ID","FK_MerchantAppID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户名","MerchantName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用名","MerchantAppName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("标题","Title|string|text",""),
                new XCLNetSearch.SearchFieldInfo("描述","Description|string|text",""),
                new XCLNetSearch.SearchFieldInfo("链接地址","URL|string|text",""),
                new XCLNetSearch.SearchFieldInfo("联系人名","ContactName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("电子邮件","Email|string|text",""),
                new XCLNetSearch.SearchFieldInfo("QQ","QQ|string|text",""),
                new XCLNetSearch.SearchFieldInfo("手机号","Tel|string|text",""),
                new XCLNetSearch.SearchFieldInfo("其它联系方式","OtherContact|string|text",""),
                new XCLNetSearch.SearchFieldInfo("说明","Remark|string|text",""),
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
            var response = XCLCMS.Lib.WebAPI.FriendLinksAPI.PageList(request).Body;
            viewModel.FriendLinksList = response.ResultList;
            viewModel.PagerModel = response.PagerInfo;

            return View(viewModel);
        }

        /// <summary>
        /// 添加与编辑页面首页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FriendLinks_Add)]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FriendLinks_Edit)]
        public ActionResult Add()
        {
            long friendLinkID = XCLNetTools.StringHander.FormHelper.GetLong("FriendLinkID");

            var viewModel = new Models.FriendLinks.FriendLinksAddVM();

            switch (base.CurrentHandleType)
            {
                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD:
                    viewModel.FriendLinks = new Data.Model.FriendLinks();
                    viewModel.FormAction = Url.Action("AddSubmit", "FriendLinks");
                    viewModel.FriendLinks.FK_MerchantID = base.CurrentUserModel.FK_MerchantID;
                    viewModel.FriendLinks.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
                    break;

                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.UPDATE:
                    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
                    request.Body = friendLinkID;
                    var response = XCLCMS.Lib.WebAPI.FriendLinksAPI.Detail(request);

                    viewModel.FriendLinks = response.Body;
                    viewModel.FormAction = Url.Action("UpdateSubmit", "FriendLinks");
                    break;
            }

            viewModel.RecordStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.FriendLinks.RecordState
            });

            return View(viewModel);
        }

        /// <summary>
        /// 将表单值转为viewModel
        /// </summary>
        private XCLCMS.View.AdminWeb.Models.FriendLinks.FriendLinksAddVM GetViewModel(FormCollection fm)
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.FriendLinks.FriendLinksAddVM();
            viewModel.FriendLinks = new Data.Model.FriendLinks();
            viewModel.FriendLinks.ContactName = fm["txtContactName"];
            viewModel.FriendLinks.Description = fm["txtDescription"];
            viewModel.FriendLinks.Email = fm["txtEmail"];
            viewModel.FriendLinks.FK_MerchantID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantID");
            viewModel.FriendLinks.FK_MerchantAppID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantAppID");
            viewModel.FriendLinks.FriendLinkID = XCLNetTools.StringHander.FormHelper.GetLong("FriendLinkID");
            viewModel.FriendLinks.OtherContact = fm["txtOtherContact"];
            viewModel.FriendLinks.QQ = fm["txtQQ"];
            viewModel.FriendLinks.RecordState = fm["selRecordState"];
            viewModel.FriendLinks.Remark = fm["txtRemark"];
            viewModel.FriendLinks.Tel = fm["txtTel"];
            viewModel.FriendLinks.Title = fm["txtTitle"];
            viewModel.FriendLinks.URL = fm["txtURL"];
            return viewModel;
        }

        /// <summary>
        /// 添加友情链接
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FriendLinks_Add)]
        public override ActionResult AddSubmit(FormCollection fm)
        {
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();

            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.FriendLinks();
            model.FriendLinkID = XCLCMS.Lib.WebAPI.Library.CommonAPI_GenerateID(base.UserToken, new Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity()
            {
                IDType = Data.CommonHelper.EnumType.IDTypeEnum.LIK.ToString()
            });
            model.RecordState = viewModel.FriendLinks.RecordState;
            model.Title = viewModel.FriendLinks.Title;
            model.FK_MerchantAppID = viewModel.FriendLinks.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.FriendLinks.FK_MerchantID;
            model.ContactName = viewModel.FriendLinks.ContactName;
            model.Description = viewModel.FriendLinks.Description;
            model.Email = viewModel.FriendLinks.Email;
            model.OtherContact = viewModel.FriendLinks.OtherContact;
            model.QQ = viewModel.FriendLinks.QQ;
            model.Remark = viewModel.FriendLinks.Remark;
            model.Tel = viewModel.FriendLinks.Tel;
            model.URL = viewModel.FriendLinks.URL;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.FriendLinks>(base.UserToken);
            request.Body = new Data.Model.FriendLinks();
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.FriendLinksAPI.Add(request);

            return Json(response);
        }

        /// <summary>
        /// 修改友情链接
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FriendLinks_Edit)]
        public override ActionResult UpdateSubmit(FormCollection fm)
        {
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();

            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.FriendLinks();
            model.FriendLinkID = viewModel.FriendLinks.FriendLinkID;

            model.RecordState = viewModel.FriendLinks.RecordState;
            model.Title = viewModel.FriendLinks.Title;
            model.FK_MerchantAppID = viewModel.FriendLinks.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.FriendLinks.FK_MerchantID;
            model.ContactName = viewModel.FriendLinks.ContactName;
            model.Description = viewModel.FriendLinks.Description;
            model.Email = viewModel.FriendLinks.Email;
            model.OtherContact = viewModel.FriendLinks.OtherContact;
            model.QQ = viewModel.FriendLinks.QQ;
            model.Remark = viewModel.FriendLinks.Remark;
            model.Tel = viewModel.FriendLinks.Tel;
            model.URL = viewModel.FriendLinks.URL;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.FriendLinks>(base.UserToken);
            request.Body = new Data.Model.FriendLinks();
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.FriendLinksAPI.Update(request);

            return Json(response);
        }
    }
}