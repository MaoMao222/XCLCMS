using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 用户信息 管理
    /// </summary>
    public class UserInfoController : BaseAPIController
    {
        private XCLCMS.IService.WebAPI.IUserInfoService _iUserInfoService = null;

        private XCLCMS.IService.WebAPI.IUserInfoService iUserInfoService
        {
            get
            {
                if (null != this._iUserInfoService && null == this._iUserInfoService.ContextInfo)
                {
                    this._iUserInfoService.ContextInfo = base.ContextModel;
                }
                return this._iUserInfoService;
            }
            set
            {
                this._iUserInfoService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public UserInfoController(XCLCMS.IService.WebAPI.IUserInfoService userInfoService, XCLCMS.IService.Logger.ILogService logService) : base(logService)
        {
            this.iUserInfoService = userInfoService;
        }

        /// <summary>
        /// 查询用户信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_UserView)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.UserInfo>> Detail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = this.iUserInfoService.Detail(request);

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && null != response.Body && response.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.Body = null;
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                }

                #endregion 限制商户

                return response;
            });
        }

        /// <summary>
        /// 查询用户信息分页列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_UserView)]
        public async Task<APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_UserInfo>>> PageList([FromUri] APIRequestEntity<PageListConditionEntity> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (base.IsOnlyCurrentMerchant)
                {
                    request.Body.Where = XCLNetTools.DataBase.SQLLibrary.JoinWithAnd(new List<string>() {
                    request.Body.Where,
                    string.Format("FK_MerchantID={0}",base.CurrentUserModel.FK_MerchantID)
                });
                }

                #endregion 限制商户

                return this.iUserInfoService.PageList(request);
            });
        }

        /// <summary>
        /// 判断用户名是否存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistUserName([FromUri] APIRequestEntity<string> request)
        {
            return await Task.Run(() =>
            {
                return this.iUserInfoService.IsExistUserName(request);
            });
        }

        /// <summary>
        /// 新增用户信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_UserAdd)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.UserInfo.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                #region 限制修改角色

                if (!XCLCMS.Lib.Permission.PerHelper.HasPermission(base.CurrentUserModel.UserInfoID, XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_SetUserRole))
                {
                    request.Body.RoleIdList = null;
                }

                #endregion 限制修改角色

                #region 限制修改用户类别

                if (!XCLCMS.Lib.Permission.PerHelper.HasPermission(base.CurrentUserModel.UserInfoID, XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_SetUserType))
                {
                    request.Body.UserInfo.UserType = null;
                }

                #endregion 限制修改用户类别

                response = this.iUserInfoService.Add(request);

                return response;
            });
        }

        /// <summary>
        /// 修改用户信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_UserEdit)]
        public async Task<APIResponseEntity<bool>> Update([FromBody] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.UserInfo.AddOrUpdateEntity> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.UserInfo.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                #region 限制修改角色

                if (!XCLCMS.Lib.Permission.PerHelper.HasPermission(base.CurrentUserModel.UserInfoID, XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_SetUserRole))
                {
                    request.Body.RoleIdList = null;
                }

                #endregion 限制修改角色

                #region 限制修改用户类别

                if (!XCLCMS.Lib.Permission.PerHelper.HasPermission(base.CurrentUserModel.UserInfoID, XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_SetUserType))
                {
                    request.Body.UserInfo.UserType = null;
                }

                #endregion 限制修改用户类别

                response = this.iUserInfoService.Update(request);

                return response;
            });
        }

        /// <summary>
        /// 删除用户信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_UserDel)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<List<long>> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (null != request.Body && request.Body.Count > 0)
                {
                    request.Body = request.Body.Where(k =>
                    {
                        var model = this.iUserInfoService.Detail(new APIRequestEntity<long>() { Body = k }).Body;
                        if (null == model)
                        {
                            return false;
                        }
                        if (base.IsOnlyCurrentMerchant && model.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                        {
                            return false;
                        }
                        return true;
                    }).ToList();
                }

                #endregion 限制商户

                return this.iUserInfoService.Delete(request);
            });
        }
    }
}