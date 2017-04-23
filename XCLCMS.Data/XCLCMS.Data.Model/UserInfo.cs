using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 用户信息表
    /// </summary>
    [Serializable]
    public partial class UserInfo
    {
        public UserInfo()
        { }

        #region Model

        private long _userinfoid;
        private string _username;
        private long _fk_merchantid = 0;
        private long _fk_merchantappid = 0;
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
        private string _usertype = "NON";
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

        /// <summary>
        /// UserInfoID
        /// </summary>
        public long UserInfoID
        {
            set { _userinfoid = value; }
            get { return _userinfoid; }
        }

        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName
        {
            set { _username = value; }
            get { return _username; }
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
        /// 真实姓名
        /// </summary>
        public string RealName
        {
            set { _realname = value; }
            get { return _realname; }
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
        /// 密码
        /// </summary>
        public string Pwd
        {
            set { _pwd = value; }
            get { return _pwd; }
        }

        /// <summary>
        /// 年龄
        /// </summary>
        public int Age
        {
            set { _age = value; }
            get { return _age; }
        }

        /// <summary>
        /// 性别(UserSexTypeEnum)
        /// </summary>
        public string SexType
        {
            set { _sextype = value; }
            get { return _sextype; }
        }

        /// <summary>
        /// 出生日期
        /// </summary>
        public DateTime? Birthday
        {
            set { _birthday = value; }
            get { return _birthday; }
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
        /// QQ
        /// </summary>
        public string QQ
        {
            set { _qq = value; }
            get { return _qq; }
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
        /// 其它联系方式
        /// </summary>
        public string OtherContact
        {
            set { _othercontact = value; }
            get { return _othercontact; }
        }

        /// <summary>
        /// 访问方式
        /// </summary>
        public string AccessType
        {
            set { _accesstype = value; }
            get { return _accesstype; }
        }

        /// <summary>
        /// 访问token
        /// </summary>
        public string AccessToken
        {
            set { _accesstoken = value; }
            get { return _accesstoken; }
        }

        /// <summary>
        /// 用户状态(UserStateEnum)
        /// </summary>
        public string UserState
        {
            set { _userstate = value; }
            get { return _userstate; }
        }

        /// <summary>
        /// 用户类型(UserTypeEnum)
        /// </summary>
        public string UserType
        {
            set { _usertype = value; }
            get { return _usertype; }
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
        /// 角色名(逗号分隔)
        /// </summary>
        public string RoleName
        {
            set { _rolename = value; }
            get { return _rolename; }
        }

        /// <summary>
        /// 角色最大权重
        /// </summary>
        public int? RoleMaxWeight
        {
            set { _rolemaxweight = value; }
            get { return _rolemaxweight; }
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

        #endregion Model
    }
}