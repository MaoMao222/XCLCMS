using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 附件管理
    /// </summary>
    public class AttachmentController : BaseAPIController
    {
        private XCLCMS.IService.WebAPI.IAttachmentService iAttachmentService = null;

        /// <summary>
        /// 构造
        /// </summary>
        public AttachmentController(XCLCMS.IService.WebAPI.IAttachmentService attachmentService)
        {
            attachmentService.ContextInfo = base.ContextModel;
            this.iAttachmentService = attachmentService;
        }

        /// <summary>
        /// 查询附件信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.Attachment>> Detail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = this.iAttachmentService.Detail(request);

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
    }
}