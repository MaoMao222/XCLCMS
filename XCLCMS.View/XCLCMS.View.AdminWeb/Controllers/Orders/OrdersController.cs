using System.Collections.Generic;
using System.Web.Mvc;

namespace XCLCMS.View.AdminWeb.Controllers.Orders
{
    public class OrdersController : BaseController
    {
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Orders_View)]
        public ActionResult Index()
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Orders.OrdersListVM();

            #region 初始化查询条件

            viewModel.Search = new XCLNetSearch.Search();
            viewModel.Search.TypeList = new List<XCLNetSearch.SearchFieldInfo>() {
                new XCLNetSearch.SearchFieldInfo("订单ID","OrderID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户ID","FK_MerchantID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用ID","FK_MerchantAppID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户名","MerchantName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用名","MerchantAppName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("产品ID","FK_ProductID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("产品名称","ProductName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("产品售价","ProductPrice|number|text",""),
                new XCLNetSearch.SearchFieldInfo("产品描述","ProductDesc|string|text",""),
                new XCLNetSearch.SearchFieldInfo("所属用户ID","FK_UserID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属用户名","UserName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("订单价格","Price|number|text",""),
                new XCLNetSearch.SearchFieldInfo("支付状态","PayStatus|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.PayStatusEnum))),
                new XCLNetSearch.SearchFieldInfo("支付方式","PayType|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.PayTypeEnum))),
                new XCLNetSearch.SearchFieldInfo("流水状态","FlowStatus|number|text",""),
                new XCLNetSearch.SearchFieldInfo("成交时间","DealDoneTime|dateTime|text",""),
                new XCLNetSearch.SearchFieldInfo("联系人","ContactName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("电子邮件","Email|string|text",""),
                new XCLNetSearch.SearchFieldInfo("手机号","Mobile|string|text",""),
                new XCLNetSearch.SearchFieldInfo("其它联系方式","OtherContact|string|text",""),
                new XCLNetSearch.SearchFieldInfo("交易号","TransactionNO|string|text",""),
                new XCLNetSearch.SearchFieldInfo("备注","Remark|string|text",""),
                new XCLNetSearch.SearchFieldInfo("记录状态","RecordState|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum))),
                new XCLNetSearch.SearchFieldInfo("创建时间","CreateTime|dateTime|text",""),
                new XCLNetSearch.SearchFieldInfo("创建者名","CreaterName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("更新时间","UpdateTime|dateTime|text",""),
                new XCLNetSearch.SearchFieldInfo("更新人名","UpdaterName|string|text","")
            };
            string strWhere = viewModel.Search.StrSQL;

            if (!XCLCMS.Lib.Permission.PerHelper.HasPermission(base.UserID, Data.CommonHelper.Function.FunctionEnum.SysFun_DataFilter_ShowAllRecordState))
            {
                strWhere = XCLNetTools.DataBase.SQLLibrary.JoinWithAnd(new List<string>() {
                    strWhere,
                    "RecordState='N'"
                });
            }

            #endregion 初始化查询条件

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.PageListConditionEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.PageListConditionEntity()
            {
                PagerInfoSimple = base.PageParamsInfo.ToPagerInfoSimple(),
                Where = strWhere
            };
            var response = XCLCMS.Lib.WebAPI.OrdersAPI.PageList(request).Body;
            viewModel.OrdersList = response.ResultList;
            viewModel.PagerModel = response.PagerInfo;

            return View(viewModel);
        }

        /// <summary>
        /// 添加与编辑页面首页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Orders_Add)]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Orders_Edit)]
        public ActionResult Add()
        {
            long orderID = XCLNetTools.StringHander.FormHelper.GetLong("OrderID");

            var viewModel = new Models.Orders.OrdersAddVM();

            switch (base.CurrentHandleType)
            {
                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD:
                    viewModel.Orders = new Data.Model.View.v_Orders();
                    viewModel.FormAction = Url.Action("AddSubmit", "Orders");
                    viewModel.Orders.FK_MerchantID = base.CurrentUserModel.FK_MerchantID;
                    viewModel.Orders.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
                    viewModel.Orders.PayStatus = XCLCMS.Data.CommonHelper.EnumType.PayStatusEnum.WAT.ToString();
                    viewModel.Orders.PayType = XCLCMS.Data.CommonHelper.EnumType.PayTypeEnum.OTH.ToString();
                    break;

                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.UPDATE:
                    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
                    request.Body = orderID;
                    var response = XCLCMS.Lib.WebAPI.OrdersAPI.Detail(request);

                    viewModel.Orders = response.Body;
                    viewModel.FormAction = Url.Action("UpdateSubmit", "Orders");
                    break;
            }

            viewModel.RecordStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Orders.RecordState
            });

            viewModel.PayTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.PayTypeEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Orders.PayType
            });

            return View(viewModel);
        }

        /// <summary>
        /// 查看页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Orders_View)]
        public ActionResult Show()
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Orders.OrdersShowVM();
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
            request.Body = XCLNetTools.StringHander.FormHelper.GetLong("OrderID");
            var response = XCLCMS.Lib.WebAPI.OrdersAPI.Detail(request);
            viewModel.Orders = response.Body ?? new Data.Model.View.v_Orders();
            return View(viewModel);
        }

        /// <summary>
        /// 将表单值转为viewModel
        /// </summary>
        private XCLCMS.View.AdminWeb.Models.Orders.OrdersAddVM GetViewModel(FormCollection fm)
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Orders.OrdersAddVM();
            viewModel.Orders = new Data.Model.View.v_Orders();
            viewModel.Orders.FK_MerchantID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantID");
            viewModel.Orders.FK_MerchantAppID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantAppID");
            viewModel.Orders.OrderID = XCLNetTools.StringHander.FormHelper.GetLong("OrderID");
            viewModel.Orders.RecordState = fm["selRecordState"];
            viewModel.Orders.Remark = fm["txtRemark"];
            viewModel.Orders.Price = XCLNetTools.StringHander.FormHelper.GetDecimal("txtPrice");
            viewModel.Orders.FK_ProductID = XCLNetTools.StringHander.FormHelper.GetLong("txtFK_ProductID");
            viewModel.Orders.FK_UserID = XCLNetTools.StringHander.FormHelper.GetLong("txtFK_UserID");
            viewModel.Orders.UserName = fm["txtUserName"];
            viewModel.Orders.PayType = fm["selPayType"];
            viewModel.Orders.Version = XCLNetTools.StringHander.FormHelper.GetInt("txtOrderVersion");
            viewModel.Orders.ContactName = fm["txtContactName"];
            viewModel.Orders.Email = fm["txtEmail"];
            viewModel.Orders.Mobile = fm["txtMobile"];
            viewModel.Orders.OtherContact = fm["txtOtherContact"];
            return viewModel;
        }

        /// <summary>
        /// 添加
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Orders_Add)]
        public override ActionResult AddSubmit(FormCollection fm)
        {
            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.Orders();
            model.OrderID = XCLCMS.Lib.Common.FastAPI.CommonAPI_GenerateID(base.UserToken, new Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity()
            {
                IDType = Data.CommonHelper.EnumType.IDTypeEnum.ORD.ToString()
            });
            model.RecordState = viewModel.Orders.RecordState;
            model.FK_MerchantAppID = viewModel.Orders.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.Orders.FK_MerchantID;
            model.Remark = viewModel.Orders.Remark;
            model.Price = viewModel.Orders.Price;
            model.FK_ProductID = viewModel.Orders.FK_ProductID;
            model.FK_UserID = viewModel.Orders.FK_UserID;
            model.UserName = viewModel.Orders.UserName;
            model.PayType = viewModel.Orders.PayType;
            model.Version = viewModel.Orders.Version;
            model.ContactName = viewModel.Orders.ContactName;
            model.Email = viewModel.Orders.Email;
            model.Mobile = viewModel.Orders.Mobile;
            model.OtherContact = viewModel.Orders.OtherContact;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Orders>(base.UserToken);
            request.Body = new Data.Model.Orders();
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.OrdersAPI.Add(request);

            return Json(response);
        }

        /// <summary>
        /// 修改
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Orders_Edit)]
        public override ActionResult UpdateSubmit(FormCollection fm)
        {
            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.Orders();
            model.OrderID = viewModel.Orders.OrderID;

            model.RecordState = viewModel.Orders.RecordState;
            model.FK_MerchantAppID = viewModel.Orders.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.Orders.FK_MerchantID;
            model.Remark = viewModel.Orders.Remark;
            model.Price = viewModel.Orders.Price;
            model.PayType = viewModel.Orders.PayType;
            model.FK_UserID = viewModel.Orders.FK_UserID;
            model.UserName = viewModel.Orders.UserName;
            model.Version = viewModel.Orders.Version;
            model.ContactName = viewModel.Orders.ContactName;
            model.Email = viewModel.Orders.Email;
            model.Mobile = viewModel.Orders.Mobile;
            model.OtherContact = viewModel.Orders.OtherContact;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Orders>(base.UserToken);
            request.Body = new Data.Model.Orders();
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.OrdersAPI.Update(request);

            return Json(response);
        }
    }
}