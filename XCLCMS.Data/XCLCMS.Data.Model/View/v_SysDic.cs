using System;

namespace XCLCMS.Data.Model.View
{
    /// <summary>
    /// v_SysDic:实体类(属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [Serializable]
    public partial class v_SysDic
    {
        private long? _sysdicid;
        private string _code;
        private long? _parentid;
        private string _dicname;
        private string _dicvalue;
        private int? _sort;
        private string _remark;
        private long? _fk_functionid;
        private long? _fk_merchantid;
        private long? _fk_merchantappid;
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

        /// <summary>
        ///
        /// </summary>
        public long? SysDicID
        {
            set { _sysdicid = value; }
            get { return _sysdicid; }
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
        public long? ParentID
        {
            set { _parentid = value; }
            get { return _parentid; }
        }

        /// <summary>
        ///
        /// </summary>
        public string DicName
        {
            set { _dicname = value; }
            get { return _dicname; }
        }

        /// <summary>
        ///
        /// </summary>
        public string DicValue
        {
            set { _dicvalue = value; }
            get { return _dicvalue; }
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
        public string Remark
        {
            set { _remark = value; }
            get { return _remark; }
        }

        /// <summary>
        ///
        /// </summary>
        public long? FK_FunctionID
        {
            set { _fk_functionid = value; }
            get { return _fk_functionid; }
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
        public long? FK_MerchantAppID
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
    }
}