using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 系统日志
    /// </summary>
    public class SysLogController : BaseAPIController
    {
        private XCLCMS.IService.WebAPI.ISysLogService _iSysLogService = null;

        private XCLCMS.IService.WebAPI.ISysLogService iSysLogService
        {
            get
            {
                if (null != this._iSysLogService && null == this._iSysLogService.ContextInfo)
                {
                    this._iSysLogService.ContextInfo = base.ContextModel;
                }
                return this._iSysLogService;
            }
            set
            {
                this._iSysLogService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public SysLogController(XCLCMS.IService.WebAPI.ISysLogService sysLogService)
        {
            this.iSysLogService = sysLogService;
        }

        /// <summary>
        /// 查询系统日志信息分页列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysLogView)]
        public async Task<APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.SysLog>>> PageList([FromUri] APIRequestEntity<PageListConditionEntity> request)
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

                return this.iSysLogService.PageList(request);
            });
        }

        /// <summary>
        /// 新增
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysLogAdd)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.Model.SysLog> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    var response = new APIResponseEntity<bool>();
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                return this.iSysLogService.Add(request);
            });
        }

        /// <summary>
        /// 批量删除系统日志信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysLogDel)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysLog.ClearConditionEntity> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (base.IsOnlyCurrentMerchant)
                {
                    request.Body.MerchantID = base.CurrentUserModel.FK_MerchantID;
                }

                #endregion 限制商户

                return this.iSysLogService.Delete(request);
            });
        }
    }
}