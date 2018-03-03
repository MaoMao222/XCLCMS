using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.WebAPI.Controllers
{
    public class KeyValueInfoController : BaseAPIController
    {
        private XCLCMS.IService.WebAPI.IKeyValueInfoService _iKeyValueInfoService = null;

        private XCLCMS.IService.WebAPI.IKeyValueInfoService iKeyValueInfoService
        {
            get
            {
                if (null != this._iKeyValueInfoService && null == this._iKeyValueInfoService.ContextInfo)
                {
                    this._iKeyValueInfoService.ContextInfo = base.ContextModel;
                }
                return this._iKeyValueInfoService;
            }
            set
            {
                this._iKeyValueInfoService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public KeyValueInfoController(XCLCMS.IService.WebAPI.IKeyValueInfoService KeyValueInfoService)
        {
            this.iKeyValueInfoService = KeyValueInfoService;
        }

        /// <summary>
        /// 查询信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.KeyValueInfo_View)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.View.v_KeyValueInfo>> Detail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = this.iKeyValueInfoService.Detail(request);

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
        /// 根据code来查询信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.KeyValueInfo_View)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.KeyValueInfo>> DetailByCode([FromUri] APIRequestEntity<string> request)
        {
            return await Task.Run(() =>
            {
                var response = this.iKeyValueInfoService.DetailByCode(request);

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
        /// 查询信息分页列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.KeyValueInfo_View)]
        public async Task<APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_KeyValueInfo>>> PageList([FromUri] APIRequestEntity<PageListConditionEntity> request)
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

                return this.iKeyValueInfoService.PageList(request);
            });
        }

        /// <summary>
        /// 检查code是否已存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistCode([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.IsExistCodeEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iKeyValueInfoService.IsExistCode(request);
            });
        }

        /// <summary>
        /// 新增信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.KeyValueInfo_Add)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.AddOrUpdateEntity> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.KeyValueInfo.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    var response = new APIResponseEntity<bool>();
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                return this.iKeyValueInfoService.Add(request);
            });
        }

        /// <summary>
        /// 修改信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.KeyValueInfo_Edit)]
        public async Task<APIResponseEntity<bool>> Update([FromBody] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.AddOrUpdateEntity> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.KeyValueInfo.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    var response = new APIResponseEntity<bool>();
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                return this.iKeyValueInfoService.Update(request);
            });
        }

        /// <summary>
        /// 删除信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.KeyValueInfo_Del)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<List<long>> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (null != request.Body && request.Body.Count > 0)
                {
                    request.Body = request.Body.Where(k =>
                    {
                        var model = this.iKeyValueInfoService.Detail(new APIRequestEntity<long>()
                        {
                            Body = k
                        }).Body;

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

                return this.iKeyValueInfoService.Delete(request);
            });
        }
    }
}