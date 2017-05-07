using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace XCLCMS.View.AdminWeb.Controllers.Merchant
{
    /// <summary>
    /// 商户应用信息Controller
    /// </summary>
    public class MerchantAppController : BaseController
    {
        /// <summary>
        /// 商户应用信息列表
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantAppView)]
        public ActionResult Index()
        {
            XCLCMS.View.AdminWeb.Models.Merchant.MerchantAppListVM viewModel = new XCLCMS.View.AdminWeb.Models.Merchant.MerchantAppListVM();

            #region 初始化查询条件

            viewModel.Search = new XCLNetSearch.Search();
            viewModel.Search.TypeList = new List<XCLNetSearch.SearchFieldInfo>() {
                new XCLNetSearch.SearchFieldInfo("商户应用ID","MerchantAppID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("商户应用Key","AppKey|string|text",""),
                new XCLNetSearch.SearchFieldInfo("商户应用名","MerchantAppName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户ID","FK_MerchantID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户名","MerchantName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("静态资源版本号","ResourceVersion|string|text",""),
                new XCLNetSearch.SearchFieldInfo("联系人邮箱","Email|string|text",""),
                new XCLNetSearch.SearchFieldInfo("版权信息","CopyRight|string|text",""),
                new XCLNetSearch.SearchFieldInfo("Meta描述","MetaDescription|string|text",""),
                new XCLNetSearch.SearchFieldInfo("Meta关键字","MetaKeyWords|string|text",""),
                new XCLNetSearch.SearchFieldInfo("Meta标题","MetaTitle|string|text",""),
                new XCLNetSearch.SearchFieldInfo("站点网址","WebURL|string|text",""),
                new XCLNetSearch.SearchFieldInfo("备注","Remark|string|text",""),
                new XCLNetSearch.SearchFieldInfo("记录状态","RecordState|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum))),
                new XCLNetSearch.SearchFieldInfo("创建时间","CreateTime|dateTime|text",""),
                new XCLNetSearch.SearchFieldInfo("创建者名","CreaterName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("更新时间","UpdateTime|dateTime|text",""),
                new XCLNetSearch.SearchFieldInfo("更新人名","UpdaterName|string|text","")
            };
            string strWhere =  viewModel.Search.StrSQL;

            #endregion 初始化查询条件

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.PageListConditionEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.PageListConditionEntity()
            {
                PagerInfoSimple = base.PageParamsInfo.ToPagerInfoSimple(),
                Where = strWhere
            };
            var response = XCLCMS.Lib.WebAPI.MerchantAppAPI.PageList(request).Body;
            viewModel.MerchantAppList = response.ResultList;
            viewModel.PagerModel = response.PagerInfo;

            return View("~/Views/Merchant/MerchantAppList.cshtml", viewModel);
        }

        /// <summary>
        /// 添加与编辑商户应用页面首页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantAppAdd)]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantAppEdit)]
        public ActionResult Add()
        {
            long merchantAppId = XCLNetTools.StringHander.FormHelper.GetLong("merchantAppId");
            
            var viewModel = new XCLCMS.View.AdminWeb.Models.Merchant.MerchantAppAddVM();
            viewModel.MerchantApp = new Data.Model.MerchantApp();

            switch (base.CurrentHandleType)
            {
                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD:
                    viewModel.MerchantApp = new Data.Model.MerchantApp();
                    viewModel.MerchantApp.FK_MerchantID = base.CurrentUserMerchant.MerchantID;
                    viewModel.MerchantApp.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
                    viewModel.MerchantApp.AppKey = Guid.NewGuid().ToString("N").ToUpper();
                    viewModel.FormAction = Url.Action("AddSubmit", "MerchantApp");
                    break;

                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.UPDATE:
                    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
                    request.Body = merchantAppId;
                    var response = XCLCMS.Lib.WebAPI.MerchantAppAPI.Detail(request);

                    viewModel.MerchantApp = response.Body;
                    viewModel.FormAction = Url.Action("UpdateSubmit", "MerchantApp");
                    break;
            }

            viewModel.RecordStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.MerchantApp.RecordState
            });

            return View("~/Views/Merchant/MerchantAppAdd.cshtml", viewModel);
        }

        /// <summary>
        /// 将表单值转为viewModel
        /// </summary>
        private XCLCMS.View.AdminWeb.Models.Merchant.MerchantAppAddVM GetViewModel(FormCollection fm)
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Merchant.MerchantAppAddVM();
            viewModel.MerchantApp = new Data.Model.MerchantApp();
            viewModel.MerchantApp.FK_MerchantID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantID");
            viewModel.MerchantApp.MerchantAppID = XCLNetTools.StringHander.FormHelper.GetLong("MerchantAppID");
            viewModel.MerchantApp.MerchantAppName = XCLNetTools.StringHander.FormHelper.GetString("txtMerchantAppName");
            viewModel.MerchantApp.Remark = XCLNetTools.StringHander.FormHelper.GetString("txtRemark");
            viewModel.MerchantApp.ResourceVersion = XCLNetTools.StringHander.FormHelper.GetString("txtResourceVersion");
            viewModel.MerchantApp.Email = XCLNetTools.StringHander.FormHelper.GetString("txtEmail");
            viewModel.MerchantApp.CopyRight = XCLNetTools.StringHander.FormHelper.GetString("txtCopyRight");
            viewModel.MerchantApp.MetaDescription = XCLNetTools.StringHander.FormHelper.GetString("txtMetaDescription");
            viewModel.MerchantApp.MetaKeyWords = XCLNetTools.StringHander.FormHelper.GetString("txtMetaKeyWords");
            viewModel.MerchantApp.MetaTitle = XCLNetTools.StringHander.FormHelper.GetString("txtMetaTitle");
            viewModel.MerchantApp.WebURL = XCLNetTools.StringHander.FormHelper.GetString("txtWebURL");
            viewModel.MerchantApp.RecordState = XCLNetTools.StringHander.FormHelper.GetString("selRecordState");
            viewModel.MerchantApp.AppKey = XCLNetTools.StringHander.FormHelper.GetString("txtAppKey");
            return viewModel;
        }

        /// <summary>
        /// 添加商户应用信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantAppAdd)]
        public override ActionResult AddSubmit(FormCollection fm)
        {
            var viewModel = this.GetViewModel(fm);
            XCLCMS.Data.Model.MerchantApp model = new XCLCMS.Data.Model.MerchantApp();
            model.MerchantAppID = XCLCMS.Lib.WebAPI.Library.CommonAPI_GenerateID(base.UserToken, new Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity()
            {
                IDType = Data.CommonHelper.EnumType.IDTypeEnum.MEP.ToString()
            });
            model.FK_MerchantID = viewModel.MerchantApp.FK_MerchantID;
            model.MerchantAppName = viewModel.MerchantApp.MerchantAppName;
            model.RecordState = viewModel.MerchantApp.RecordState;
            model.Remark = viewModel.MerchantApp.Remark;
            model.ResourceVersion = viewModel.MerchantApp.ResourceVersion;
            model.Email = viewModel.MerchantApp.Email;
            model.CopyRight = viewModel.MerchantApp.CopyRight;
            model.MetaDescription = viewModel.MerchantApp.MetaDescription;
            model.MetaKeyWords = viewModel.MerchantApp.MetaKeyWords;
            model.MetaTitle = viewModel.MerchantApp.MetaTitle;
            model.WebURL = viewModel.MerchantApp.WebURL;
            model.AppKey = viewModel.MerchantApp.AppKey;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.MerchantApp>(base.UserToken);
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.MerchantAppAPI.Add(request);

            return Json(response);
        }

        /// <summary>
        /// 更新商户应用信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantAppEdit)]
        public override ActionResult UpdateSubmit(FormCollection fm)
        {
            base.UpdateSubmit(fm);
            long merchantAppId = XCLNetTools.StringHander.FormHelper.GetLong("merchantAppId");
            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.MerchantApp();
            model.MerchantAppID = viewModel.MerchantApp.MerchantAppID;
            model.FK_MerchantID = viewModel.MerchantApp.FK_MerchantID;
            model.MerchantAppName = viewModel.MerchantApp.MerchantAppName;
            model.Remark = viewModel.MerchantApp.Remark;
            model.ResourceVersion = viewModel.MerchantApp.ResourceVersion;
            model.Email = viewModel.MerchantApp.Email;
            model.CopyRight = viewModel.MerchantApp.CopyRight;
            model.MetaDescription = viewModel.MerchantApp.MetaDescription;
            model.MetaKeyWords = viewModel.MerchantApp.MetaKeyWords;
            model.MetaTitle = viewModel.MerchantApp.MetaTitle;
            model.WebURL = viewModel.MerchantApp.WebURL;
            model.RecordState = viewModel.MerchantApp.RecordState;
            model.AppKey = viewModel.MerchantApp.AppKey;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.MerchantApp>(base.UserToken);
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.MerchantAppAPI.Update(request);

            return Json(response);
        }
    }
}