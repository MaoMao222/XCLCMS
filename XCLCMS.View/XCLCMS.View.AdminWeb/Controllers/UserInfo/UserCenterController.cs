using System.Web.Mvc;
using static XCLCMS.Data.CommonHelper.EnumType;

namespace XCLCMS.View.AdminWeb.Controllers.UserInfo
{
    /// <summary>
    /// 个人中心
    /// </summary>
    public class UserCenterController : BaseController
    {
        public ActionResult Index()
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.UserInfo.UserCenterEditVM();
            //个人资料
            viewModel.UserBaseInfo = new Models.UserInfo.UserCenterUserBaseInfo();
            viewModel.UserBaseInfo.Age = base.CurrentUserModel.Age;
            viewModel.UserBaseInfo.Birthday = base.CurrentUserModel.Birthday;
            viewModel.UserBaseInfo.Email = base.CurrentUserModel.Email;
            viewModel.UserBaseInfo.MerchantAppName = base.CurrentUserMerchantApp?.MerchantAppName ?? "暂无";
            viewModel.UserBaseInfo.MerchantName = base.CurrentUserMerchant.MerchantName;
            viewModel.UserBaseInfo.NickName = base.CurrentUserModel.NickName;
            viewModel.UserBaseInfo.OtherContact = base.CurrentUserModel.OtherContact;
            viewModel.UserBaseInfo.QQ = base.CurrentUserModel.QQ;
            viewModel.UserBaseInfo.RealName = base.CurrentUserModel.RealName;
            viewModel.UserBaseInfo.SexType = base.CurrentUserModel.SexType;
            viewModel.UserBaseInfo.Tel = base.CurrentUserModel.Tel;
            viewModel.UserBaseInfo.UserName = base.CurrentUserModel.UserName;
            viewModel.UserBaseInfo.UserStateName = XCLNetTools.Enum.EnumHelper.GetEnumDescriptionByText(typeof(UserStateEnum), base.CurrentUserModel.UserState);
            viewModel.UserBaseInfoFormAction = Url.Action("UpdateUserBaseInfo", "UserCenter");
            //修改密码
            viewModel.PasswordFormAction = Url.Action("UpdatePassword", "UserCenter");
            //商户资料
            var merchantTypeDic = XCLCMS.Lib.Common.FastAPI.MerchantAPI_GetMerchantTypeDic(base.UserToken);
            var passTypeDic = XCLCMS.Lib.Common.FastAPI.SysDicAPI_GetPassTypeDic(base.UserToken);
            viewModel.MerchantInfo = new Models.UserInfo.UserCenterMerchantInfo();
            viewModel.MerchantInfo.ContactName = base.CurrentUserMerchant.ContactName;
            viewModel.MerchantInfo.Domain = base.CurrentUserMerchant.Domain;
            viewModel.MerchantInfo.Email = base.CurrentUserMerchant.Email;
            viewModel.MerchantInfo.FK_PassType = base.CurrentUserMerchant.FK_PassType;
            viewModel.MerchantInfo.Landline = base.CurrentUserMerchant.Landline;
            viewModel.MerchantInfo.MerchantName = base.CurrentUserMerchant.MerchantName;
            viewModel.MerchantInfo.MerchantStateName = XCLNetTools.Enum.EnumHelper.GetEnumDescriptionByText(typeof(MerchantStateEnum), base.CurrentUserMerchant.MerchantState);
            viewModel.MerchantInfo.OtherContact = base.CurrentUserMerchant.OtherContact;
            viewModel.MerchantInfo.PassNumber = base.CurrentUserMerchant.PassNumber;
            viewModel.MerchantInfo.Address = base.CurrentUserMerchant.Address;
            viewModel.MerchantInfo.QQ = base.CurrentUserMerchant.QQ;
            viewModel.MerchantInfo.Tel = base.CurrentUserMerchant.Tel;
            viewModel.MerchantInfo.PassTypeOptions = XCLNetTools.Control.HtmlControl.Lib.GetOptions(passTypeDic, new XCLNetTools.Entity.SetOptionEntity()
            {
                IsNeedPleaseSelect = true,
                DefaultValue = viewModel.MerchantInfo.FK_PassType.ToString()
            });
            if (null != merchantTypeDic)
            {
                foreach (var m in merchantTypeDic)
                {
                    if (m.Value == base.CurrentUserMerchant.FK_MerchantType)
                    {
                        viewModel.MerchantInfo.MerchantTypeName = m.Key;
                        break;
                    }
                }
            }
            viewModel.MerchantInfoFormAction = Url.Action("UpdateMerchantInfo", "UserCenter");

            return View("~/Views/UserInfo/UserCenterIndex.cshtml", viewModel);
        }

