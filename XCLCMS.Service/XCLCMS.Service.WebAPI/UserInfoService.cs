using System;
using System.Collections.Generic;
using System.Linq;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.IService.WebAPI;
using XCLNetTools.Generic;

namespace XCLCMS.Service.WebAPI
{
    /// <summary>
    /// 用户
    /// </summary>
    public class UserInfoService : IUserInfoService
    {
        private XCLCMS.Data.BLL.UserInfo userInfoBLL = new XCLCMS.Data.BLL.UserInfo();
        private XCLCMS.Data.BLL.View.v_UserInfo vUserInfoBLL = new XCLCMS.Data.BLL.View.v_UserInfo();
        private XCLCMS.Data.BLL.Merchant merchantBLL = new XCLCMS.Data.BLL.Merchant();
        private XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();
        private XCLCMS.Data.BLL.SysRole sysRoleBLL = new XCLCMS.Data.BLL.SysRole();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 查询用户信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.UserInfo> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.UserInfo>();
            response.Body = userInfoBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 查询用户信息分页列表
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_UserInfo>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            var pager = request.Body.PagerInfoSimple.ToPagerInfo();
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_UserInfo>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_UserInfo>();
            response.Body.ResultList = vUserInfoBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
            {
                OrderBy = "[UserInfoID] desc",
                Where = request.Body.Where
            });
            response.Body.PagerInfo = pager;
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 判断用户名是否存在
        /// </summary>
        public APIResponseEntity<bool> IsExistUserName(APIRequestEntity<string> request)
        {
            var response = new APIResponseEntity<bool>();
            response.IsSuccess = true;
            response.Message = "该用户名可以使用！";

            request.Body = (request.Body ?? "").Trim();

            if (this.userInfoBLL.IsExistUserName(request.Body))
            {
                response.IsSuccess = false;
                response.Message = "该用户名已存在！";
            }
            else
            {
                response.IsSuccess = true;
                response.Message = "该用户名可以使用！";
            }

            return response;
        }

        /// <summary>
        /// 新增用户信息
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            if (null == request.Body.UserInfo)
            {
                response.IsSuccess = false;
                response.Message = "请指定用户信息！";
                return response;
            }
            request.Body.UserInfo.UserName = (request.Body.UserInfo.UserName ?? "").Trim();
            if (!string.IsNullOrWhiteSpace(request.Body.UserInfo.Pwd))
            {
                request.Body.UserInfo.Pwd = XCLCMS.Data.CommonHelper.EncryptHelper.EncryptStringMD5(request.Body.UserInfo.Pwd);
            }

            if (string.IsNullOrWhiteSpace(request.Body.UserInfo.UserType))
            {
                request.Body.UserInfo.UserType = XCLCMS.Data.CommonHelper.EnumType.UserTypeEnum.NON.ToString();
            }

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.UserInfo.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            //必须指定用户信息
            if (string.IsNullOrEmpty(request.Body.UserInfo.UserName))
            {
                response.IsSuccess = false;
                response.Message = "请指定用户名！";
                return response;
            }

            //用户名是否被占用
            if (this.userInfoBLL.IsExistUserName(request.Body.UserInfo.UserName))
            {
                response.IsSuccess = false;
                response.Message = "用户名被占用，请重新指定用户名！";
                return response;
            }

            //应用号与商户一致
            if (!this.merchantAppBLL.IsTheSameMerchantInfoID(request.Body.UserInfo.FK_MerchantID, request.Body.UserInfo.FK_MerchantAppID))
            {
                response.IsSuccess = false;
                response.Message = "商户号与应用号不匹配，请核对后再试！";
                return response;
            }

            //角色是否越界
            var roleList = this.sysRoleBLL.GetModelList(request.Body.RoleIdList);
            if (null != roleList && roleList.Count > 0 && roleList.Exists(k => k.FK_MerchantID != request.Body.UserInfo.FK_MerchantID))
            {
                response.IsSuccess = false;
                response.Message = "角色与用户所在商户不匹配！";
                return response;
            }

            #endregion 数据校验

            XCLCMS.Data.BLL.Strategy.UserInfo.UserInfoContext userInfoContext = new Data.BLL.Strategy.UserInfo.UserInfoContext();
            userInfoContext.ContextInfo = this.ContextInfo;
            userInfoContext.UserInfo = request.Body.UserInfo;
            userInfoContext.UserRoleIDs = request.Body.RoleIdList;
            userInfoContext.HandleType = Data.BLL.Strategy.StrategyLib.HandleType.ADD;

            XCLCMS.Data.BLL.Strategy.ExecuteStrategy strategy = new Data.BLL.Strategy.ExecuteStrategy(new List<Data.BLL.Strategy.BaseStrategy>() {
                new XCLCMS.Data.BLL.Strategy.UserInfo.UserInfo()
            });
            if (userInfoContext.UserRoleIDs.IsNotNullOrEmpty())
            {
                strategy.StrategyList.Add(new XCLCMS.Data.BLL.Strategy.UserInfo.RoleInfo());
            }
            strategy.Execute<XCLCMS.Data.BLL.Strategy.UserInfo.UserInfoContext>(userInfoContext);

            if (strategy.Result != Data.BLL.Strategy.StrategyLib.ResultEnum.FAIL)
            {
                response.Message = "添加成功！";
                response.IsSuccess = true;
            }
            else
            {
                response.Message = strategy.ResultMessage;
                response.IsSuccess = false;
            }

