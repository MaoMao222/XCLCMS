using System;
using System.Runtime.Serialization;

namespace XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment
{
    [Serializable]
    [DataContract]
    public class DetailEntity
    {
        /// <summary>
        /// 附件ID
        /// </summary>
        [DataMember]
        public long AttachmentID { get; set; }

        /// <summary>
        /// 是否需要包含相关附件信息
        /// </summary>
        [DataMember]
        public bool IsContainsSubAttachmentList { get; set; }
    }
}