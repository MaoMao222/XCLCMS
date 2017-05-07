using System;
using System.Web.Mvc;
using XCLNetTools.Generic;

namespace XCLCMS.View.AdminWeb.Controllers.SysDic
{
    /// <summary>
    /// 字典库controller
    /// </summary>
    public class SysDicController : BaseController
    {
        /// <summary>
        /// 列表页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysDicView)]
        public ActionResult Index()
        {
            return View("~/Views/SysDic/SysDicList.cshtml");
        }

        /// <summary>
        /// 添加或修改的页面
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysDicAdd)]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysDicEdit)]
        public ActionResult Add()
        {
            long sysDicId = XCLNetTools.StringHander.FormHelper.GetLong("sysDicId");
            XCLCMS.View.AdminWeb.Models.SysDic.SysDicAddVM viewModel = new XCLCMS.View.AdminWeb.Models.SysDic.SysDicAddVM();

            //判断当前字典是否属于【系统菜单】
            if (viewModel.SysDicCategory == XCLCMS.View.AdminWeb.Models.SysDic.SysDicCategoryEnum.None)
            {
                var menus = XCLCMS.Lib.WebAPI.Library.SysDicAPI_GetSystemMenuModelList(base.UserToken);
                if (menus.IsNotNullOrEmpty())
                {
                    if (menus.Exists(k => k.SysDicID == sysDicId || (k.ParentID == sysDicId && base.CurrentHandleType == XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD)))
                    {
                        viewModel.SysDicCategory = XCLCMS.View.AdminWeb.Models.SysDic.SysDicCategoryEnum.SysMenu;
                    }
                }
            }

            switch (base.CurrentHandleType)
            {
                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD:
                    viewModel.SysDic = new Data.Model.SysDic();
                    viewModel.ParentID = sysDicId;
                    viewModel.SysDicID = -1;
                    viewModel.FormAction = Url.Action("AddSubmit", "SysDic");
                    viewModel.SysDic.FK_MerchantID = base.CurrentUserModel.FK_MerchantID;
                    break;

                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.UPDATE:

                    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
                    request.Body = sysDicId;
                    var response = XCLCMS.Lib.WebAPI.SysDicAPI.Detail(request);

                    viewModel.SysDicID = response.Body.SysDicID;
                    viewModel.SysDic = response.Body;
                    viewModel.ParentID = viewModel.SysDic.ParentID;
                    viewModel.FormAction = Url.Action("UpdateSubmit", "SysDic");
                    break;
            }

            viewModel.PathList = XCLCMS.Lib.WebAPI.Library.SysDicAPI_GetLayerListBySysDicID(base.UserToken, new Data.WebAPIEntity.RequestEntity.SysDic.GetLayerListBySysDicIDEntity()
            {
                SysDicID = sysDicId
            });

            return View("~/Views/SysDic/SysDicAdd.cshtml", viewModel);
        }

        /// <summary>
        /// 将表单值转为viewModel
        /// </summary>
        private XCLCMS.View.AdminWeb.Models.SysDic.SysDicAddVM GetViewModel(FormCollection fm)
        {
            XCLCMS.View.AdminWeb.Models.SysDic.SysDicAddVM viewModel = new XCLCMS.View.AdminWeb.Models.SysDic.SysDicAddVM();
            viewModel.SysDic = new Data.Model.SysDic();
            viewModel.SysDicID = XCLNetTools.Common.DataTypeConvert.ToLong(fm["SysDicID"]);
            viewModel.ParentID = XCLNetTools.Common.DataTypeConvert.ToLong(fm["ParentID"]);
            viewModel.SysDic.Code = (fm["txtCode"] ?? "").Trim();
            viewModel.SysDic.DicName = (fm["txtDicName"] ?? "").Trim();
            viewModel.SysDic.DicValue = (fm["txtDicValue"] ?? "").Trim();
            viewModel.SysDic.Sort = XCLNetTools.Common.DataTypeConvert.ToInt(fm["txtSort"] ?? "");
            viewModel.SysDic.Remark = (fm["txtRemark"] ?? "").Trim();
            viewModel.SysDic.FK_FunctionID = XCLNetTools.Common.DataTypeConvert.ToLongNull(fm["txtFunctionID"] ?? "");
            viewModel.SysDic.FK_MerchantAppID = XCLNetTools.Common.DataTypeConvert.ToLong(fm["txtMerchantAppID"]);
            viewModel.SysDic.FK_MerchantID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantID");
            return viewModel;
        }

        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysDicAdd)]
        public override ActionResult AddSubmit(FormCollection fm)
        {
            base.AddSubmit(fm);
            XCLCMS.View.AdminWeb.Models.SysDic.SysDicAddVM viewModel = this.GetViewModel(fm);

            XCLCMS.Data.Model.SysDic sysDicModel = new Data.Model.SysDic();

            sysDicModel.Code = viewModel.SysDic.Code;
            sysDicModel.DicName = viewModel.SysDic.DicName;
            sysDicModel.DicValue = viewModel.SysDic.DicValue;
            sysDicModel.ParentID = viewModel.ParentID;
            sysDicModel.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
            sysDicModel.Sort = viewModel.SysDic.Sort;
            sysDicModel.Remark = viewModel.SysDic.Remark;
            sysDicModel.FK_FunctionID = viewModel.SysDic.FK_FunctionID;
            sysDicModel.SysDicID = XCLCMS.Lib.WebAPI.Library.CommonAPI_GenerateID(base.UserToken, new Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity()
            {
                IDType = Data.CommonHelper.EnumType.IDTypeEnum.DIC.ToString()
            });
            sysDicModel.FK_MerchantAppID = viewModel.SysDic.FK_MerchantAppID;
            sysDicModel.FK_MerchantID = viewModel.SysDic.FK_MerchantID;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.SysDic>(base.UserToken);
            request.Body = sysDicModel;
            var response = XCLCMS.Lib.WebAPI.SysDicAPI.Add(request);

            return Json(response);
        }

        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysDicEdit)]
        public override ActionResult UpdateSubmit(FormCollection fm)
        {
            base.UpdateSubmit(fm);
            XCLCMS.View.AdminWeb.Models.SysDic.SysDicAddVM viewModel = this.GetViewModel(fm);

            XCLCMS.Data.Model.SysDic sysDicModel = new Data.Model.SysDic();
            sysDicModel.SysDicID = viewModel.SysDicID;
            sysDicModel.Code = viewModel.SysDic.Code;
            sysDicModel.DicName = viewModel.SysDic.DicName;
            sysDicModel.DicValue = viewModel.SysDic.DicValue;
            sysDicModel.Sort = viewModel.SysDic.Sort;
            sysDicModel.Remark = viewModel.SysDic.Remark;
            sysDicModel.FK_FunctionID = viewModel.SysDic.FK_FunctionID;
            sysDicModel.FK_MerchantAppID = viewModel.SysDic.FK_MerchantAppID;
            sysDicModel.FK_MerchantID = viewModel.SysDic.FK_MerchantID;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.SysDic>(base.UserToken);
            request.Body = sysDicModel;
            var response = XCLCMS.Lib.WebAPI.SysDicAPI.Update(request);

            return Json(response);
        }
    }
}