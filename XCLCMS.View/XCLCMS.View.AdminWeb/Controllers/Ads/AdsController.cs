using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace XCLCMS.View.AdminWeb.Controllers.Ads
{
    /// <summary>
    /// 广告位 Controller
    /// </summary>
    public class AdsController : BaseController
    {
        /// <summary>
        /// 广告位列表
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Ads_View)]
        public ActionResult Index()
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Ads.AdsListVM();

            #region 初始化查询条件

            viewModel.Search = new XCLNetSearch.Search();
            viewModel.Search.TypeList = new List<XCLNetSearch.SearchFieldInfo>() {
                new XCLNetSearch.SearchFieldInfo("广告位ID","AdsID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户ID","FK_MerchantID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用ID","FK_MerchantAppID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户名","MerchantName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用名","MerchantAppName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("唯一标识","Code|string|text",""),
                new XCLNetSearch.SearchFieldInfo("广告类型","AdsType|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.AdsTypeEnum))),
                new XCLNetSearch.SearchFieldInfo("广告标题","Title|string|text",""),
                new XCLNetSearch.SearchFieldInfo("广告内容","Contents|string|text",""),
                new XCLNetSearch.SearchFieldInfo("宽度","AdWidth|number|text",""),
                new XCLNetSearch.SearchFieldInfo("高度","AdHeight|number|text",""),
                new XCLNetSearch.SearchFieldInfo("链接地址","URL|string|text",""),
                new XCLNetSearch.SearchFieldInfo("打开方式","URLOpenType|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.URLOpenTypeEnum))),
                new XCLNetSearch.SearchFieldInfo("开始时间","StartTime|dateTime|text",""),
                new XCLNetSearch.SearchFieldInfo("结束时间","EndTime|dateTime|text",""),
                new XCLNetSearch.SearchFieldInfo("昵称","NickName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("电子邮件","Email|string|text",""),
                new XCLNetSearch.SearchFieldInfo("QQ","QQ|string|text",""),
                new XCLNetSearch.SearchFieldInfo("手机号","Tel|string|text",""),
                new XCLNetSearch.SearchFieldInfo("其它联系方式","OtherContact|string|text",""),
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
            var response = XCLCMS.Lib.WebAPI.AdsAPI.PageList(request).Body;
            viewModel.AdsList = response.ResultList;
            viewModel.PagerModel = response.PagerInfo;

            return View(viewModel);
        }

        /// <summary>
        /// 添加与编辑页面首页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Ads_Add)]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Ads_Edit)]
        public ActionResult Add()
        {
            long AdsID = XCLNetTools.StringHander.FormHelper.GetLong("AdsID");

            var viewModel = new Models.Ads.AdsAddVM();

            switch (base.CurrentHandleType)
            {
                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD:
                    viewModel.Ads = new Data.Model.Ads();
                    viewModel.FormAction = Url.Action("AddSubmit", "Ads");
                    viewModel.Ads.FK_MerchantID = base.CurrentUserModel.FK_MerchantID;
                    viewModel.Ads.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
                    break;

                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.UPDATE:
                    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
                    request.Body = AdsID;
                    var response = XCLCMS.Lib.WebAPI.AdsAPI.Detail(request);

                    viewModel.Ads = response.Body;
                    viewModel.FormAction = Url.Action("UpdateSubmit", "Ads");
                    break;
            }

            viewModel.RecordStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Ads.RecordState
            });

            viewModel.AdsTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.AdsTypeEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Ads.AdsType
            });

            viewModel.URLOpenTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.URLOpenTypeEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Ads.URLOpenType
            });

            return View(viewModel);
        }

        /// <summary>
        /// 将表单值转为viewModel
        /// </summary>
        private XCLCMS.View.AdminWeb.Models.Ads.AdsAddVM GetViewModel(FormCollection fm)
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Ads.AdsAddVM();
            viewModel.Ads = new Data.Model.Ads();
            viewModel.Ads.FK_MerchantID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantID");
            viewModel.Ads.FK_MerchantAppID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantAppID");
            viewModel.Ads.AdsID = XCLNetTools.StringHander.FormHelper.GetLong("AdsID");
            viewModel.Ads.RecordState = fm["selRecordState"];
            viewModel.Ads.AdHeight = XCLNetTools.StringHander.FormHelper.GetInt("txtAdHeight");
            viewModel.Ads.AdsType = fm["selAdsType"];
            viewModel.Ads.AdWidth = XCLNetTools.StringHander.FormHelper.GetInt("txtAdWidth");
            viewModel.Ads.Code = fm["txtCode"];
            viewModel.Ads.Contents = fm["txtContents"];
            viewModel.Ads.Email = fm["txtEmail"];
            viewModel.Ads.EndTime = XCLNetTools.StringHander.FormHelper.GetDateTimeNull("txtEndTime");
            viewModel.Ads.NickName = fm["txtNickName"];
            viewModel.Ads.OtherContact = fm["txtOtherContact"];
            viewModel.Ads.QQ = fm["txtQQ"];
            viewModel.Ads.Remark = fm["txtRemark"];
            viewModel.Ads.StartTime = XCLNetTools.StringHander.FormHelper.GetDateTimeNull("txtStartTime");
            viewModel.Ads.Tel = fm["txtTel"];
            viewModel.Ads.Title = fm["txtTitle"];
            viewModel.Ads.URL = fm["txtURL"];
            viewModel.Ads.URLOpenType = fm["selURLOpenType"];
            return viewModel;
        }

        /// <summary>
        /// 添加广告位
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Ads_Add)]
        public override ActionResult AddSubmit(FormCollection fm)
        {
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();

            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.Ads();
            model.AdsID = XCLCMS.Lib.WebAPI.Library.CommonAPI_GenerateID(base.UserToken, new Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity()
            {
                IDType = Data.CommonHelper.EnumType.IDTypeEnum.ADS.ToString()
            });
            model.RecordState = viewModel.Ads.RecordState;
            model.FK_MerchantAppID = viewModel.Ads.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.Ads.FK_MerchantID;
            model.AdHeight = viewModel.Ads.AdHeight;
            model.AdsType = viewModel.Ads.AdsType;
            model.AdWidth = viewModel.Ads.AdWidth;
            model.Code = viewModel.Ads.Code;
            model.Contents = viewModel.Ads.Contents;
            model.Email = viewModel.Ads.Email;
            model.EndTime = viewModel.Ads.EndTime;
            model.NickName = viewModel.Ads.NickName;
            model.OtherContact = viewModel.Ads.OtherContact;
            model.QQ = viewModel.Ads.QQ;
            model.Remark = viewModel.Ads.Remark;
            model.StartTime = viewModel.Ads.StartTime;
            model.Tel = viewModel.Ads.Tel;
            model.Title = viewModel.Ads.Title;
            model.URL = viewModel.Ads.URL;
            model.URLOpenType = viewModel.Ads.URLOpenType;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Ads>(base.UserToken);
            request.Body = new Data.Model.Ads();
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.AdsAPI.Add(request);

            return Json(response);
        }

        /// <summary>
        /// 修改广告位
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Ads_Edit)]
        public override ActionResult UpdateSubmit(FormCollection fm)
        {
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();

            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.Ads();
            model.AdsID = viewModel.Ads.AdsID;

            model.RecordState = viewModel.Ads.RecordState;
            model.FK_MerchantAppID = viewModel.Ads.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.Ads.FK_MerchantID;

            model.AdHeight = viewModel.Ads.AdHeight;
            model.AdsType = viewModel.Ads.AdsType;
            model.AdWidth = viewModel.Ads.AdWidth;
            model.Code = viewModel.Ads.Code;
            model.Contents = viewModel.Ads.Contents;
            model.Email = viewModel.Ads.Email;
            model.EndTime = viewModel.Ads.EndTime;
            model.NickName = viewModel.Ads.NickName;
            model.OtherContact = viewModel.Ads.OtherContact;
            model.QQ = viewModel.Ads.QQ;
            model.Remark = viewModel.Ads.Remark;
            model.StartTime = viewModel.Ads.StartTime;
            model.Tel = viewModel.Ads.Tel;
            model.Title = viewModel.Ads.Title;
            model.URL = viewModel.Ads.URL;
            model.URLOpenType = viewModel.Ads.URLOpenType;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Ads>(base.UserToken);
            request.Body = new Data.Model.Ads();
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.AdsAPI.Update(request);

            return Json(response);
        }
    }
}