using System;

namespace XCLCMS.Data.Model.View
{
    /// <summary>
    /// v_Ads:实体类(属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [Serializable]
    public partial class v_Ads
    {
        private long _adsid;
        private string _code;
        private string _adstype;
        private string _title;
        private string _contents;
        private int _adwidth;
        private int _adheight;
        private string _url;
        private string _urlopentype;
        private DateTime? _starttime;
        private DateTime? _endtime;
        private string _nickname;
        private string _email;
        private string _qq;
        private string _tel;
        private string _othercontact;
        private string _remark;
        private long _fk_merchantid;
        private long _fk_merchantappid;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;
        private string _merchantname;
        private string _merchantappname;

        /// <summary>
        ///
        /// </summary>
        public long AdsID
        {
            set { _adsid = value; }
            get { return _adsid; }
        }

        /// <summary>
        ///
        /// </summary>
        public string Code
        {
            set { _code = value; }
            get { return _code; }
        }

        /// <summary>
        ///
        /// </summary>
        public string AdsType
        {
            set { _adstype = value; }
            get { return _adstype; }
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
        public string Contents
        {
            set { _contents = value; }
            get { return _contents; }
        }

        /// <summary>
        ///
        /// </summary>
        public int AdWidth
        {
            set { _adwidth = value; }
            get { return _adwidth; }
        }

        /// <summary>
        ///
        /// </summary>
        public int AdHeight
        {
            set { _adheight = value; }
            get { return _adheight; }
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
        public string URLOpenType
        {
            set { _urlopentype = value; }
            get { return _urlopentype; }
        }

        /// <summary>
        ///
        /// </summary>
        public DateTime? StartTime
        {
            set { _starttime = value; }
            get { return _starttime; }
        }

        /// <summary>
        ///
        /// </summary>
        public DateTime? EndTime
        {
            set { _endtime = value; }
            get { return _endtime; }
        }

        /// <summary>
        ///
        /// </summary>
        public string NickName
        {
            set { _nickname = value; }
            get { return _nickname; }
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
        public string QQ
        {
            set { _qq = value; }
            get { return _qq; }
        }

        /// <summary>
        ///
        /// </summary>
        public string Tel
        {
            set { _tel = value; }
            get { return _tel; }
        }

        /// <summary>
        ///
        /// </summary>
        public string OtherContact
        {
            set { _othercontact = value; }
            get { return _othercontact; }
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
        public long FK_MerchantID
        {
            set { _fk_merchantid = value; }
            get { return _fk_merchantid; }
        }

        /// <summary>
        ///
        /// </summary>
        public long FK_MerchantAppID
        {
            set { _fk_merchantappid = value; }
            get { return _fk_merchantappid; }
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
        public string MerchantAppName
        {
            set { _merchantappname = value; }
            get { return _merchantappname; }
        }
    }
}