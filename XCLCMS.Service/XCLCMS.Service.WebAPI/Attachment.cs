using System;
using System.Collections.Generic;
using System.Linq;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.Service.WebAPI
{
    /// <summary>
    /// 附件
    /// </summary>
    public class Attachment : BaseInfo
    {
        private XCLCMS.Data.BLL.Attachment attachmentBLL = new XCLCMS.Data.BLL.Attachment();
        private XCLCMS.Data.BLL.ObjectAttachment objectAttachmentBLL = new XCLCMS.Data.BLL.ObjectAttachment();

        public Attachment(XCLCMS.Data.Model.Custom.ContextModel contextModel) : base(contextModel)
        {
        }

        /// <summary>
        /// 查询附件信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.Attachment> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.Attachment>();
            response.Body = attachmentBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 根据附件关系信息查询附件列表
        /// </summary>
        public APIResponseEntity<List<XCLCMS.Data.Model.Attachment>> GetObjectAttachmentList(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.GetObjectAttachmentListEntity> request)
        {
            var response = new APIResponseEntity<List<XCLCMS.Data.Model.Attachment>>();
            var lst = this.objectAttachmentBLL.GetModelList((XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum)Enum.Parse(typeof(XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum), request.Body.ObjectType), request.Body.ObjectID);
            List<long> ids = new List<long>();
            if (null != lst && lst.Count > 0)
            {
                ids = lst.Select(k => k.FK_AttachmentID).ToList();
            }
            response.Body = this.attachmentBLL.GetList(ids);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 根据文件id，查询文件详情列表
        /// </summary>
        public APIResponseEntity<List<XCLCMS.Data.Model.Attachment>> GetAttachmentListByIDList(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.GetAttachmentListByIDListEntity> request)
        {
            var response = new APIResponseEntity<List<XCLCMS.Data.Model.Attachment>>();
            response.Body = this.attachmentBLL.GetList(request.Body.AttachmentIDList);
            response.IsSuccess = true;
            return response;
        }
    }
}