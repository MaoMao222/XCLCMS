using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using XCLNetTools.Generic;

namespace XCLCMS.View.AdminWeb.Controllers.UserInfo
{
    /// <summary>
    /// 用户controller
    /// </summary>
    public class UserInfoController : BaseController
    {
        /// <summary>
        /// 用户信息列表首页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_UserView)]
        public ActionResult Index()
        {
            XCLCMS.View.AdminWeb.Models.UserInfo.UserInfoListVM viewModel = new XCLCMS.View.AdminWeb.Models.UserInfo.UserInfoListVM();

            #region 初始化查询条件

            viewModel.Search = new XCLNetSearch.Search();
            viewModel.Search.TypeList = new List<XCLNetSearch.SearchFieldInfo>() {
                new XCLNetSearch.SearchFieldInfo("用户ID","UserInfoID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户ID","FK_MerchantID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用ID","FK_MerchantAppID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户名","MerchantName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用名","MerchantAppName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("用户名","UserName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("真实姓名","RealName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("昵称","NickName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("年龄","Age|number|text",""),
                new XCLNetSearch.SearchFieldInfo("性别","SexType|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.UserSexTypeEnum))),
                new XCLNetSearch.SearchFieldInfo("出生日期","Birthday|dateTime|text",""),
                new XCLNetSearch.SearchFieldInfo("手机号","Tel|string|text",""),
                new XCLNetSearch.SearchFieldInfo("QQ","QQ|string|text",""),
                new XCLNetSearch.SearchFieldInfo("电子邮件","Email|string|text",""),
                new XCLNetSearch.SearchFieldInfo("其它联系方式","OtherContact|string|text",""),
                new XCLNetSearch.SearchFieldInfo("备注","Remark|string|text",""),
                new XCLNetSearch.SearchFieldInfo("角色","RoleName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("用户状态","UserState|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.UserStateEnum))),
                new XCLNetSearch.SearchFieldInfo("用户类别","UserType|string|select",XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.UserTypeEnum))),
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
            var response = XCLCMS.Lib.WebAPI.UserInfoAPI.PageList(request).Body;
            viewModel.UserInfoList = response.ResultList;
            viewModel.PagerModel = response.PagerInfo;

            return View("~/Views/UserInfo/UserInfoList.cshtml", viewModel);
        }

        /// <summary>
        /// 添加与编辑用户页面首页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_UserAdd)]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_UserEdit)]
        public ActionResult Add()
        {
            long userInfoId = XCLNetTools.StringHander.FormHelper.GetLong("userInfoId");

            XCLCMS.View.AdminWeb.Models.UserInfo.UserInfoAddVM viewModel = new XCLCMS.View.AdminWeb.Models.UserInfo.UserInfoAddVM();
            viewModel.UserInfo = new XCLCMS.Data.Model.UserInfo();

            switch (base.CurrentHandleType)
            {
                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD:
                    viewModel.UserInfo = new Data.Model.UserInfo();
                    viewModel.UserInfo.SexType = XCLCMS.Data.CommonHelper.EnumType.UserSexTypeEnum.M.ToString();
                    viewModel.UserInfo.UserState = XCLCMS.Data.CommonHelper.EnumType.UserStateEnum.N.ToString();
                    viewModel.UserInfo.FK_MerchantID = base.CurrentUserModel.FK_MerchantID;
                    viewModel.FormAction = Url.Action("AddSubmit", "UserInfo");
                    viewModel.UserInfo.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
                    break;

                case XCLNetTools.Enum.CommonEnum.HandleTypeEnum.UPDATE:
                    var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(base.UserToken);
                    request.Body = userInfoId;
                    var response = XCLCMS.Lib.WebAPI.UserInfoAPI.Detail(request);

                    viewModel.UserInfo = response.Body;
                    viewModel.FormAction = Url.Action("UpdateSubmit", "UserInfo");
                    var userHadRole = XCLCMS.Lib.Permission.PerHelper.GetRoleByUserID(viewModel.UserInfo.UserInfoID);
                    if (userHadRole.IsNotNullOrEmpty())
                    {
                        viewModel.UserRoleIDs = userHadRole.Select(k => k.SysRoleID).ToList();
                    }
                    break;
            }

            viewModel.RecordStateOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(typeof(XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum), new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = false,
                DefaultValue = viewModel.UserInfo.RecordState
            });

            return View("~/Views/UserInfo/UserInfoAdd.cshtml", viewModel);
        }

