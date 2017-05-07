using System;
using System.Collections.Generic;

namespace XCLCMS.Data.Model.Custom
{
    /// <summary>
    /// 带有相关联的附件信息的附件实体
    /// </summary>
    [Serializable]
    public class AttachmentWithSubModel
    {
        /// <summary>
        /// 主附件
        /// </summary>
        public XCLCMS.Data.Model.View.v_Attachment Attachment { get; set; }

        /// <summary>
        /// 相关附件列表
        /// </summary>
        public List<XCLCMS.Data.Model.Attachment> SubAttachmentList { get; set; }
    }
}