        /// <summary>
        /// 将表单值转为viewModel
        /// </summary>
        private XCLCMS.View.AdminWeb.Models.UserInfo.UserCenterEditVM GetViewModel(FormCollection fm)
        {
            var viewModel = new XCLCMS.View.AdminWeb.Models.UserInfo.UserCenterEditVM();
            viewModel.UserBaseInfo = new Models.UserInfo.UserCenterUserBaseInfo();
            viewModel.UserBaseInfo.Age = XCLNetTools.Common.DataTypeConvert.ToInt((fm["txtAge"] ?? "").Trim());
            viewModel.UserBaseInfo.Birthday = XCLNetTools.Common.DataTypeConvert.ToDateTimeNull((fm["txtBirthday"] ?? "").Trim());
            viewModel.UserBaseInfo.Email = (fm["txtEmail"] ?? "").Trim();
            viewModel.UserBaseInfo.NickName = (fm["txtNickName"] ?? "").Trim();
            viewModel.UserBaseInfo.OtherContact = (fm["txtOtherContact"] ?? "").Trim();
            viewModel.UserBaseInfo.QQ = (fm["txtQQ"] ?? "").Trim();
            viewModel.UserBaseInfo.RealName = (fm["txtRealName"] ?? "").Trim();
            viewModel.UserBaseInfo.SexType = (fm["selSexType"] ?? "").Trim();
            viewModel.UserBaseInfo.Tel = (fm["txtTel"] ?? "").Trim();
            viewModel.UserBaseInfo.UserName = base.CurrentUserModel.UserName;

            viewModel.PasswordInfo = new Models.UserInfo.UserCenterPasswordInfo();
            viewModel.PasswordInfo.OldPwd = fm["txtOldPwd"];
            viewModel.PasswordInfo.NewPwd = fm["txtNewPwd"];

            viewModel.MerchantInfo = new Models.UserInfo.UserCenterMerchantInfo();
            viewModel.MerchantInfo.Address = (fm["txtAddress"] ?? "").Trim();
            viewModel.MerchantInfo.ContactName = (fm["txtContactName"] ?? "").Trim();
            viewModel.MerchantInfo.Domain = (fm["txtDomain"] ?? "").Trim();
            viewModel.MerchantInfo.Email = (fm["txtEmail"] ?? "").Trim();
            viewModel.MerchantInfo.Landline = (fm["txtLandline"] ?? "").Trim();
            viewModel.MerchantInfo.OtherContact = (fm["txtOtherContact"] ?? "").Trim();
            viewModel.MerchantInfo.PassNumber = (fm["txtPassNumber"] ?? "").Trim();
            viewModel.MerchantInfo.FK_PassType = XCLNetTools.StringHander.FormHelper.GetLong("selPassType");
            viewModel.MerchantInfo.QQ = (fm["txtQQ"] ?? "").Trim();
            viewModel.MerchantInfo.Tel = (fm["txtTel"] ?? "").Trim();

            return viewModel;
        }

        /// <summary>
        /// 更新用户信息
        /// </summary>
        [HttpPost]
        public ActionResult UpdateUserBaseInfo(FormCollection fm)
        {
            var viewModel = this.GetViewModel(fm);
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.UserCenter.UserBaseInfoEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.UserCenter.UserBaseInfoEntity();
            request.Body.Age = viewModel.UserBaseInfo.Age;
            request.Body.Birthday = viewModel.UserBaseInfo.Birthday;
            request.Body.Email = viewModel.UserBaseInfo.Email;
            request.Body.NickName = viewModel.UserBaseInfo.NickName;
            request.Body.OtherContact = viewModel.UserBaseInfo.OtherContact;
            request.Body.QQ = viewModel.UserBaseInfo.QQ;
            request.Body.RealName = viewModel.UserBaseInfo.RealName;
            request.Body.SexType = viewModel.UserBaseInfo.SexType;
            request.Body.Tel = viewModel.UserBaseInfo.Tel;
            request.Body.UserName = viewModel.UserBaseInfo.UserName;
            var response = XCLCMS.Lib.WebAPI.UserCenterAPI.UpdateUserInfo(request);
            return Json(response);
        }

        /// <summary>
        /// 修改密码
        /// </summary>
        [HttpPost]
        public ActionResult UpdatePassword(FormCollection fm)
        {
            var viewModel = this.GetViewModel(fm);
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.UserCenter.PasswordEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.UserCenter.PasswordEntity();
            request.Body.NewPwd = viewModel.PasswordInfo.NewPwd;
            request.Body.OldPwd = viewModel.PasswordInfo.OldPwd;
            request.Body.UserInfoID = base.UserID;
            var response = XCLCMS.Lib.WebAPI.UserCenterAPI.UpdatePassword(request);
            return Json(response);
        }

        /// <summary>
        /// 修改商户资料
        /// </summary>
        [HttpPost]
        public ActionResult UpdateMerchantInfo(FormCollection fm)
        {
            var viewModel = this.GetViewModel(fm);
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.UserCenter.MerchantInfoEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.UserCenter.MerchantInfoEntity();
            request.Body.Address = viewModel.MerchantInfo.Address;
            request.Body.ContactName = viewModel.MerchantInfo.ContactName;
            request.Body.Domain = viewModel.MerchantInfo.Domain;
            request.Body.Email = viewModel.MerchantInfo.Email;
            request.Body.FK_PassType = viewModel.MerchantInfo.FK_PassType;
            request.Body.Landline = viewModel.MerchantInfo.Landline;
            request.Body.MerchantID = base.CurrentUserMerchant.MerchantID;
            request.Body.OtherContact = viewModel.MerchantInfo.OtherContact;
            request.Body.PassNumber = viewModel.MerchantInfo.PassNumber;
            request.Body.QQ = viewModel.MerchantInfo.QQ;
            request.Body.Tel = viewModel.MerchantInfo.Tel;
            var response = XCLCMS.Lib.WebAPI.UserCenterAPI.UpdateMerchantInfo(request);
            return Json(response);
        }
    }
}