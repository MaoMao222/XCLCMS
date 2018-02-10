using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 附件表
    /// </summary>
    [Serializable]
    public partial class Attachment
    {
        private long _attachmentid;
        private long _parentid = 0;
        private string _originfilename;
        private string _filename;
        private string _title;
        private string _viewtype;
        private string _formattype;
        private string _ext;
        private string _url;
        private string _description;
        private int _downloadcount;
        private int _viewcount;
        private decimal _filesize = 0M;
        private int _imgwidth = 0;
        private int _imgheight = 0;
        private long _fk_merchantid = 0;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;

        /// <summary>
        /// AttachmentID
        /// </summary>
        public long AttachmentID
        {
            set { _attachmentid = value; }
            get { return _attachmentid; }
        }

        /// <summary>
        /// 主附件ID
        /// </summary>
        public long ParentID
        {
            set { _parentid = value; }
            get { return _parentid; }
        }

        /// <summary>
        /// 原始文件名
        /// </summary>
        public string OriginFileName
        {
            set { _originfilename = value; }
            get { return _originfilename; }
        }

        /// <summary>
        ///
        /// </summary>
        public string FileName
        {
            set { _filename = value; }
            get { return _filename; }
        }

        /// <summary>
        /// 附件标题
        /// </summary>
        public string Title
        {
            set { _title = value; }
            get { return _title; }
        }

        /// <summary>
        /// 附件查看类型(AttachmentViewTypeEnum)
        /// </summary>
        public string ViewType
        {
            set { _viewtype = value; }
            get { return _viewtype; }
        }

        /// <summary>
        /// 附件格式类型(AttachmentFormatTypeEnum)
        /// </summary>
        public string FormatType
        {
            set { _formattype = value; }
            get { return _formattype; }
        }

        /// <summary>
        /// 附件扩展名(不含点)
        /// </summary>
        public string Ext
        {
            set { _ext = value; }
            get { return _ext; }
        }

        /// <summary>
        /// 相对路径
        /// </summary>
        public string URL
        {
            set { _url = value; }
            get { return _url; }
        }

        /// <summary>
        /// 描述信息
        /// </summary>
        public string Description
        {
            set { _description = value; }
            get { return _description; }
        }

        /// <summary>
        /// 下载数
        /// </summary>
        public int DownLoadCount
        {
            set { _downloadcount = value; }
            get { return _downloadcount; }
        }

        /// <summary>
        /// 查看数
        /// </summary>
        public int ViewCount
        {
            set { _viewcount = value; }
            get { return _viewcount; }
        }

        /// <summary>
        /// 附件大小（kb）
        /// </summary>
        public decimal FileSize
        {
            set { _filesize = value; }
            get { return _filesize; }
        }

        /// <summary>
        /// 图片宽度（如果是图片）
        /// </summary>
        public int ImgWidth
        {
            set { _imgwidth = value; }
            get { return _imgwidth; }
        }

        /// <summary>
        /// 图片高度（如果是图片）
        /// </summary>
        public int ImgHeight
        {
            set { _imgheight = value; }
            get { return _imgheight; }
        }

        /// <summary>
        /// 所属商户号
        /// </summary>
        public long FK_MerchantID
        {
            set { _fk_merchantid = value; }
            get { return _fk_merchantid; }
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