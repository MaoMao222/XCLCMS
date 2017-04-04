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
            viewModel.UserBaseInfo.MerchantAppName = base.CurrentUserMerchantApp.MerchantAppName;
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
    }
}