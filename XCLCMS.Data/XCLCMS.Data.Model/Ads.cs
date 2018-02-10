using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 广告表
    /// </summary>
    [Serializable]
    public partial class Ads
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
        private long _fk_merchantid = 0;
        private long _fk_merchantappid = 0;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;

        /// <summary>
        /// AdsID
        /// </summary>
        public long AdsID
        {
            set { _adsid = value; }
            get { return _adsid; }
        }

        /// <summary>
        /// 唯一标识
        /// </summary>
        public string Code
        {
            set { _code = value; }
            get { return _code; }
        }

        /// <summary>
        /// 广告类型(AdsTypeEnum)
        /// </summary>
        public string AdsType
        {
            set { _adstype = value; }
            get { return _adstype; }
        }

        /// <summary>
        /// 广告标题
        /// </summary>
        public string Title
        {
            set { _title = value; }
            get { return _title; }
        }

        /// <summary>
        /// 广告内容
        /// </summary>
        public string Contents
        {
            set { _contents = value; }
            get { return _contents; }
        }

        /// <summary>
        /// 宽度
        /// </summary>
        public int AdWidth
        {
            set { _adwidth = value; }
            get { return _adwidth; }
        }

        /// <summary>
        /// 高度
        /// </summary>
        public int AdHeight
        {
            set { _adheight = value; }
            get { return _adheight; }
        }

        /// <summary>
        /// 链接地址
        /// </summary>
        public string URL
        {
            set { _url = value; }
            get { return _url; }
        }

        /// <summary>
        /// 打开方式(URLOpenTypeEnum)
        /// </summary>
        public string URLOpenType
        {
            set { _urlopentype = value; }
            get { return _urlopentype; }
        }

        /// <summary>
        /// 开始时间
        /// </summary>
        public DateTime? StartTime
        {
            set { _starttime = value; }
            get { return _starttime; }
        }

        /// <summary>
        /// 结束时间
        /// </summary>
        public DateTime? EndTime
        {
            set { _endtime = value; }
            get { return _endtime; }
        }

        /// <summary>
        /// 昵称
        /// </summary>
        public string NickName
        {
            set { _nickname = value; }
            get { return _nickname; }
        }

        /// <summary>
        /// 电子邮件
        /// </summary>
        public string Email
        {
            set { _email = value; }
            get { return _email; }
        }

        /// <summary>
        /// QQ
        /// </summary>
        public string QQ
        {
            set { _qq = value; }
            get { return _qq; }
        }

        /// <summary>
        /// 手机号
        /// </summary>
        public string Tel
        {
            set { _tel = value; }
            get { return _tel; }
        }

        /// <summary>
        /// 其它联系方式
        /// </summary>
        public string OtherContact
        {
            set { _othercontact = value; }
            get { return _othercontact; }
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
        /// 所属商户号
        /// </summary>
        public long FK_MerchantID
        {
            set { _fk_merchantid = value; }
            get { return _fk_merchantid; }
        }

        /// <summary>
        /// 所属应用号
        /// </summary>
        public long FK_MerchantAppID
        {
            set { _fk_merchantappid = value; }
            get { return _fk_merchantappid; }
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