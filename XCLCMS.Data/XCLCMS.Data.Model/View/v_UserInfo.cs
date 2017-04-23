using System;

namespace XCLCMS.Data.Model.View
{
    /// <summary>
    /// v_UserInfo:实体类(属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [Serializable]
    public partial class v_UserInfo
    {
        public v_UserInfo()
        { }

        #region Model

        private long _userinfoid;
        private string _username;
        private long _fk_merchantid;
        private long _fk_merchantappid;
        private string _realname;
        private string _nickname;
        private string _pwd;
        private int _age;
        private string _sextype;
        private DateTime? _birthday;
        private string _tel;
        private string _qq;
        private string _email;
        private string _othercontact;
        private string _accesstype;
        private string _accesstoken;
        private string _userstate;
        private string _usertype;
        private string _remark;
        private string _rolename;
        private int? _rolemaxweight;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;
        private string _merchantname;
        private string _merchantsystemtype;
        private string _merchantappname;

        /// <summary>
        ///
        /// </summary>
        public long UserInfoID
        {
            set { _userinfoid = value; }
            get { return _userinfoid; }
        }

        /// <summary>
        ///
        /// </summary>
        public string UserName
        {
            set { _username = value; }
            get { return _username; }
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
        public string RealName
        {
            set { _realname = value; }
            get { return _realname; }
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
        public string Pwd
        {
            set { _pwd = value; }
            get { return _pwd; }
        }

        /// <summary>
        ///
        /// </summary>
        public int Age
        {
            set { _age = value; }
            get { return _age; }
        }

        /// <summary>
        ///
        /// </summary>
        public string SexType
        {
            set { _sextype = value; }
            get { return _sextype; }
        }

        /// <summary>
        ///
        /// </summary>
        public DateTime? Birthday
        {
            set { _birthday = value; }
            get { return _birthday; }
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
        public string QQ
        {
            set { _qq = value; }
            get { return _qq; }
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
        public string OtherContact
        {
            set { _othercontact = value; }
            get { return _othercontact; }
        }

        /// <summary>
        ///
        /// </summary>
        public string AccessType
        {
            set { _accesstype = value; }
            get { return _accesstype; }
        }

        /// <summary>
        ///
        /// </summary>
        public string AccessToken
        {
            set { _accesstoken = value; }
            get { return _accesstoken; }
        }

        /// <summary>
        ///
        /// </summary>
        public string UserState
        {
            set { _userstate = value; }
            get { return _userstate; }
        }

        /// <summary>
        ///
        /// </summary>
        public string UserType
        {
            set { _usertype = value; }
            get { return _usertype; }
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
        public string RoleName
        {
            set { _rolename = value; }
            get { return _rolename; }
        }

        /// <summary>
        ///
        /// </summary>
        public int? RoleMaxWeight
        {
            set { _rolemaxweight = value; }
            get { return _rolemaxweight; }
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

        /// <summary>
        ///
        /// </summary>
        public string MerchantAppName
        {
            set { _merchantappname = value; }
            get { return _merchantappname; }
        }

        #endregion Model
    }
}