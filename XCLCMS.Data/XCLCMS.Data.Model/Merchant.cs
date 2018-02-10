using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 商户表
    /// </summary>
    [Serializable]
    public partial class Merchant
    {
        private long _merchantid;
        private string _merchantname;
        private long _fk_merchanttype;
        private string _merchantsystemtype;
        private string _domain;
        private string _logourl;
        private string _contactname;
        private string _tel;
        private string _landline;
        private string _email;
        private string _qq;
        private long _fk_passtype;
        private string _passnumber;
        private string _address;
        private string _othercontact;
        private string _merchantremark;
        private DateTime? _registertime;
        private string _merchantstate;
        private string _remark;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;

        /// <summary>
        /// 商户ID
        /// </summary>
        public long MerchantID
        {
            set { _merchantid = value; }
            get { return _merchantid; }
        }

        /// <summary>
        /// 商户名
        /// </summary>
        public string MerchantName
        {
            set { _merchantname = value; }
            get { return _merchantname; }
        }

        /// <summary>
        /// 商户类型(参见字典库)
        /// </summary>
        public long FK_MerchantType
        {
            set { _fk_merchanttype = value; }
            get { return _fk_merchanttype; }
        }

        /// <summary>
        /// 商户系统类型(MerchantSystemTypeEnum)
        /// </summary>
        public string MerchantSystemType
        {
            set { _merchantsystemtype = value; }
            get { return _merchantsystemtype; }
        }

        /// <summary>
        /// 绑定的域名
        /// </summary>
        public string Domain
        {
            set { _domain = value; }
            get { return _domain; }
        }

        /// <summary>
        /// logo图片地址
        /// </summary>
        public string LogoURL
        {
            set { _logourl = value; }
            get { return _logourl; }
        }

        /// <summary>
        /// 联系人
        /// </summary>
        public string ContactName
        {
            set { _contactname = value; }
            get { return _contactname; }
        }

        /// <summary>
        /// 手机
        /// </summary>
        public string Tel
        {
            set { _tel = value; }
            get { return _tel; }
        }

        /// <summary>
        /// 固话
        /// </summary>
        public string Landline
        {
            set { _landline = value; }
            get { return _landline; }
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
        /// qq
        /// </summary>
        public string QQ
        {
            set { _qq = value; }
            get { return _qq; }
        }

        /// <summary>
        /// 证件类型（参见字典库）
        /// </summary>
        public long FK_PassType
        {
            set { _fk_passtype = value; }
            get { return _fk_passtype; }
        }

        /// <summary>
        /// 证件号
        /// </summary>
        public string PassNumber
        {
            set { _passnumber = value; }
            get { return _passnumber; }
        }

        /// <summary>
        /// 地址
        /// </summary>
        public string Address
        {
            set { _address = value; }
            get { return _address; }
        }

        /// <summary>
        /// 其它联系信息
        /// </summary>
        public string OtherContact
        {
            set { _othercontact = value; }
            get { return _othercontact; }
        }

        /// <summary>
        /// 商户备注信息
        /// </summary>
        public string MerchantRemark
        {
            set { _merchantremark = value; }
            get { return _merchantremark; }
        }

        /// <summary>
        /// 注册时间
        /// </summary>
        public DateTime? RegisterTime
        {
            set { _registertime = value; }
            get { return _registertime; }
        }

        /// <summary>
        /// 商户状态(MerchantStateEnum)
        /// </summary>
        public string MerchantState
        {
            set { _merchantstate = value; }
            get { return _merchantstate; }
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