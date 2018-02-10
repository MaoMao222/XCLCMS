using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 所有附件关系表
    /// </summary>
    [Serializable]
    public partial class ObjectAttachment
    {
        private string _objecttype;
        private long _fk_objectid;
        private long _fk_attachmentid;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;

        /// <summary>
        /// 附件所属主体类别(ObjectTypeEnum)
        /// </summary>
        public string ObjectType
        {
            set { _objecttype = value; }
            get { return _objecttype; }
        }

        /// <summary>
        /// 附件所属主体ID
        /// </summary>
        public long FK_ObjectID
        {
            set { _fk_objectid = value; }
            get { return _fk_objectid; }
        }

        /// <summary>
        /// 附件ID
        /// </summary>
        public long FK_AttachmentID
        {
            set { _fk_attachmentid = value; }
            get { return _fk_attachmentid; }
        }

        /// <summary>
        /// 记录状态(RecordStateEnum)
        /// </summary>
        public string RecordState
        {
            set { _recordstate = value; }
            get { return _recordstate; }
        }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime
        {
            set { _createtime = value; }
            get { return _createtime; }
        }

        /// <summary>
        /// 创建者ID
        /// </summary>
        public long CreaterID
        {
            set { _createrid = value; }
            get { return _createrid; }
        }

        /// <summary>
        /// 创建者名
        /// </summary>
        public string CreaterName
        {
            set { _creatername = value; }
            get { return _creatername; }
        }

        /// <summary>
        /// 更新时间
        /// </summary>
        public DateTime UpdateTime
        {
            set { _updatetime = value; }
            get { return _updatetime; }
        }

        /// <summary>
        /// 更新人ID
        /// </summary>
        public long UpdaterID
        {
            set { _updaterid = value; }
            get { return _updaterid; }
        }

        /// <summary>
        /// 更新人名
        /// </summary>
        public string UpdaterName
        {
            set { _updatername = value; }
            get { return _updatername; }
        }
    }
}