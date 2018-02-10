using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 商户应用表
    /// </summary>
    [Serializable]
    public partial class MerchantApp
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

        /// <summary>
        /// 商户应用ID
        /// </summary>
        public long MerchantAppID
        {
            set { _merchantappid = value; }
            get { return _merchantappid; }
        }

        /// <summary>
        /// 商户应用名
        /// </summary>
        public string MerchantAppName
        {
            set { _merchantappname = value; }
            get { return _merchantappname; }
        }

        /// <summary>
        /// 所属商户ID
        /// </summary>
        public long FK_MerchantID
        {
            set { _fk_merchantid = value; }
            get { return _fk_merchantid; }
        }

        /// <summary>
        /// 商户应用key
        /// </summary>
        public string AppKey
        {
            set { _appkey = value; }
            get { return _appkey; }
        }

        /// <summary>
        /// 静态资源版本号
        /// </summary>
        public string ResourceVersion
        {
            set { _resourceversion = value; }
            get { return _resourceversion; }
        }

        /// <summary>
        /// 联系人邮箱
        /// </summary>
        public string Email
        {
            set { _email = value; }
            get { return _email; }
        }

        /// <summary>
        /// 底部版权信息
        /// </summary>
        public string CopyRight
        {
            set { _copyright = value; }
            get { return _copyright; }
        }

        /// <summary>
        /// Meta描述
        /// </summary>
        public string MetaDescription
        {
            set { _metadescription = value; }
            get { return _metadescription; }
        }

        /// <summary>
        /// MetaKey关键字
        /// </summary>
        public string MetaKeyWords
        {
            set { _metakeywords = value; }
            get { return _metakeywords; }
        }

        /// <summary>
        /// Meta标题
        /// </summary>
        public string MetaTitle
        {
            set { _metatitle = value; }
            get { return _metatitle; }
        }

        /// <summary>
        /// 站点网址
        /// </summary>
        public string WebURL
        {
            set { _weburl = value; }
            get { return _weburl; }
        }

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark
        {
            set { _remark = value; }
            get { return _remark; }
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