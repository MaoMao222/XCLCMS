using System;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.UserCenter;
using XCLCMS.IService.WebAPI;

namespace XCLCMS.Service.WebAPI
{
    /// <summary>
    /// 个人中心
    /// </summary>
    public class UserCenterService : IUserCenterService
    {
        private XCLCMS.Data.BLL.UserInfo userInfoBLL = new XCLCMS.Data.BLL.UserInfo();
        private IUserInfoService iUserInfoService = new UserInfoService();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 修改用户基本信息
        /// </summary>
        public APIResponseEntity<bool> UpdateUserInfo(APIRequestEntity<UserBaseInfoEntity> request)
        {
            var response = new APIResponseEntity<bool>();

            if (!string.Equals(this.ContextInfo.UserName, request.Body.UserName, StringComparison.OrdinalIgnoreCase))
            {
                response.IsSuccess = false;
                response.Message = "您要修改的用户信息与当前的操作用户不一致！";
                return response;
            }

            var model = this.userInfoBLL.GetModel(request.Body.UserName);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的用户信息！";
                return response;
            }

            model.RealName = request.Body.RealName;
            model.NickName = request.Body.NickName;
            model.SexType = request.Body.SexType;
            model.Birthday = request.Body.Birthday;
            model.Age = request.Body.Age;
            model.Tel = request.Body.Tel;
            model.QQ = request.Body.QQ;
            model.Email = request.Body.Email;
            model.OtherContact = request.Body.OtherContact;

            this.iUserInfoService.ContextInfo = this.ContextInfo;
            response = this.iUserInfoService.Update(new APIRequestEntity<Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity>()
            {
                Body = new Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity()
                {
                    UserInfo = model
                }
            });

            return response;
        }

        /// <summary>
        /// 修改密码
        /// </summary>
        public APIResponseEntity<bool> UpdatePassword(APIRequestEntity<PasswordEntity> request)
        {
            var response = new APIResponseEntity<bool>();

            if (string.IsNullOrWhiteSpace(request.Body.OldPwd))
            {
                response.IsSuccess = false;
                response.Message = "必须指定原密码！";
                return response;
            }

            if (string.IsNullOrWhiteSpace(request.Body.NewPwd))
            {
                response.IsSuccess = false;
                response.Message = "必须指定新密码！";
                return response;
            }

            if (this.ContextInfo.UserInfoID != request.Body.UserInfoID)
            {
                response.IsSuccess = false;
                response.Message = "您要修改的用户信息与当前的操作用户不一致！";
                return response;
            }

            var model = this.userInfoBLL.GetModel(request.Body.UserInfoID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的用户信息！";
                return response;
            }

            if (XCLCMS.Data.CommonHelper.EncryptHelper.EncryptStringMD5(request.Body.OldPwd) != model.Pwd)
            {
                response.IsSuccess = false;
                response.Message = "请输入正确的原密码！";
                return response;
            }

            if (XCLCMS.Data.CommonHelper.EncryptHelper.EncryptStringMD5(request.Body.NewPwd) == model.Pwd)
            {
                response.IsSuccess = false;
                response.Message = "新密码不能与原密码相同！";
                return response;
            }

            model.Pwd = request.Body.NewPwd;

            this.iUserInfoService.ContextInfo = this.ContextInfo;
            response = this.iUserInfoService.Update(new APIRequestEntity<Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity>()
            {
                Body = new Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity()
                {
                    UserInfo = model
                }
            });

            return response;
        }
    }
}