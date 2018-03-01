using System.Collections.Generic;
using System.Web.Mvc;

namespace XCLCMS.View.AdminWeb.Controllers.Product
{
    public class ProductController : BaseController
    {
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Product_View)]
        public ActionResult Index()
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Product.ProductListVM();

            #region 初始化查询条件

            viewModel.Search = new XCLNetSearch.Search();
            viewModel.Search.TypeList = new List<XCLNetSearch.SearchFieldInfo>() {
                new XCLNetSearch.SearchFieldInfo("产品ID","ProductID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户ID","FK_MerchantID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用ID","FK_MerchantAppID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户名","MerchantName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用名","MerchantAppName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("产品名称","ProductName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("售价","Price|number|text",""),
                new XCLNetSearch.SearchFieldInfo("产品描述","Description|string|text",""),
                new XCLNetSearch.SearchFieldInfo("销售方式","SaleType|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.SaleTypeEnum))),
                new XCLNetSearch.SearchFieldInfo("销售标题","SaleTitle|string|text",""),
                new XCLNetSearch.SearchFieldInfo("购买成功后处理方式","PayedActionType|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.PayedActionTypeEnum))),
                new XCLNetSearch.SearchFieldInfo("购买成功后展示内容","PayedRemark|string|text",""),
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
            var response = XCLCMS.Lib.WebAPI.ProductAPI.PageList(request).Body;
            viewModel.ProductList = response.ResultList;
            viewModel.PagerModel = response.PagerInfo;

            return View(viewModel);
        }

        /// <summary>
        /// 添加与编辑页面首页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Product_Add)]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Product_Edit)]
        public ActionResult Add()
        {
            long ProductID = XCLNetTools.StringHander.FormHelper.GetLong("ProductID");

            var viewModel = new Models.Product.ProductAddVM();

            switch (base.CurrentHandleType)
            {
                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD:
                    viewModel.Product = new Data.Model.View.v_Product();
                    viewModel.FormAction = Url.Action("AddSubmit", "Product");
                    viewModel.Product.FK_MerchantID = base.CurrentUserModel.FK_MerchantID;
                    viewModel.Product.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
                    viewModel.Product.PayedActionType = XCLCMS.Data.CommonHelper.EnumType.PayedActionTypeEnum.NON.ToString();
                    viewModel.Product.SaleType = XCLCMS.Data.CommonHelper.EnumType.SaleTypeEnum.FRE.ToString();
                    break;

                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.UPDATE:
                    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
                    request.Body = ProductID;
                    var response = XCLCMS.Lib.WebAPI.ProductAPI.Detail(request);

                    viewModel.Product = response.Body;
                    viewModel.FormAction = Url.Action("UpdateSubmit", "Product");
                    break;
            }

            viewModel.RecordStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Product.RecordState
            });

            viewModel.SaleTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.SaleTypeEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Product.SaleType
            });

            viewModel.PayedActionTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.PayedActionTypeEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.Product.PayedActionType
            });

            ViewBag.IsNeedCKEditor = true;

            return View(viewModel);
        }

        /// <summary>
        /// 查看页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Product_View)]
        public ActionResult Show()
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Product.ProductShowVM();
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
            request.Body = XCLNetTools.StringHander.FormHelper.GetLong("ProductID");
            var response = XCLCMS.Lib.WebAPI.ProductAPI.Detail(request);
            viewModel.Product = response.Body ?? new Data.Model.View.v_Product();
            return View(viewModel);
        }

        /// <summary>
        /// 将表单值转为viewModel
        /// </summary>
        private XCLCMS.View.AdminWeb.Models.Product.ProductAddVM GetViewModel(FormCollection fm)
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.Product.ProductAddVM();
            viewModel.Product = new Data.Model.View.v_Product();
            viewModel.Product.FK_MerchantID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantID");
            viewModel.Product.FK_MerchantAppID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantAppID");
            viewModel.Product.ProductID = XCLNetTools.StringHander.FormHelper.GetLong("ProductID");
            viewModel.Product.RecordState = fm["selRecordState"];
            viewModel.Product.Remark = fm["txtRemark"];
            viewModel.Product.Description = fm["txtDescription"];
            viewModel.Product.Price = XCLNetTools.StringHander.FormHelper.GetDecimal("txtPrice");
            viewModel.Product.ProductName = fm["txtProductName"];
            viewModel.Product.PayedActionType = fm["selPayedActionType"];
            viewModel.Product.PayedRemark = fm["txtPayedRemark"];
            viewModel.Product.SaleTitle = fm["txtSaleTitle"];
            viewModel.Product.SaleType = fm["selSaleType"];
            return viewModel;
        }

        /// <summary>
        /// 添加
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Product_Add)]
        public override ActionResult AddSubmit(FormCollection fm)
        {
            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.Product();
            model.ProductID = XCLCMS.Lib.Common.FastAPI.CommonAPI_GenerateID(base.UserToken, new Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity()
            {
                IDType = Data.CommonHelper.EnumType.IDTypeEnum.PRD.ToString()
            });
            model.RecordState = viewModel.Product.RecordState;
            model.FK_MerchantAppID = viewModel.Product.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.Product.FK_MerchantID;
            model.Remark = viewModel.Product.Remark;
            model.Description = viewModel.Product.Description;
            model.Price = viewModel.Product.Price;
            model.ProductName = viewModel.Product.ProductName;
            model.PayedActionType = viewModel.Product.PayedActionType;
            model.PayedRemark = viewModel.Product.PayedRemark;
            model.SaleTitle = viewModel.Product.SaleTitle;
            model.SaleType = viewModel.Product.SaleType;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Product>(base.UserToken);
            request.Body = new Data.Model.Product();
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.ProductAPI.Add(request);

            return Json(response);
        }

        /// <summary>
        /// 修改
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Product_Edit)]
        public override ActionResult UpdateSubmit(FormCollection fm)
        {
            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.Product();
            model.ProductID = viewModel.Product.ProductID;

            model.RecordState = viewModel.Product.RecordState;
            model.FK_MerchantAppID = viewModel.Product.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.Product.FK_MerchantID;
            model.Remark = viewModel.Product.Remark;
            model.Description = viewModel.Product.Description;
            model.Price = viewModel.Product.Price;
            model.ProductName = viewModel.Product.ProductName;
            model.PayedActionType = viewModel.Product.PayedActionType;
            model.PayedRemark = viewModel.Product.PayedRemark;
            model.SaleTitle = viewModel.Product.SaleTitle;
            model.SaleType = viewModel.Product.SaleType;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Product>(base.UserToken);
            request.Body = new Data.Model.Product();
            request.Body = model;
            var response = XCLCMS.Lib.WebAPI.ProductAPI.Update(request);

            return Json(response);
        }
    }
}