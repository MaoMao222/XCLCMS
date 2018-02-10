using System;

namespace XCLCMS.Data.Model.View
{
    /// <summary>
    /// v_KeyValueInfo:实体类(属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [Serializable]
    public partial class v_KeyValueInfo
    {
        public v_KeyValueInfo()
        { }

        #region Model

        private long _keyvalueinfoid;
        private string _code;
        private long _fk_productid;
        private long _fk_merchantid;
        private long _fk_merchantappid;
        private long _fk_userid;
        private string _username;
        private string _contents;
        private string _remark;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;
        private string _merchantname;
        private string _merchantappname;
        private string _productname;
        private string _keyvalueinfotypeids;
        private string _keyvalueinfotypenames;

        /// <summary>
        ///
        /// </summary>
        public long KeyValueInfoID
        {
            set { _keyvalueinfoid = value; }
            get { return _keyvalueinfoid; }
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
        public long FK_ProductID
        {
            set { _fk_productid = value; }
            get { return _fk_productid; }
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
        public long FK_UserID
        {
            set { _fk_userid = value; }
            get { return _fk_userid; }
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
        public string Contents
        {
            set { _contents = value; }
            get { return _contents; }
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

        /// <summary>
        ///
        /// </summary>
        public string ProductName
        {
            set { _productname = value; }
            get { return _productname; }
        }

        /// <summary>
        ///
        /// </summary>
        public string KeyValueInfoTypeIDs
        {
            set { _keyvalueinfotypeids = value; }
            get { return _keyvalueinfotypeids; }
        }

        /// <summary>
        ///
        /// </summary>
        public string KeyValueInfoTypeNames
        {
            set { _keyvalueinfotypenames = value; }
            get { return _keyvalueinfotypenames; }
        }

        #endregion Model
    }
}