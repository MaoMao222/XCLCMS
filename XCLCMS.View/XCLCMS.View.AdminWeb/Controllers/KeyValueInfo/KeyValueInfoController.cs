using System.Collections.Generic;
using System.Web.Mvc;

namespace XCLCMS.View.AdminWeb.Controllers.KeyValueInfo
{
    public class KeyValueInfoController : BaseController
    {
        /// <summary>
        /// 列表
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.KeyValueInfo_View)]
        public ActionResult Index()
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.KeyValueInfo.KeyValueInfoListVM();

            #region 初始化查询条件

            viewModel.Search = new XCLNetSearch.Search();
            viewModel.Search.TypeList = new List<XCLNetSearch.SearchFieldInfo>() {
                new XCLNetSearch.SearchFieldInfo("数据ID","KeyValueInfoID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户ID","FK_MerchantID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用ID","FK_MerchantAppID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户名","MerchantName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用名","MerchantAppName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("唯一标识","Code|string|text",""),
                new XCLNetSearch.SearchFieldInfo("所属产品ID","FK_ProductID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属用户ID","FK_UserID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属用户名","UserName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("分类","KeyValueInfoTypeNames|string|text",""),
                new XCLNetSearch.SearchFieldInfo("内容","Contents|string|text",""),
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
            var response = XCLCMS.Lib.WebAPI.KeyValueInfoAPI.PageList(request).Body;
            viewModel.KeyValueInfoList = response.ResultList;
            viewModel.PagerModel = response.PagerInfo;

            return View(viewModel);
        }

        /// <summary>
        /// 添加与编辑页面首页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.KeyValueInfo_Add)]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.KeyValueInfo_Edit)]
        public ActionResult Add()
        {
            long keyValueInfoID = XCLNetTools.StringHander.FormHelper.GetLong("KeyValueInfoID");

            var viewModel = new Models.KeyValueInfo.KeyValueInfoAddVM();

            switch (base.CurrentHandleType)
            {
                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD:
                    viewModel.KeyValueInfo = new Data.Model.View.v_KeyValueInfo();
                    viewModel.FormAction = Url.Action("AddSubmit", "KeyValueInfo");
                    viewModel.KeyValueInfo.FK_MerchantID = base.CurrentUserModel.FK_MerchantID;
                    viewModel.KeyValueInfo.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
                    break;

                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.UPDATE:
                    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
                    request.Body = keyValueInfoID;
                    var response = XCLCMS.Lib.WebAPI.KeyValueInfoAPI.Detail(request);
                    viewModel.KeyValueInfo = response.Body;
                    viewModel.FormAction = Url.Action("UpdateSubmit", "KeyValueInfo");
                    break;
            }

            viewModel.RecordStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.KeyValueInfo.RecordState
            });

            return View(viewModel);
        }

        /// <summary>
        /// 查看页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.KeyValueInfo_View)]
        public ActionResult Show()
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.KeyValueInfo.KeyValueInfoShowVM();
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
            request.Body = XCLNetTools.StringHander.FormHelper.GetLong("KeyValueInfoID");
            var response = XCLCMS.Lib.WebAPI.KeyValueInfoAPI.Detail(request);
            viewModel.KeyValueInfo = response.Body ?? new Data.Model.View.v_KeyValueInfo();
            return View(viewModel);
        }

        /// <summary>
        /// 将表单值转为viewModel
        /// </summary>
        private XCLCMS.View.AdminWeb.Models.KeyValueInfo.KeyValueInfoAddVM GetViewModel(FormCollection fm)
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.KeyValueInfo.KeyValueInfoAddVM();
            viewModel.KeyValueInfoTypeIDList = XCLNetTools.StringHander.FormHelper.GetLongList("selKeyValueInfoType");
            viewModel.KeyValueInfo = new Data.Model.View.v_KeyValueInfo();
            viewModel.KeyValueInfo.FK_MerchantID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantID");
            viewModel.KeyValueInfo.FK_MerchantAppID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantAppID");
            viewModel.KeyValueInfo.KeyValueInfoID = XCLNetTools.StringHander.FormHelper.GetLong("KeyValueInfoID");
            viewModel.KeyValueInfo.RecordState = fm["selRecordState"];
            viewModel.KeyValueInfo.Code = fm["txtCode"];
            viewModel.KeyValueInfo.Contents = fm["txtContents"];
            viewModel.KeyValueInfo.Remark = fm["txtRemark"];
            viewModel.KeyValueInfo.FK_ProductID = XCLNetTools.StringHander.FormHelper.GetLong("txtFK_ProductID");
            viewModel.KeyValueInfo.FK_UserID = XCLNetTools.StringHander.FormHelper.GetLong("txtFK_UserID");
            viewModel.KeyValueInfo.UserName = fm["txtUserName"];
            return viewModel;
        }

        /// <summary>
        /// 添加
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.KeyValueInfo_Add)]
        public override ActionResult AddSubmit(FormCollection fm)
        {
            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.KeyValueInfo();
            model.KeyValueInfoID = XCLCMS.Lib.Common.FastAPI.CommonAPI_GenerateID(base.UserToken, new Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity()
            {
                IDType = Data.CommonHelper.EnumType.IDTypeEnum.KVL.ToString()
            });
            model.RecordState = viewModel.KeyValueInfo.RecordState;
            model.FK_MerchantAppID = viewModel.KeyValueInfo.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.KeyValueInfo.FK_MerchantID;
            model.Code = viewModel.KeyValueInfo.Code;
            model.Contents = viewModel.KeyValueInfo.Contents;
            model.Remark = viewModel.KeyValueInfo.Remark;
            model.FK_ProductID = viewModel.KeyValueInfo.FK_ProductID;
            model.FK_UserID = viewModel.KeyValueInfo.FK_UserID;
            model.UserName = viewModel.KeyValueInfo.UserName;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.AddOrUpdateEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.KeyValueInfo.AddOrUpdateEntity();
            request.Body.KeyValueInfo = model;
            request.Body.KeyValueInfoTypeIDList = viewModel.KeyValueInfoTypeIDList;
            var response = XCLCMS.Lib.WebAPI.KeyValueInfoAPI.Add(request);

            return Json(response);
        }

        /// <summary>
        /// 修改
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.KeyValueInfo_Edit)]
        public override ActionResult UpdateSubmit(FormCollection fm)
        {
            var viewModel = this.GetViewModel(fm);
            var model = new XCLCMS.Data.Model.KeyValueInfo();
            model.KeyValueInfoID = viewModel.KeyValueInfo.KeyValueInfoID;

            model.RecordState = viewModel.KeyValueInfo.RecordState;
            model.FK_MerchantAppID = viewModel.KeyValueInfo.FK_MerchantAppID;
            model.FK_MerchantID = viewModel.KeyValueInfo.FK_MerchantID;
            model.Code = viewModel.KeyValueInfo.Code;
            model.Contents = viewModel.KeyValueInfo.Contents;
            model.Remark = viewModel.KeyValueInfo.Remark;
            model.FK_ProductID = viewModel.KeyValueInfo.FK_ProductID;
            model.FK_UserID = viewModel.KeyValueInfo.FK_UserID;
            model.UserName = viewModel.KeyValueInfo.UserName;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.AddOrUpdateEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.KeyValueInfo.AddOrUpdateEntity();
            request.Body.KeyValueInfo = model;
            request.Body.KeyValueInfoTypeIDList = viewModel.KeyValueInfoTypeIDList;
            var response = XCLCMS.Lib.WebAPI.KeyValueInfoAPI.Update(request);

            return Json(response);
        }

        /// <summary>
        /// 删除
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.KeyValueInfo_Del)]
        public override ActionResult DelByIDSubmit(List<long> ids)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<List<long>>(base.UserToken);
            request.Body = ids;
            var response = XCLCMS.Lib.WebAPI.KeyValueInfoAPI.Delete(request);
            return Json(response);
        }

        /// <summary>
        /// 检查code是否已存在
        /// </summary>
        [HttpGet]
        public ActionResult IsExistCodeSubmit(Data.WebAPIEntity.RequestEntity.KeyValueInfo.IsExistCodeEntity entity)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.IsExistCodeEntity>(base.UserToken);
            request.Body = entity;
            var response = XCLCMS.Lib.WebAPI.KeyValueInfoAPI.IsExistCode(request);
            return Json(response, JsonRequestBehavior.AllowGet);
        }
    }
}