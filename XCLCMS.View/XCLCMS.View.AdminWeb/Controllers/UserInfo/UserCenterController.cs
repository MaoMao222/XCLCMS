using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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

            return View("~/Views/UserInfo/UserCenterIndex.cshtml",viewModel);
        }
    }
}