using System;

namespace XCLCMS.Data.Model.View
{
    /// <summary>
    /// v_Attachment:实体类(属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [Serializable]
    public partial class v_Attachment
    {
        private long _attachmentid;
        private long _parentid;
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
        private decimal _filesize;
        private int _imgwidth;
        private int _imgheight;
        private long _fk_merchantid;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;
        private string _merchantname;

        /// <summary>
        ///
        /// </summary>
        public long AttachmentID
        {
            set { _attachmentid = value; }
            get { return _attachmentid; }
        }

        /// <summary>
        ///
        /// </summary>
        public long ParentID
        {
            set { _parentid = value; }
            get { return _parentid; }
        }

        /// <summary>
        ///
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
        ///
        /// </summary>
        public string Title
        {
            set { _title = value; }
            get { return _title; }
        }

        /// <summary>
        ///
        /// </summary>
        public string ViewType
        {
            set { _viewtype = value; }
            get { return _viewtype; }
        }

        /// <summary>
        ///
        /// </summary>
        public string FormatType
        {
            set { _formattype = value; }
            get { return _formattype; }
        }

        /// <summary>
        ///
        /// </summary>
        public string Ext
        {
            set { _ext = value; }
            get { return _ext; }
        }

        /// <summary>
        ///
        /// </summary>
        public string URL
        {
            set { _url = value; }
            get { return _url; }
        }

        /// <summary>
        ///
        /// </summary>
        public string Description
        {
            set { _description = value; }
            get { return _description; }
        }

        /// <summary>
        ///
        /// </summary>
        public int DownLoadCount
        {
            set { _downloadcount = value; }
            get { return _downloadcount; }
        }

        /// <summary>
        ///
        /// </summary>
        public int ViewCount
        {
            set { _viewcount = value; }
            get { return _viewcount; }
        }

        /// <summary>
        ///
        /// </summary>
        public decimal FileSize
        {
            set { _filesize = value; }
            get { return _filesize; }
        }

        /// <summary>
        ///
        /// </summary>
        public int ImgWidth
        {
            set { _imgwidth = value; }
            get { return _imgwidth; }
        }

        /// <summary>
        ///
        /// </summary>
        public int ImgHeight
        {
            set { _imgheight = value; }
            get { return _imgheight; }
        }

        /// <summary>
        ///
        /// </summary>
        public long FK_MerchantID
        {
            set { _fk_merchantid = value; }
            get { return _fk_merchantid; }
        }

        /// <summary>
        ///
        /// </summary>
        public string RecordState
        {
            set { _recordstate = value; }
            get { return _recordstate; }
        }

        /// <summary>
        ///
        /// </summary>
        public DateTime CreateTime
        {
            set { _createtime = value; }
            get { return _createtime; }
        }

        /// <summary>
        ///
        /// </summary>
        public long CreaterID
        {
            set { _createrid = value; }
            get { return _createrid; }
        }

        /// <summary>
        ///
        /// </summary>
        public string CreaterName
        {
            set { _creatername = value; }
            get { return _creatername; }
        }

        /// <summary>
        ///
        /// </summary>
        public DateTime UpdateTime
        {
            set { _updatetime = value; }
            get { return _updatetime; }
        }

        /// <summary>
        ///
        /// </summary>
        public long UpdaterID
        {
            set { _updaterid = value; }
            get { return _updaterid; }
        }

        /// <summary>
        ///
        /// </summary>
        public string UpdaterName
        {
            set { _updatername = value; }
            get { return _updatername; }
        }

        /// <summary>
        ///
        /// </summary>
        public string MerchantName
        {
            set { _merchantname = value; }
            get { return _merchantname; }
        }
    }
}