using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 商户应用管理
    /// </summary>
    public class MerchantAppController : BaseAPIController
    {
        private XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();
        private XCLCMS.IService.WebAPI.IMerchantAppService _iMerchantAppService = null;

        private XCLCMS.IService.WebAPI.IMerchantAppService iMerchantAppService
        {
            get
            {
                if (null != this._iMerchantAppService && null == this._iMerchantAppService.ContextInfo)
                {
                    this._iMerchantAppService.ContextInfo = base.ContextModel;
                }
                return this._iMerchantAppService;
            }
            set
            {
                this._iMerchantAppService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public MerchantAppController(XCLCMS.IService.WebAPI.IMerchantAppService merchantAppService, XCLCMS.IService.Logger.ILogService logService) : base(logService)
        {
            this.iMerchantAppService = merchantAppService;
        }

        /// <summary>
        /// 查询商户应用信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantAppView)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.MerchantApp>> Detail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = this.iMerchantAppService.Detail(request);

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
        /// 根据加密后的AppKey查询商户信息
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.Custom.MerchantAppInfoModel>> DetailByAppKey([FromUri] APIRequestEntity<object> request)
        {
            return await Task.Run(() =>
            {
                return this.iMerchantAppService.DetailByAppKey(request);
            });
        }

        /// <summary>
        /// 查询商户应用信息分页列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantAppView)]
        public async Task<APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_MerchantApp>>> PageList([FromUri] APIRequestEntity<PageListConditionEntity> request)
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

                return this.iMerchantAppService.PageList(request);
            });
        }

        /// <summary>
        /// 查询所有商户应用键值形式的列表
        /// </summary>
        [HttpGet]
        public async Task<APIResponseEntity<List<XCLNetTools.Entity.TextValue>>> AllTextValueList([FromUri] APIRequestEntity<XCLCMS.Data.Model.MerchantApp> request)
        {
            return await Task.Run(() =>
            {
                var req = new APIRequestEntity<PageListConditionEntity>();
                req.Body = new PageListConditionEntity();

                #region 限制商户

                if (base.IsOnlyCurrentMerchant)
                {
                    req.Body.Where = XCLNetTools.DataBase.SQLLibrary.JoinWithAnd(new List<string>() {
                        req.Body.Where,
                        string.Format("FK_MerchantID={0}",base.CurrentUserModel.FK_MerchantID)
                    });
                }

                #endregion 限制商户

                if (request.Body?.FK_MerchantID > 0)
                {
                    req.Body.Where = XCLNetTools.DataBase.SQLLibrary.JoinWithAnd(new List<string>() {
                        req.Body.Where,
                        string.Format("FK_MerchantID={0}",request.Body?.FK_MerchantID)
                    });
                }

                return this.iMerchantAppService.AllTextValueList(req);
            });
        }

        /// <summary>
        /// 判断商户应用名是否存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistMerchantAppName([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.MerchantApp.IsExistMerchantAppNameEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iMerchantAppService.IsExistMerchantAppName(request);
            });
        }

        /// <summary>
        /// 新增商户应用信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantAppAdd)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.Model.MerchantApp> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && null != request.Body && request.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                response = this.iMerchantAppService.Add(request);

                return response;
            });
        }

        /// <summary>
        /// 修改商户应用信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantAppEdit)]
        public async Task<APIResponseEntity<bool>> Update([FromBody] APIRequestEntity<XCLCMS.Data.Model.MerchantApp> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && null != request.Body && request.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                response = this.iMerchantAppService.Update(request);

                return response;
            });
        }

        /// <summary>
        /// 删除商户应用信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantAppDel)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<List<long>> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (null != request.Body && request.Body.Count > 0)
                {
                    request.Body = request.Body.Where(k =>
                    {
                        var model = this.merchantAppBLL.GetModel(k);
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

                return this.iMerchantAppService.Delete(request);
            });
        }
    }
}