        /// <summary>
        /// 将表单值转为viewModel
        /// </summary>
        private XCLCMS.View.AdminWeb.Models.UserInfo.UserInfoAddVM GetViewModel(FormCollection fm)
        {
            XCLCMS.View.AdminWeb.Models.UserInfo.UserInfoAddVM viewModel = new XCLCMS.View.AdminWeb.Models.UserInfo.UserInfoAddVM();
            viewModel.UserInfo = new Data.Model.UserInfo();
            viewModel.UserInfo.Age = XCLNetTools.Common.DataTypeConvert.ToInt((fm["txtAge"] ?? "").Trim());
            viewModel.UserInfo.Birthday = XCLNetTools.Common.DataTypeConvert.ToDateTimeNull((fm["txtBirthday"] ?? "").Trim());
            viewModel.UserInfo.Email = (fm["txtEmail"] ?? "").Trim();
            viewModel.UserInfo.NickName = (fm["txtNickName"] ?? "").Trim();
            viewModel.UserInfo.OtherContact = (fm["txtOtherContact"] ?? "").Trim();
            viewModel.UserInfo.Pwd = (fm["txtPwd"] ?? "").Trim();
            viewModel.UserInfo.QQ = (fm["txtQQ"] ?? "").Trim();
            viewModel.UserInfo.RealName = (fm["txtRealName"] ?? "").Trim();
            viewModel.UserInfo.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString();
            viewModel.UserInfo.Remark = (fm["txtRemark"] ?? "").Trim();
            viewModel.UserInfo.SexType = (fm["selSexType"] ?? "").Trim();
            viewModel.UserInfo.Tel = (fm["txtTel"] ?? "").Trim();
            viewModel.UserInfo.UserName = (fm["txtUserName"] ?? "").Trim();
            viewModel.UserInfo.UserState = (fm["selUserState"] ?? "").Trim();
            viewModel.UserInfo.UserType = (fm["selUserType"] ?? "").Trim();
            viewModel.UserInfo.FK_MerchantID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantID");
            viewModel.UserInfo.FK_MerchantAppID = XCLNetTools.StringHander.FormHelper.GetLong("txtMerchantAppID");
            viewModel.UserInfo.RecordState = XCLNetTools.StringHander.FormHelper.GetString("selRecordState");
            viewModel.UserRoleIDs = XCLNetTools.StringHander.FormHelper.GetLongList("txtUserRoleIDs");
            return viewModel;
        }

        /// <summary>
        /// 添加用户信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_UserAdd)]
        public override ActionResult AddSubmit(FormCollection fm)
        {
            XCLCMS.View.AdminWeb.Models.UserInfo.UserInfoAddVM viewModel = this.GetViewModel(fm);
            XCLCMS.Data.Model.UserInfo model = new XCLCMS.Data.Model.UserInfo();
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();
            model.UserInfoID = XCLCMS.Lib.WebAPI.Library.CommonAPI_GenerateID(base.UserToken, new Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity()
            {
                IDType = Data.CommonHelper.EnumType.IDTypeEnum.USR.ToString()
            });
            model.AccessToken = viewModel.UserInfo.AccessType;
            model.AccessType = viewModel.UserInfo.AccessType;
            model.Age = viewModel.UserInfo.Age;
            model.Birthday = viewModel.UserInfo.Birthday;
            model.Email = viewModel.UserInfo.Email;
            model.NickName = viewModel.UserInfo.NickName;
            model.OtherContact = viewModel.UserInfo.OtherContact;
            model.Pwd = string.IsNullOrEmpty(viewModel.UserInfo.Pwd) ? XCLCMS.Lib.Common.Setting.SettingModel.Common_UserDefaultPwd : viewModel.UserInfo.Pwd;
            model.QQ = viewModel.UserInfo.QQ;
            model.RealName = viewModel.UserInfo.RealName;
            model.RecordState = viewModel.UserInfo.RecordState;
            model.Remark = viewModel.UserInfo.Remark;
            model.SexType = viewModel.UserInfo.SexType;
            model.Tel = viewModel.UserInfo.Tel;
            model.UserName = viewModel.UserInfo.UserName;
            model.UserState = viewModel.UserInfo.UserState;
            model.UserType = viewModel.UserInfo.UserType;
            model.FK_MerchantID = viewModel.UserInfo.FK_MerchantID;
            model.FK_MerchantAppID = viewModel.UserInfo.FK_MerchantAppID;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity();
            request.Body.UserInfo = model;
            request.Body.RoleIdList = viewModel.UserRoleIDs;
            var response = XCLCMS.Lib.WebAPI.UserInfoAPI.Add(request);

            return Json(response);
        }

        /// <summary>
        /// 更新用户信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_UserEdit)]
        public override ActionResult UpdateSubmit(FormCollection fm)
        {
            base.UpdateSubmit(fm);
            long userInfoId = XCLNetTools.StringHander.FormHelper.GetLong("userInfoId");
            XCLCMS.View.AdminWeb.Models.UserInfo.UserInfoAddVM viewModel = this.GetViewModel(fm);
            XCLCMS.Data.Model.UserInfo model = new Data.Model.UserInfo();
            model.UserInfoID = userInfoId;
            model.RecordState = viewModel.UserInfo.RecordState;
            model.AccessToken = viewModel.UserInfo.AccessType;
            model.AccessType = viewModel.UserInfo.AccessType;
            model.Age = viewModel.UserInfo.Age;
            model.Birthday = viewModel.UserInfo.Birthday;
            model.Email = viewModel.UserInfo.Email;
            model.NickName = viewModel.UserInfo.NickName;
            model.OtherContact = viewModel.UserInfo.OtherContact;
            if (!string.IsNullOrEmpty(viewModel.UserInfo.Pwd))
            {
                model.Pwd = viewModel.UserInfo.Pwd;
            }
            model.QQ = viewModel.UserInfo.QQ;
            model.RealName = viewModel.UserInfo.RealName;
            model.Remark = viewModel.UserInfo.Remark;
            model.SexType = viewModel.UserInfo.SexType;
            model.Tel = viewModel.UserInfo.Tel;
            model.UserState = viewModel.UserInfo.UserState;
            model.UserType = viewModel.UserInfo.UserType;
            model.FK_MerchantID = viewModel.UserInfo.FK_MerchantID;
            model.FK_MerchantAppID = viewModel.UserInfo.FK_MerchantAppID;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity();
            request.Body.UserInfo = model;
            request.Body.RoleIdList = viewModel.UserRoleIDs;
            var response = XCLCMS.Lib.WebAPI.UserInfoAPI.Update(request);

            return Json(response);
        }
    }
}