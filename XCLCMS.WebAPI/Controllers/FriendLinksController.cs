using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 友情链接 管理
    /// </summary>
    public class FriendLinksController : BaseAPIController
    {
        private XCLCMS.Data.BLL.FriendLinks friendLinksBLL = new Data.BLL.FriendLinks();
        private XCLCMS.Data.WebAPIBLL.FriendLinks bll = null;

        /// <summary>
        /// 构造
        /// </summary>
        public FriendLinksController()
        {
            this.bll = new XCLCMS.Data.WebAPIBLL.FriendLinks(base.ContextModel);
        }

        /// <summary>
        /// 查询友情链接信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FriendLinks_View)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.FriendLinks>> Detail([FromUri] APIRequestEntity<long> request)
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
        /// 查询友情链接信息分页列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FriendLinks_View)]
        public async Task<APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_FriendLinks>>> PageList([FromUri] APIRequestEntity<PageListConditionEntity> request)
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
        /// 判断友情链接标题是否存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistTitle([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.FriendLinks.IsExistTitleEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.bll.IsExistTitle(request);
            });
        }

        /// <summary>
        /// 新增友情链接信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FriendLinks_Add)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.Model.FriendLinks> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && null != request.Body && request.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能在自己的商户下新增数据！";
                    return response;
                }

                #endregion 限制商户

                response = this.bll.Add(request);

                return response;
            });
        }

        /// <summary>
        /// 修改友情链接信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FriendLinks_Edit)]
        public async Task<APIResponseEntity<bool>> Update([FromBody] APIRequestEntity<XCLCMS.Data.Model.FriendLinks> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && null != request.Body && request.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能修改自己的商户信息！";
                    return response;
                }

                #endregion 限制商户

                response = this.bll.Update(request);

                return response;
            });
        }

        /// <summary>
        /// 删除友情链接信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FriendLinks_Del)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<List<long>> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (null != request.Body && request.Body.Count > 0)
                {
                    request.Body = request.Body.Where(k =>
                    {
                        var model = this.friendLinksBLL.GetModel(k);
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

                return this.bll.Delete(request);
            });
        }
    }
}