using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 商户管理
    /// </summary>
    public class MerchantController : BaseAPIController
    {
        private XCLCMS.IService.WebAPI.IMerchantService _iMerchantService = null;

        private XCLCMS.IService.WebAPI.IMerchantService iMerchantService
        {
            get
            {
                if (null != this._iMerchantService && null == this._iMerchantService.ContextInfo)
                {
                    this._iMerchantService.ContextInfo = base.ContextModel;
                }
                return this._iMerchantService;
            }
            set
            {
                this._iMerchantService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public MerchantController(XCLCMS.IService.WebAPI.IMerchantService merchantService, XCLCMS.IService.Logger.ILogService logService) : base(logService)
        {
            this.iMerchantService = merchantService;
        }

        /// <summary>
        /// 查询商户信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantView)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.Merchant>> Detail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = this.iMerchantService.Detail(request);

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && null != response.Body && response.Body.MerchantID != base.CurrentUserModel.FK_MerchantID)
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
        /// 查询商户信息分页列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantView)]
        public async Task<APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Merchant>>> PageList([FromUri] APIRequestEntity<PageListConditionEntity> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (base.IsOnlyCurrentMerchant)
                {
                    request.Body.Where = XCLNetTools.DataBase.SQLLibrary.JoinWithAnd(new List<string>() {
                    request.Body.Where,
                    string.Format("MerchantID={0}",base.CurrentUserModel.FK_MerchantID)
                });
                }

                #endregion 限制商户

                return this.iMerchantService.PageList(request);
            });
        }

        /// <summary>
        /// 查询所有商户键值形式的列表
        /// </summary>
        [HttpGet]
        public async Task<APIResponseEntity<List<XCLNetTools.Entity.TextValue>>> AllTextValueList([FromUri] APIRequestEntity<XCLCMS.Data.Model.Merchant> request)
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
                        string.Format("MerchantID={0}",base.CurrentUserModel.FK_MerchantID)
                    });
                }

                #endregion 限制商户

                return this.iMerchantService.AllTextValueList(req);
            });
        }

        /// <summary>
        /// 获取商户类型
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<Dictionary<string, long>>> GetMerchantTypeDic([FromUri] APIRequestEntity<object> request)
        {
            return await Task.Run(() =>
            {
                return this.iMerchantService.GetMerchantTypeDic(request);
            });
        }

        /// <summary>
        /// 判断商户名是否存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistMerchantName([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Merchant.IsExistMerchantNameEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iMerchantService.IsExistMerchantName(request);
            });
        }

        /// <summary>
        /// 新增商户信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantAdd)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.Model.Merchant> request)
        {
            return await Task.Run(() =>
            {
                return this.iMerchantService.Add(request);
            });
        }

        /// <summary>
        /// 修改商户信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantEdit)]
        public async Task<APIResponseEntity<bool>> Update([FromBody] APIRequestEntity<XCLCMS.Data.Model.Merchant> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                response = this.iMerchantService.Update(request);

                return response;
            });
        }

        /// <summary>
        /// 删除商户信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantDel)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<List<long>> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (null != request.Body && request.Body.Count > 0)
                {
                    request.Body = request.Body.Where(k =>
                    {
                        var model = this.iMerchantService.Detail(new APIRequestEntity<long>() { Body = k }).Body;
                        if (null == model)
                        {
                            return false;
                        }
                        if (base.IsOnlyCurrentMerchant && model.MerchantID != base.CurrentUserModel.FK_MerchantID)
                        {
                            return false;
                        }
                        return true;
                    }).ToList();
                }

                #endregion 限制商户

                return this.iMerchantService.Delete(request);
            });
        }
    }
}