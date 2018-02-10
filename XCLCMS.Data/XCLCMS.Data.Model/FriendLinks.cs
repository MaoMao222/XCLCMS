using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 友情链接表
    /// </summary>
    [Serializable]
    public partial class FriendLinks
    {
        private long _friendlinkid;
        private string _title;
        private string _description;
        private string _url;
        private string _contactname;
        private string _email;
        private string _qq;
        private string _tel;
        private string _remark;
        private string _othercontact;
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
        /// FriendLinkID
        /// </summary>
        public long FriendLinkID
        {
            set { _friendlinkid = value; }
            get { return _friendlinkid; }
        }

        /// <summary>
        /// 标题
        /// </summary>
        public string Title
        {
            set { _title = value; }
            get { return _title; }
        }

        /// <summary>
        /// 描述
        /// </summary>
        public string Description
        {
            set { _description = value; }
            get { return _description; }
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
        /// 联系人名
        /// </summary>
        public string ContactName
        {
            set { _contactname = value; }
            get { return _contactname; }
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
        /// 备注
        /// </summary>
        public string Remark
        {
            set { _remark = value; }
            get { return _remark; }
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