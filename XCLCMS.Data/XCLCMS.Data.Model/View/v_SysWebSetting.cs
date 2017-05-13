using System;

namespace XCLCMS.Data.Model.View
{
    /// <summary>
    /// v_SysWebSetting:实体类(属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [Serializable]
    public partial class v_SysWebSetting
    {
        public v_SysWebSetting()
        { }

        #region Model

        private long _syswebsettingid;
        private string _keyname;
        private string _keyvalue;
        private string _testkeyvalue;
        private string _uatkeyvalue;
        private string _prdkeyvalue;
        private string _valuetype;
        private string _remark;
        private long _fk_merchantid;
        private long _fk_merchantappid;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;
        private string _merchantname;
        private string _merchantappname;

        /// <summary>
        ///
        /// </summary>
        public long SysWebSettingID
        {
            set { _syswebsettingid = value; }
            get { return _syswebsettingid; }
        }

        /// <summary>
        ///
        /// </summary>
        public string KeyName
        {
            set { _keyname = value; }
            get { return _keyname; }
        }

        /// <summary>
        ///
        /// </summary>
        public string KeyValue
        {
            set { _keyvalue = value; }
            get { return _keyvalue; }
        }

        /// <summary>
        ///
        /// </summary>
        public string TestKeyValue
        {
            set { _testkeyvalue = value; }
            get { return _testkeyvalue; }
        }

        /// <summary>
        ///
        /// </summary>
        public string UATKeyValue
        {
            set { _uatkeyvalue = value; }
            get { return _uatkeyvalue; }
        }

        /// <summary>
        ///
        /// </summary>
        public string PrdKeyValue
        {
            set { _prdkeyvalue = value; }
            get { return _prdkeyvalue; }
        }

        /// <summary>
        ///
        /// </summary>
        public string ValueType
        {
            set { _valuetype = value; }
            get { return _valuetype; }
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
        public string MerchantAppName
        {
            set { _merchantappname = value; }
            get { return _merchantappname; }
        }

        #endregion Model
    }
}