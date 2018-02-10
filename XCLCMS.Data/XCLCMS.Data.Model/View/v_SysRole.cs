using System;

namespace XCLCMS.Data.Model.View
{
    /// <summary>
    /// v_SysRole:实体类(属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [Serializable]
    public partial class v_SysRole
    {
        private long? _sysroleid;
        private long? _parentid;
        private string _rolename;
        private string _code;
        private int? _sort;
        private int? _weight;
        private string _remark;
        private long? _fk_merchantid;
        private string _recordstate;
        private DateTime? _createtime;
        private long? _createrid;
        private string _creatername;
        private DateTime? _updatetime;
        private long? _updaterid;
        private string _updatername;
        private int? _nodelevel;
        private int _isleaf;
        private int _isroot;
        private string _merchantname;
        private string _merchantsystemtype;

        /// <summary>
        ///
        /// </summary>
        public long? SysRoleID
        {
            set { _sysroleid = value; }
            get { return _sysroleid; }
        }

        /// <summary>
        ///
        /// </summary>
        public long? ParentID
        {
            set { _parentid = value; }
            get { return _parentid; }
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
        public string Code
        {
            set { _code = value; }
            get { return _code; }
        }

        /// <summary>
        ///
        /// </summary>
        public int? Sort
        {
            set { _sort = value; }
            get { return _sort; }
        }

        /// <summary>
        ///
        /// </summary>
        public int? Weight
        {
            set { _weight = value; }
            get { return _weight; }
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
        public long? FK_MerchantID
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
        public DateTime? CreateTime
        {
            set { _createtime = value; }
            get { return _createtime; }
        }

        /// <summary>
        ///
        /// </summary>
        public long? CreaterID
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
        public DateTime? UpdateTime
        {
            set { _updatetime = value; }
            get { return _updatetime; }
        }

        /// <summary>
        ///
        /// </summary>
        public long? UpdaterID
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
        public int? NodeLevel
        {
            set { _nodelevel = value; }
            get { return _nodelevel; }
        }

        /// <summary>
        ///
        /// </summary>
        public int IsLeaf
        {
            set { _isleaf = value; }
            get { return _isleaf; }
        }

        /// <summary>
        ///
        /// </summary>
        public int IsRoot
        {
            set { _isroot = value; }
            get { return _isroot; }
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