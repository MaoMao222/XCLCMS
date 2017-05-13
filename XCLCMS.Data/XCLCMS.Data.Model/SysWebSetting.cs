using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 网站配置表
    /// </summary>
    [Serializable]
    public partial class SysWebSetting
    {
        public SysWebSetting()
        { }

        #region Model

        private long _syswebsettingid;
        private string _keyname;
        private string _keyvalue;
        private string _testkeyvalue;
        private string _uatkeyvalue;
        private string _prdkeyvalue;
        private string _valuetype = "STR";
        private string _remark;
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
        /// SysWebSettingID
        /// </summary>
        public long SysWebSettingID
        {
            set { _syswebsettingid = value; }
            get { return _syswebsettingid; }
        }

        /// <summary>
        /// 键
        /// </summary>
        public string KeyName
        {
            set { _keyname = value; }
            get { return _keyname; }
        }

        /// <summary>
        /// 开发环境值
        /// </summary>
        public string KeyValue
        {
            set { _keyvalue = value; }
            get { return _keyvalue; }
        }

        /// <summary>
        /// 测试环境值
        /// </summary>
        public string TestKeyValue
        {
            set { _testkeyvalue = value; }
            get { return _testkeyvalue; }
        }

        /// <summary>
        /// UAT环境值
        /// </summary>
        public string UATKeyValue
        {
            set { _uatkeyvalue = value; }
            get { return _uatkeyvalue; }
        }

        /// <summary>
        /// 生产环境值
        /// </summary>
        public string PrdKeyValue
        {
            set { _prdkeyvalue = value; }
            get { return _prdkeyvalue; }
        }

        /// <summary>
        /// 值类型（SysWebSettingValueTypeEnum）
        /// </summary>
        public string ValueType
        {
            set { _valuetype = value; }
            get { return _valuetype; }
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

        #endregion Model
    }
}