            return response;
        }

        /// <summary>
        /// 修改用户信息
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            if (null == request.Body.UserInfo)
            {
                response.IsSuccess = false;
                response.Message = "请指定用户信息！";
                return response;
            }

            var model = this.userInfoBLL.GetModel(request.Body.UserInfo.UserInfoID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的用户信息！";
                return response;
            }

            request.Body.UserInfo.UserName = (request.Body.UserInfo.UserName ?? "").Trim();
            if (!string.IsNullOrWhiteSpace(request.Body.UserInfo.Pwd) && !XCLNetTools.Encrypt.MD5.Is32MD5(request.Body.UserInfo.Pwd))
            {
                request.Body.UserInfo.Pwd = XCLCMS.Data.CommonHelper.EncryptHelper.EncryptStringMD5(request.Body.UserInfo.Pwd);
            }

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.UserInfo.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            //应用号与商户一致
            if (!this.merchantAppBLL.IsTheSameMerchantInfoID(request.Body.UserInfo.FK_MerchantID, request.Body.UserInfo.FK_MerchantAppID))
            {
                response.IsSuccess = false;
                response.Message = "商户号与应用号不匹配，请核对后再试！";
                return response;
            }

            //角色是否越界
            var roleList = this.sysRoleBLL.GetModelList(request.Body.RoleIdList);
            if (null != roleList && roleList.Count > 0 && roleList.Exists(k => k.FK_MerchantID != request.Body.UserInfo.FK_MerchantID))
            {
                response.IsSuccess = false;
                response.Message = "角色与用户所在商户不匹配！";
                return response;
            }

            #endregion 数据校验

            model.RecordState = request.Body.UserInfo.RecordState;
            model.AccessToken = request.Body.UserInfo.AccessToken;
            model.AccessType = request.Body.UserInfo.AccessType;
            model.Age = request.Body.UserInfo.Age;
            model.Birthday = request.Body.UserInfo.Birthday;
            model.Email = request.Body.UserInfo.Email;
            model.FK_MerchantID = request.Body.UserInfo.FK_MerchantID;
            model.FK_MerchantAppID = request.Body.UserInfo.FK_MerchantAppID;
            model.NickName = request.Body.UserInfo.NickName;
            model.OtherContact = request.Body.UserInfo.OtherContact;
            if (!string.IsNullOrWhiteSpace(request.Body.UserInfo.Pwd))
            {
                model.Pwd = request.Body.UserInfo.Pwd;
            }
            model.QQ = request.Body.UserInfo.QQ;
            model.RealName = request.Body.UserInfo.RealName;
            model.Remark = request.Body.UserInfo.Remark;
            model.SexType = request.Body.UserInfo.SexType;
            model.Tel = request.Body.UserInfo.Tel;
            model.UserState = request.Body.UserInfo.UserState;

            if (!string.IsNullOrWhiteSpace(request.Body.UserInfo.UserType))
            {
                model.UserType = request.Body.UserInfo.UserType;
            }

            XCLCMS.Data.BLL.Strategy.UserInfo.UserInfoContext userInfoContext = new Data.BLL.Strategy.UserInfo.UserInfoContext();
            userInfoContext.ContextInfo = this.ContextInfo;
            userInfoContext.UserInfo = model;
            userInfoContext.UserRoleIDs = request.Body.RoleIdList;
            userInfoContext.HandleType = Data.BLL.Strategy.StrategyLib.HandleType.UPDATE;

            XCLCMS.Data.BLL.Strategy.ExecuteStrategy strategy = new Data.BLL.Strategy.ExecuteStrategy(new List<Data.BLL.Strategy.BaseStrategy>() {
                new XCLCMS.Data.BLL.Strategy.UserInfo.UserInfo()
            });
            if (userInfoContext.UserRoleIDs.IsNotNullOrEmpty())
            {
                strategy.StrategyList.Add(new XCLCMS.Data.BLL.Strategy.UserInfo.RoleInfo());
            }
            strategy.Execute<XCLCMS.Data.BLL.Strategy.UserInfo.UserInfoContext>(userInfoContext);

            if (strategy.Result != Data.BLL.Strategy.StrategyLib.ResultEnum.FAIL)
            {
                response.Message = "修改成功！";
                response.IsSuccess = true;
            }
            else
            {
                response.Message = strategy.ResultMessage;
                response.IsSuccess = false;
            }

            return response;
        }

        /// <summary>
        /// 删除用户信息
        /// </summary>
        public APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            var response = new APIResponseEntity<bool>();

            if (request.Body.IsNotNullOrEmpty())
            {
                request.Body = request.Body.Where(k => k > 0).Distinct().ToList();
            }

            if (request.Body.IsNullOrEmpty())
            {
                response.IsSuccess = false;
                response.Message = "请指定要删除的用户ID！";
                return response;
            }

            foreach (var k in request.Body)
            {
                var userInfoModel = userInfoBLL.GetModel(k);
                if (null == userInfoModel)
                {
                    continue;
                }

                userInfoModel.UpdaterID = this.ContextInfo.UserInfoID;
                userInfoModel.UpdaterName = this.ContextInfo.UserName;
                userInfoModel.UpdateTime = DateTime.Now;
                userInfoModel.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.R.ToString();
                userInfoModel.UserState = XCLCMS.Data.CommonHelper.EnumType.UserStateEnum.D.ToString();
                userInfoBLL.Update(userInfoModel);
            }

            response.IsSuccess = true;
            response.Message = "已成功删除用户信息！";
            response.IsRefresh = true;

            return response;
        }
    }
}