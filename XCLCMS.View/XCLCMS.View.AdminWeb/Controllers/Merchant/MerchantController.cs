using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace XCLCMS.View.AdminWeb.Controllers.Merchant
{
    /// <summary>
    /// 商户信息controller
    /// </summary>
    public class MerchantController : BaseController
    {
        /// <summary>
        /// 商户信息列表首页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantView)]
        public ActionResult Index()
        {
            XCLCMS.View.AdminWeb.Models.Merchant.MerchantListVM viewModel = new XCLCMS.View.AdminWeb.Models.Merchant.MerchantListVM();

            #region 初始化查询条件

            viewModel.Search = new XCLNetSearch.Search();
            viewModel.Search.TypeList = new List<XCLNetSearch.SearchFieldInfo>() {
                new XCLNetSearch.SearchFieldInfo("商户ID","MerchantID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("商户名","MerchantName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("商户类型","FK_MerchantType|number|select",XCLCMS.Lib.Common.Comm.GetSysDicOptionsByCode("MerchantType")),
                new XCLNetSearch.SearchFieldInfo("商户系统类型","MerchantSystemType|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.MerchantSystemTypeEnum))),
                new XCLNetSearch.SearchFieldInfo("绑定的域名","Domain|string|text",""),
                new XCLNetSearch.SearchFieldInfo("联系人","ContactName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("手机","Tel|string|text",""),
                new XCLNetSearch.SearchFieldInfo("固话","Landline|string|text",""),
                new XCLNetSearch.SearchFieldInfo("电子邮件","Email|string|text",""),
                new XCLNetSearch.SearchFieldInfo("QQ","QQ|string|text",""),
                new XCLNetSearch.SearchFieldInfo("证件类型","FK_PassType|number|select",XCLCMS.Lib.Common.Comm.GetSysDicOptionsByCode("PassType")),
                new XCLNetSearch.SearchFieldInfo("证件号","PassNumber|string|text",""),
                new XCLNetSearch.SearchFieldInfo("地址","Address|string|text",""),
                new XCLNetSearch.SearchFieldInfo("其它联系信息","OtherContact|string|text",""),
                new XCLNetSearch.SearchFieldInfo("商户备注","MerchantRemark|string|text",""),
                new XCLNetSearch.SearchFieldInfo("注册时间","RegisterTime|dateTime|text",""),
                new XCLNetSearch.SearchFieldInfo("商户状态","MerchantState|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.MerchantStateEnum))),

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
            var response = XCLCMS.Lib.WebAPI.MerchantAPI.PageList(request).Body;
            viewModel.MerchantList = response.ResultList;
            viewModel.PagerModel = response.PagerInfo;

            return View("~/Views/Merchant/MerchantList.cshtml", viewModel);
        }

        /// <summary>
        /// 添加与编辑商户页面首页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantAdd)]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantEdit)]
        public ActionResult Add()
        {
            long merchantId = XCLNetTools.StringHander.FormHelper.GetLong("merchantId");
            
            XCLCMS.View.AdminWeb.Models.Merchant.MerchantAddVM viewModel = new XCLCMS.View.AdminWeb.Models.Merchant.MerchantAddVM();
            viewModel.Merchant = new XCLCMS.Data.Model.Merchant();

            var merchantTypeDic = XCLCMS.Lib.WebAPI.Library.MerchantAPI_GetMerchantTypeDic(base.UserToken);
            var passTypeDic = XCLCMS.Lib.WebAPI.Library.SysDicAPI_GetPassTypeDic(base.UserToken);

            switch (base.CurrentHandleType)
            {
                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD:
                    viewModel.Merchant = new Data.Model.Merchant();
                    viewModel.Merchant.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
                    viewModel.MerchantTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(merchantTypeDic, new XCLNetTools.Entity.SetOptionEntity()
                    {
                        IsNeedPleaseSelect = true
                    });
                    viewModel.PassTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(passTypeDic, new XCLNetTools.Entity.SetOptionEntity()
                    {
                        IsNeedPleaseSelect = true
                    });
                    viewModel.MerchantSystemTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.MerchantSystemTypeEnum), new XCLNetTools.Entity.SetOptionEntity()
                    {
                        IsNeedPleaseSelect = false
                    });
                    viewModel.MerchantStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.MerchantStateEnum));
                    viewModel.FormAction = Url.Action("AddSubmit", "Merchant");
                    break;

                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.UPDATE:

                    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
                    request.Body = merchantId;
                    var response = XCLCMS.Lib.WebAPI.MerchantAPI.Detail(request);

                    viewModel.Merchant = response.Body;
                    viewModel.MerchantTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(merchantTypeDic, new XCLNetTools.Entity.SetOptionEntity()
                    {
                        DefaultValue = viewModel.Merchant.FK_MerchantType.ToString(),
                        IsNeedPleaseSelect = true
                    });
                    viewModel.PassTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(passTypeDic, new XCLNetTools.Entity.SetOptionEntity()
                    {
                        DefaultValue = viewModel.Merchant.FK_PassType.ToString(),
                        IsNeedPleaseSelect = true
                    });
                    viewModel.MerchantSystemTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.MerchantSystemTypeEnum), new XCLNetTools.Entity.SetOptionEntity()
                    {
                        DefaultValue = viewModel.Merchant.MerchantSystemType,
                        IsNeedPleaseSelect = false
                    });
                    viewModel.MerchantStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.MerchantStateEnum), new XCLNetTools.Entity.SetOptionEntity()
                    {
                        DefaultValue = viewModel.Merchant.MerchantState
                    });
                    viewModel.FormAction = Url.Action("UpdateSubmit", "Merchant");
                    break;
            }

            viewModel.RecordStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Merchant.RecordState
            });

            return View("~/Views/Merchant/MerchantAdd.cshtml", viewModel);
        }

        /// <summary>
        /// 将表单值转为viewModel
        /// </summary>
        private XCLCMS.View.AdminWeb.Models.Merchant.MerchantAddVM GetViewModel(FormCollection fm)
        {
            XCLCMS.View.AdminWeb.Models.Merchant.MerchantAddVM viewModel = new XCLCMS.View.AdminWeb.Models.Merchant.MerchantAddVM();
            viewModel.Merchant = new Data.Model.Merchant();
            viewModel.Merchant.Address = (fm["txtAddress"] ?? "").Trim();
            viewModel.Merchant.ContactName = (fm["txtContactName"] ?? "").Trim();
            viewModel.Merchant.Domain = (fm["txtDomain"] ?? "").Trim();
            viewModel.Merchant.Email = (fm["txtEmail"] ?? "").Trim();
            viewModel.Merchant.Landline = (fm["txtLandline"] ?? "").Trim();
            viewModel.Merchant.LogoURL = (fm["txtLogoURL"] ?? "").Trim();
            viewModel.Merchant.MerchantName = (fm["txtMerchantName"] ?? "").Trim();
            viewModel.Merchant.MerchantRemark = (fm["txtMerchantRemark"] ?? "").Trim();
            viewModel.Merchant.MerchantState = (fm["selMerchantState"] ?? "").Trim();
            viewModel.Merchant.FK_MerchantType = XCLNetTools.StringHander.FormHelper.GetLong("selMerchantType");
            viewModel.Merchant.OtherContact = (fm["txtOtherContact"] ?? "").Trim();
            viewModel.Merchant.PassNumber = (fm["txtPassNumber"] ?? "").Trim();
            viewModel.Merchant.FK_PassType = XCLNetTools.StringHander.FormHelper.GetLong("selPassType");
            viewModel.Merchant.QQ = (fm["txtQQ"] ?? "").Trim();
            viewModel.Merchant.RegisterTime = XCLNetTools.Common.DataTypeConvert.ToDateTimeNull((fm["txtRegisterTime"] ?? "").Trim());
            viewModel.Merchant.Remark = (fm["txtRemark"] ?? "").Trim();
            viewModel.Merchant.Tel = (fm["txtTel"] ?? "").Trim();
            viewModel.Merchant.MerchantSystemType = fm["selMerchantSystemType"];
            viewModel.Merchant.RecordState = fm["selRecordState"];
            return viewModel;
        }

        /// <summary>
        /// 添加商户信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantAdd)]
        public override ActionResult AddSubmit(FormCollection fm)
        {
            XCLCMS.View.AdminWeb.Models.Merchant.MerchantAddVM viewModel = this.GetViewModel(fm);
            XCLCMS.Data.Model.Merchant model = new XCLCMS.Data.Model.Merchant();
            model.MerchantID = XCLCMS.Lib.WebAPI.Library.CommonAPI_GenerateID(base.UserToken, new Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity()
            {
                IDType = Data.CommonHelper.EnumType.IDTypeEnum.MER.ToString()
            }); 
            model.Address = viewModel.Merchant.Address;
            model.ContactName = viewModel.Merchant.ContactName;
            model.Domain = viewModel.Merchant.Domain;
            model.Email = viewModel.Merchant.Email;
            model.Landline = viewModel.Merchant.Landline;
            model.LogoURL = viewModel.Merchant.LogoURL;
            model.MerchantName = viewModel.Merchant.MerchantName;
            model.MerchantRemark = viewModel.Merchant.MerchantRemark;
            model.MerchantState = viewModel.Merchant.MerchantState;
            model.FK_MerchantType = viewModel.Merchant.FK_MerchantType;
            model.OtherContact = viewModel.Merchant.OtherContact;
            model.PassNumber = viewModel.Merchant.PassNumber;
            model.FK_PassType = viewModel.Merchant.FK_PassType;
            model.QQ = viewModel.Merchant.QQ;
            model.RecordState = viewModel.Merchant.RecordState;
            model.RegisterTime = viewModel.Merchant.RegisterTime;
            model.Remark = viewModel.Merchant.Remark;
            model.Tel = viewModel.Merchant.Tel;
            model.MerchantSystemType = viewModel.Merchant.MerchantSystemType;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Merchant>(base.UserToken);
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.MerchantAPI.Add(request);

            return Json(response);
        }

        /// <summary>
        /// 更新商户信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantEdit)]
        public override ActionResult UpdateSubmit(FormCollection fm)
        {
            base.UpdateSubmit(fm);
            XCLCMS.View.AdminWeb.Models.Merchant.MerchantAddVM viewModel = this.GetViewModel(fm);

            var model = new XCLCMS.Data.Model.Merchant();
            model.MerchantID = XCLNetTools.StringHander.FormHelper.GetLong("merchantId");
            model.Address = viewModel.Merchant.Address;
            model.ContactName = viewModel.Merchant.ContactName;
            model.Domain = viewModel.Merchant.Domain;
            model.Email = viewModel.Merchant.Email;
            model.Landline = viewModel.Merchant.Landline;
            model.LogoURL = viewModel.Merchant.LogoURL;
            model.MerchantName = viewModel.Merchant.MerchantName;
            model.MerchantRemark = viewModel.Merchant.MerchantRemark;
            model.MerchantState = viewModel.Merchant.MerchantState;
            model.FK_MerchantType = viewModel.Merchant.FK_MerchantType;
            model.OtherContact = viewModel.Merchant.OtherContact;
            model.PassNumber = viewModel.Merchant.PassNumber;
            model.FK_PassType = viewModel.Merchant.FK_PassType;
            model.QQ = viewModel.Merchant.QQ;
            model.RegisterTime = viewModel.Merchant.RegisterTime;
            model.Remark = viewModel.Merchant.Remark;
            model.Tel = viewModel.Merchant.Tel;
            model.MerchantSystemType = viewModel.Merchant.MerchantSystemType;
            model.RecordState = viewModel.Merchant.RecordState;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Merchant>(base.UserToken);
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.MerchantAPI.Update(request);

            return Json(response);
        }
    }
}