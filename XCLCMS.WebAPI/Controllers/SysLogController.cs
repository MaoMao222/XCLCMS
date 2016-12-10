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
        private XCLCMS.Data.WebAPIBLL.SysLog bll = null;

        /// <summary>
        /// 构造
        /// </summary>
        public SysLogController()
        {
            this.bll = new XCLCMS.Data.WebAPIBLL.SysLog(base.ContextModel);
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

                return this.bll.PageList(request);
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
                return this.bll.Delete(request, base.IsOnlyCurrentMerchant ? base.CurrentUserModel.FK_MerchantID : 0);
            });
        }
    }
}