using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 系统配置 管理
    /// </summary>
    public class SysWebSettingController : BaseAPIController
    {
        private XCLCMS.IService.WebAPI.ISysWebSettingService _iSysWebSettingService = null;

        private XCLCMS.IService.WebAPI.ISysWebSettingService iSysWebSettingService
        {
            get
            {
                if (null != this._iSysWebSettingService && null == this._iSysWebSettingService.ContextInfo)
                {
                    this._iSysWebSettingService.ContextInfo = base.ContextModel;
                }
                return this._iSysWebSettingService;
            }
            set
            {
                this._iSysWebSettingService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public SysWebSettingController(XCLCMS.IService.WebAPI.ISysWebSettingService sysWebSettingService, XCLCMS.IService.Logger.ILogService logService) : base(logService)
        {
            this.iSysWebSettingService = sysWebSettingService;
        }

        /// <summary>
        /// 查询系统配置信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysWebSettingView)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.SysWebSetting>> Detail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = this.iSysWebSettingService.Detail(request);

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
        /// 查询系统配置分页列表
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_SysWebSetting>>> PageList([FromUri] APIRequestEntity<PageListConditionEntity> request)
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

                return this.iSysWebSettingService.PageList(request);
            });
        }

        /// <summary>
        /// 判断系统配置名是否存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistKeyName([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysWebSetting.IsExistKeyNameEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysWebSettingService.IsExistKeyName(request);
            });
        }

        /// <summary>
        /// 新增系统配置信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysWebSettingAdd)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.Model.SysWebSetting> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                response = this.iSysWebSettingService.Add(request);

                return response;
            });
        }

        /// <summary>
        /// 修改系统配置信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysWebSettingEdit)]
        public async Task<APIResponseEntity<bool>> Update([FromBody] APIRequestEntity<XCLCMS.Data.Model.SysWebSetting> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                response = this.iSysWebSettingService.Update(request);

                return response;
            });
        }

        /// <summary>
        /// 删除系统配置信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysWebSettingDel)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<List<long>> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (null != request.Body && request.Body.Count > 0)
                {
                    request.Body = request.Body.Where(k =>
                    {
                        var model = this.iSysWebSettingService.Detail(new APIRequestEntity<long>() { Body = k }).Body;
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

                return this.iSysWebSettingService.Delete(request);
            });
        }
    }
}