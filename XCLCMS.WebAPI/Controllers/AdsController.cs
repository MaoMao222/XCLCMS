using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 广告位管理
    /// </summary>
    public class AdsController : BaseAPIController
    {
        private XCLCMS.Data.WebAPIBLL.Ads bll = null;
        private XCLCMS.Data.BLL.Ads adsBLL = new Data.BLL.Ads();

        /// <summary>
        /// 构造
        /// </summary>
        public AdsController()
        {
            this.bll = new Data.WebAPIBLL.Ads(base.ContextModel);
        }

        /// <summary>
        /// 查询广告信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Lib.Permission.Function.FunctionEnum.Ads_View)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.Ads>> Detail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = this.bll.Detail(request);

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && null != response.Body && response.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.Body = null;
                    response.IsSuccess = false;
                }

                #endregion 限制商户

                return response;
            });
        }

        /// <summary>
        /// 查询广告信息分页列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Lib.Permission.Function.FunctionEnum.Ads_View)]
        public async Task<APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Ads>>> PageList([FromUri] APIRequestEntity<PageListConditionEntity> request)
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
        /// 检查广告code是否已存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistCode([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Ads.IsExistCodeEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.IsExistCode(request);
            });
        }

        /// <summary>
        /// 新增广告信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Lib.Permission.Function.FunctionEnum.Ads_Add)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.Model.Ads> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    var response = new APIResponseEntity<bool>();
                    response.IsSuccess = false;
                    response.Message = "只能新增自己的商户信息！";
                    return response;
                }

                #endregion 限制商户

                return this.bll.Add(request);
            });
        }

        /// <summary>
        /// 修改广告信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Lib.Permission.Function.FunctionEnum.Ads_Edit)]
        public async Task<APIResponseEntity<bool>> Update([FromBody] APIRequestEntity<XCLCMS.Data.Model.Ads> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    var response = new APIResponseEntity<bool>();
                    response.IsSuccess = false;
                    response.Message = "只能修改自己的商户信息！";
                    return response;
                }

                #endregion 限制商户

                return this.bll.Update(request);
            });
        }

        /// <summary>
        /// 删除广告信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Lib.Permission.Function.FunctionEnum.Ads_Del)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<List<long>> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (base.IsOnlyCurrentMerchant)
                {
                    if (request.Body.Exists(id =>
                    {
                        var model = this.adsBLL.GetModel(id);
                        return null != model && model.FK_MerchantID != base.CurrentUserModel.FK_MerchantID;
                    }))
                    {
                        var response = new APIResponseEntity<bool>();
                        response.IsSuccess = false;
                        response.Message = "只能删除属于自己的商户数据！";
                        return response;
                    }
                }

                #endregion 限制商户

                return this.bll.Delete(request);
            });
        }
    }
}