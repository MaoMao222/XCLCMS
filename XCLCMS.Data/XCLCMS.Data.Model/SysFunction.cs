using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 系统功能表
    /// </summary>
    [Serializable]
    public partial class SysFunction
    {
        private long _sysfunctionid;
        private long _parentid;
        private string _functionname;
        private string _code;
        private string _remark;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;

        /// <summary>
        ///
        /// </summary>
        public long SysFunctionID
        {
            set { _sysfunctionid = value; }
            get { return _sysfunctionid; }
        }

        /// <summary>
        ///
        /// </summary>
        public long ParentID
        {
            set { _parentid = value; }
            get { return _parentid; }
        }

        /// <summary>
        /// 功能名
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