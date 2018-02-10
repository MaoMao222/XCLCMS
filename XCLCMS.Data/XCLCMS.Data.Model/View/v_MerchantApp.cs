using System;

namespace XCLCMS.Data.Model.View
{
    /// <summary>
    /// v_MerchantApp:实体类(属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [Serializable]
    public partial class v_MerchantApp
    {
        private long _merchantappid;
        private string _merchantappname;
        private long _fk_merchantid;
        private string _appkey;
        private string _resourceversion;
        private string _email;
        private string _copyright;
        private string _metadescription;
        private string _metakeywords;
        private string _metatitle;
        private string _weburl;
        private string _remark;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;
        private string _merchantname;
        private string _merchantsystemtype;

        /// <summary>
        ///
        /// </summary>
        public long MerchantAppID
        {
            set { _merchantappid = value; }
            get { return _merchantappid; }
        }

        /// <summary>
        ///
        /// </summary>
        public string MerchantAppName
        {
            set { _merchantappname = value; }
            get { return _merchantappname; }
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
        public string AppKey
        {
            set { _appkey = value; }
            get { return _appkey; }
        }

        /// <summary>
        ///
        /// </summary>
        public string ResourceVersion
        {
            set { _resourceversion = value; }
            get { return _resourceversion; }
        }

        /// <summary>
        ///
        /// </summary>
        public string Email
        {
            set { _email = value; }
            get { return _email; }
        }

        /// <summary>
        ///
        /// </summary>
        public string CopyRight
        {
            set { _copyright = value; }
            get { return _copyright; }
        }

        /// <summary>
        ///
        /// </summary>
        public string MetaDescription
        {
            set { _metadescription = value; }
            get { return _metadescription; }
        }

        /// <summary>
        ///
        /// </summary>
        public string MetaKeyWords
        {
            set { _metakeywords = value; }
            get { return _metakeywords; }
        }

        /// <summary>
        ///
        /// </summary>
        public string MetaTitle
        {
            set { _metatitle = value; }
            get { return _metatitle; }
        }

        /// <summary>
        ///
        /// </summary>
        public string WebURL
        {
            set { _weburl = value; }
            get { return _weburl; }
        }

        /// <summary>
        ///
        /// </summary>
        public string Remark
        {
            set { _remark = value; }
            get { return _remark; }
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

        /// <summary>
        ///
        /// </summary>
        public string MerchantSystemType
        {
            set { _merchantsystemtype = value; }
            get { return _merchantsystemtype; }
        }
    }
}