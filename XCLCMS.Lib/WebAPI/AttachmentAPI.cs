using System.Collections.Generic;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 附件API
    /// </summary>
    public static class AttachmentAPI
    {
        /// <summary>
        /// 查询附件信息实体
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.Custom.AttachmentWithSubModel> Detail(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.DetailEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.DetailEntity, XCLCMS.Data.Model.Custom.AttachmentWithSubModel>(request, "Attachment/Detail");
        }

        /// <summary>
        /// 根据附件关系信息查询附件列表
        /// </summary>
        public static APIResponseEntity<List<XCLCMS.Data.Model.Attachment>> GetObjectAttachmentList(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.GetObjectAttachmentListEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.GetObjectAttachmentListEntity, List<XCLCMS.Data.Model.Attachment>>(request, "Attachment/GetObjectAttachmentList");
        }

        /// <summary>
        /// 根据文件id，查询文件详情列表
        /// </summary>
        public static APIResponseEntity<List<XCLCMS.Data.Model.Attachment>> GetAttachmentListByIDList(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.GetAttachmentListByIDListEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.GetAttachmentListByIDListEntity, List<XCLCMS.Data.Model.Attachment>>(request, "Attachment/GetAttachmentListByIDList");
        }

        /// <summary>
        /// 附件分页列表
        /// </summary>
        public static APIResponseEntity<PageListResponseEntity<XCLCMS.Data.Model.View.v_Attachment>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            return Library.Request<PageListConditionEntity, PageListResponseEntity<XCLCMS.Data.Model.View.v_Attachment>>(request, "Attachment/PageList");
        }

        /// <summary>
        /// 添加附件信息
        /// </summary>
        public static APIResponseEntity<bool> Add(APIRequestEntity<Data.Model.Attachment> request)
        {
            return Library.Request<Data.Model.Attachment, bool>(request, "Attachment/Add", false);
        }

        /// <summary>
        /// 修改附件信息
        /// </summary>
        public static APIResponseEntity<bool> Update(APIRequestEntity<Data.Model.Attachment> request)
        {
            return Library.Request<Data.Model.Attachment, bool>(request, "Attachment/Update", false);
        }

        /// <summary>
        /// 删除附件信息
        /// </summary>
        public static APIResponseEntity<bool> Delete(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.FileInfo.DeleteEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.FileInfo.DeleteEntity, bool>(request, "Attachment/Delete", false);
        }
    }
}