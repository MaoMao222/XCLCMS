using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 附件管理
    /// </summary>
    public class AttachmentController : BaseAPIController
    {
        private XCLCMS.IService.WebAPI.IAttachmentService _iAttachmentService = null;

        private XCLCMS.IService.WebAPI.IAttachmentService iAttachmentService
        {
            get
            {
                if (null != this._iAttachmentService && null == this._iAttachmentService.ContextInfo)
                {
                    this._iAttachmentService.ContextInfo = base.ContextModel;
                }
                return this._iAttachmentService;
            }
            set
            {
                this._iAttachmentService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public AttachmentController(XCLCMS.IService.WebAPI.IAttachmentService attachmentService, XCLCMS.IService.Logger.ILogService logService) : base(logService)
        {
            this.iAttachmentService = attachmentService;
        }

        /// <summary>
        /// 查询附件信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.Custom.AttachmentWithSubModel>> Detail([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.DetailEntity> request)
        {
            return await Task.Run(() =>
            {
                var response = this.iAttachmentService.Detail(request);
                return response;
            });
        }

        /// <summary>
        /// 根据附件关系信息查询附件列表
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.Attachment>>> GetObjectAttachmentList([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.GetObjectAttachmentListEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iAttachmentService.GetObjectAttachmentList(request);
            });
        }

        /// <summary>
        /// 根据文件id，查询文件详情列表
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.Attachment>>> GetAttachmentListByIDList([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.GetAttachmentListByIDListEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iAttachmentService.GetAttachmentListByIDList(request);
            });
        }

        /// <summary>
        /// 附件分页列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FileManager_LogicFileView)]
        public async Task<APIResponseEntity<PageListResponseEntity<XCLCMS.Data.Model.View.v_Attachment>>> PageList([FromUri]   APIRequestEntity<PageListConditionEntity> request)
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

                return this.iAttachmentService.PageList(request);
            });
        }

        /// <summary>
        /// 添加附件信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FileManager_FileAdd)]
        public async Task<APIResponseEntity<bool>> Add([FromBody]  APIRequestEntity<Data.Model.Attachment> request)
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

                return this.iAttachmentService.Add(request);
            });
        }

        /// <summary>
        /// 修改附件信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FileManager_LogicFileUpdate)]
        public async Task<APIResponseEntity<bool>> Update([FromBody]  APIRequestEntity<Data.Model.Attachment> request)
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

                return this.iAttachmentService.Update(request);
            });
        }

        /// <summary>
        /// 删除附件信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FileManager_LogicFileDel)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.FileInfo.DeleteEntity> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (null != request.Body && request.Body.IDList.Count > 0)
                {
                    request.Body.IDList = request.Body.IDList.Where(k =>
                    {
                        var model = this.iAttachmentService.Detail(new APIRequestEntity<Data.WebAPIEntity.RequestEntity.Attachment.DetailEntity>()
                        {
                            Body = new Data.WebAPIEntity.RequestEntity.Attachment.DetailEntity()
                            {
                                AttachmentID = k
                            }
                        }).Body.Attachment;
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

                return this.iAttachmentService.Delete(request);
            });
        }
    }
}