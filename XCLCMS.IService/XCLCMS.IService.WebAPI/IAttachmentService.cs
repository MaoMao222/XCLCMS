using System.Collections.Generic;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;

namespace XCLCMS.IService.WebAPI
{
    /// <summary>
    /// 附件服务
    /// </summary>
    public interface IAttachmentService : IBaseInfoService
    {
        APIResponseEntity<XCLCMS.Data.Model.Custom.AttachmentWithSubModel> Detail(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.DetailEntity> request);

        APIResponseEntity<List<Data.Model.Attachment>> GetAttachmentListByIDList(APIRequestEntity<GetAttachmentListByIDListEntity> request);

        APIResponseEntity<List<Data.Model.Attachment>> GetObjectAttachmentList(APIRequestEntity<GetObjectAttachmentListEntity> request);

        APIResponseEntity<PageListResponseEntity<v_Attachment>> PageList(APIRequestEntity<PageListConditionEntity> request);

        APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.Attachment> request);

        APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.Attachment> request);

        APIResponseEntity<bool> Delete(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.FileInfo.DeleteEntity> request);
    }
}