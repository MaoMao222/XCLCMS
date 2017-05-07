using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 文章管理
    /// </summary>
    public class ArticleController : BaseAPIController
    {
        private XCLCMS.IService.WebAPI.IArticleService _iArticleService = null;

        private XCLCMS.IService.WebAPI.IArticleService iArticleService
        {
            get
            {
                if (null != this._iArticleService && null == this._iArticleService.ContextInfo)
                {
                    this._iArticleService.ContextInfo = base.ContextModel;
                }
                return this._iArticleService;
            }
            set
            {
                this._iArticleService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public ArticleController(XCLCMS.IService.WebAPI.IArticleService articleService, XCLCMS.IService.Logger.ILogService logService) : base(logService)
        {
            this.iArticleService = articleService;
        }

        /// <summary>
        /// 查询文章信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_ArticleView)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.View.v_Article>> Detail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = this.iArticleService.Detail(request);

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
        /// 查询指定文章关联的其它文章信息
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_ArticleView)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.Custom.ArticleRelationDetailModel>> RelationDetail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                return this.iArticleService.RelationDetail(request);
            });
        }

        /// <summary>
        /// 查询文章信息分页列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_ArticleView)]
        public async Task<APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Article>>> PageList([FromUri] APIRequestEntity<PageListConditionEntity> request)
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

                return this.iArticleService.PageList(request);
            });
        }

        /// <summary>
        /// 查询文章信息分页列表(简单分页)
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_ArticleView)]
        public async Task<APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Article>>> SimplePageList([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Article.SimplePageListEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iArticleService.SimplePageList(request);
            });
        }

        /// <summary>
        /// 检查文章code是否已存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistCode([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Article.IsExistCodeEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iArticleService.IsExistCode(request);
            });
        }

        /// <summary>
        /// 新增文章信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_ArticleAdd)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Article.AddOrUpdateEntity> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.Article.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    var response = new APIResponseEntity<bool>();
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                return this.iArticleService.Add(request);
            });
        }

        /// <summary>
        /// 修改文章信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_ArticleEdit)]
        public async Task<APIResponseEntity<bool>> Update([FromBody] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Article.AddOrUpdateEntity> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.Article.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    var response = new APIResponseEntity<bool>();
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                return this.iArticleService.Update(request);
            });
        }

        /// <summary>
        /// 删除文章信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_ArticleDel)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<List<long>> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (null != request.Body && request.Body.Count > 0)
                {
                    request.Body = request.Body.Where(k =>
                    {
                        var articleModel = this.iArticleService.Detail(new APIRequestEntity<long>()
                        {
                            Body = k
                        }).Body;

                        if (null == articleModel)
                        {
                            return false;
                        }
                        if (base.IsOnlyCurrentMerchant && articleModel.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                        {
                            return false;
                        }
                        return true;
                    }).ToList();
                }

                #endregion 限制商户

                return this.iArticleService.Delete(request);
            });
        }
    }
}