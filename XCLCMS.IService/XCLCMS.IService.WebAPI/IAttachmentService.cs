using System.Collections.Generic;
using XCLCMS.Data.Model;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment;

namespace XCLCMS.IService.WebAPI
{
    public interface IAttachmentService : IBaseInfoService
    {
        APIResponseEntity<Data.Model.Attachment> Detail(APIRequestEntity<long> request);

        APIResponseEntity<List<Data.Model.Attachment>> GetAttachmentListByIDList(APIRequestEntity<GetAttachmentListByIDListEntity> request);

        APIResponseEntity<List<Data.Model.Attachment>> GetObjectAttachmentList(APIRequestEntity<GetObjectAttachmentListEntity> request);
    }
}