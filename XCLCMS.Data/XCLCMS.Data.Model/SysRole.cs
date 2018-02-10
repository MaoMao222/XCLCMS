using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 角色表
    /// </summary>
    [Serializable]
    public partial class SysRole
    {
        private long _sysroleid;
        private long _parentid;
        private string _rolename;
        private string _code;
        private int _sort;
        private int? _weight;
        private string _remark;
        private long _fk_merchantid = 0;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;

        /// <summary>
        /// SysRoleID
        /// </summary>
        public long SysRoleID
        {
            set { _sysroleid = value; }
            get { return _sysroleid; }
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
        /// 角色名
        /// </summary>
        public string RoleName
        {
            set { _rolename = value; }
            get { return _rolename; }
        }

        /// <summary>
        /// 角色标识
        /// </summary>
        public string Code
        {
            set { _code = value; }
            get { return _code; }
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
        /// 权重
        /// </summary>
        public int? Weight
        {
            set { _weight = value; }
            get { return _weight; }
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
        /// 所属商户号
        /// </summary>
        public long FK_MerchantID
        {
            set { _fk_merchantid = value; }
            get { return _fk_merchantid; }
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