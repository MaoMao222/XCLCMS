using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 系统字典表
    /// </summary>
    [Serializable]
    public partial class SysDic
    {
        private long _sysdicid;
        private string _code;
        private long _parentid;
        private string _dicname;
        private string _dicvalue;
        private int _sort;
        private string _remark;
        private long? _fk_functionid;
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
        /// SysDicID
        /// </summary>
        public long SysDicID
        {
            set { _sysdicid = value; }
            get { return _sysdicid; }
        }

        /// <summary>
        /// 字典标识
        /// </summary>
        public string Code
        {
            set { _code = value; }
            get { return _code; }
        }

        /// <summary>
        /// 父ID
        /// </summary>
        public long ParentID
        {
            set { _parentid = value; }
            get { return _parentid; }
        }

        /// <summary>
        /// 键
        /// </summary>
        public string DicName
        {
            set { _dicname = value; }
            get { return _dicname; }
        }

        /// <summary>
        /// 值
        /// </summary>
        public string DicValue
        {
            set { _dicvalue = value; }
            get { return _dicvalue; }
        }

        /// <summary>
        /// 排序号
        /// </summary>
        public int Sort
        {
            set { _sort = value; }
            get { return _sort; }
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
        /// 所属功能ID
        /// </summary>
        public long? FK_FunctionID
        {
            set { _fk_functionid = value; }
            get { return _fk_functionid; }
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