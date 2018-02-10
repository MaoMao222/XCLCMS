using System;

namespace XCLCMS.Data.Model.View
{
    /// <summary>
    /// v_Merchant:实体类(属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [Serializable]
    public partial class v_Merchant
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
        private string _merchanttypename;
        private string _passtypename;

        /// <summary>
        ///
        /// </summary>
        public long MerchantID
        {
            set { _merchantid = value; }
            get { return _merchantid; }
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
        public long FK_MerchantType
        {
            set { _fk_merchanttype = value; }
            get { return _fk_merchanttype; }
        }

        /// <summary>
        ///
        /// </summary>
        public string MerchantSystemType
        {
            set { _merchantsystemtype = value; }
            get { return _merchantsystemtype; }
        }

        /// <summary>
        ///
        /// </summary>
        public string Domain
        {
            set { _domain = value; }
            get { return _domain; }
        }

        /// <summary>
        ///
        /// </summary>
        public string LogoURL
        {
            set { _logourl = value; }
            get { return _logourl; }
        }

        /// <summary>
        ///
        /// </summary>
        public string ContactName
        {
            set { _contactname = value; }
            get { return _contactname; }
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
        public string Landline
        {
            set { _landline = value; }
            get { return _landline; }
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
        public long FK_PassType
        {
            set { _fk_passtype = value; }
            get { return _fk_passtype; }
        }

        /// <summary>
        ///
        /// </summary>
        public string PassNumber
        {
            set { _passnumber = value; }
            get { return _passnumber; }
        }

        /// <summary>
        ///
        /// </summary>
        public string Address
        {
            set { _address = value; }
            get { return _address; }
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
        public string MerchantRemark
        {
            set { _merchantremark = value; }
            get { return _merchantremark; }
        }

        /// <summary>
        ///
        /// </summary>
        public DateTime? RegisterTime
        {
            set { _registertime = value; }
            get { return _registertime; }
        }

        /// <summary>
        ///
        /// </summary>
        public string MerchantState
        {
            set { _merchantstate = value; }
            get { return _merchantstate; }
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
        public string MerchantTypeName
        {
            set { _merchanttypename = value; }
            get { return _merchanttypename; }
        }

        /// <summary>
        ///
        /// </summary>
        public string PassTypeName
        {
            set { _passtypename = value; }
            get { return _passtypename; }
        }
    }
}