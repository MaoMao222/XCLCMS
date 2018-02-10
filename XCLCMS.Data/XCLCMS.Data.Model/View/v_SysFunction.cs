using System;

namespace XCLCMS.Data.Model.View
{
    /// <summary>
    /// v_SysFunction:实体类(属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [Serializable]
    public partial class v_SysFunction
    {
        private long? _sysfunctionid;
        private long? _parentid;
        private string _functionname;
        private string _code;
        private string _remark;
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

        /// <summary>
        ///
        /// </summary>
        public long? SysFunctionID
        {
            set { _sysfunctionid = value; }
            get { return _sysfunctionid; }
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
        public string FunctionName
        {
            set { _functionname = value; }
            get { return _functionname; }
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
    }
}