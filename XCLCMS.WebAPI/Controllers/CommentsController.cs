using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 评论管理
    /// </summary>
    public class CommentsController : BaseAPIController
    {
        private XCLCMS.IService.WebAPI.ICommentsService _iCommentsService = null;

        private XCLCMS.IService.WebAPI.ICommentsService iCommentsService
        {
            get
            {
                if (null != this._iCommentsService && null == this._iCommentsService.ContextInfo)
                {
                    this._iCommentsService.ContextInfo = base.ContextModel;
                }
                return this._iCommentsService;
            }
            set
            {
                this._iCommentsService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public CommentsController(XCLCMS.IService.WebAPI.ICommentsService commentsService, XCLCMS.IService.Logger.ILogService logService) : base(logService)
        {
            this.iCommentsService = commentsService;
        }

        /// <summary>
        /// 查询评论信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Comments_View)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.Comments>> Detail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = this.iCommentsService.Detail(request);

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
        /// 查询评论信息分页列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Comments_View)]
        public async Task<APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Comments>>> PageList([FromUri] APIRequestEntity<PageListConditionEntity> request)
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

                return this.iCommentsService.PageList(request);
            });
        }
        

        /// <summary>
        /// 新增评论信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Comments_Add)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.Model.Comments> request)
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

                return this.iCommentsService.Add(request);
            });
        }

        /// <summary>
        /// 修改评论信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Comments_Edit)]
        public async Task<APIResponseEntity<bool>> Update([FromBody] APIRequestEntity<XCLCMS.Data.Model.Comments> request)
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

                return this.iCommentsService.Update(request);
            });
        }

        /// <summary>
        /// 删除评论信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Comments_Del)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<List<long>> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (null != request.Body && request.Body.Count > 0)
                {
                    request.Body = request.Body.Where(k =>
                    {
                        var model = this.iCommentsService.Detail(new APIRequestEntity<long>()
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

                return this.iCommentsService.Delete(request);
            });
        }
    }
}