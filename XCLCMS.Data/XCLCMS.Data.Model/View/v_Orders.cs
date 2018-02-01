using System;

namespace XCLCMS.Data.Model.View
{
    /// <summary>
    /// v_Orders:实体类(属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [Serializable]
    public partial class v_Orders
    {
        public v_Orders()
        { }

        #region Model

        private long _orderid;
        private long _fk_productid;
        private long _fk_merchantid;
        private long _fk_merchantappid;
        private long _fk_userid;
        private string _username;
        private decimal _price;
        private string _paystatus;
        private string _paytype;
        private DateTime? _dealdonetime;
        private string _remark;
        private string _recordstate;
        private int _flowstatus;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;
        private string _merchantname;
        private string _merchantappname;
        private string _productname;
        private decimal? _productprice;
        private string _productdesc;

        /// <summary>
        ///
        /// </summary>
        public long OrderID
        {
            set { _orderid = value; }
            get { return _orderid; }
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
        public decimal Price
        {
            set { _price = value; }
            get { return _price; }
        }

        /// <summary>
        ///
        /// </summary>
        public string PayStatus
        {
            set { _paystatus = value; }
            get { return _paystatus; }
        }

        /// <summary>
        ///
        /// </summary>
        public string PayType
        {
            set { _paytype = value; }
            get { return _paytype; }
        }

        /// <summary>
        ///
        /// </summary>
        public DateTime? DealDoneTime
        {
            set { _dealdonetime = value; }
            get { return _dealdonetime; }
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
        public int FlowStatus
        {
            set { _flowstatus = value; }
            get { return _flowstatus; }
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
        public decimal? ProductPrice
        {
            set { _productprice = value; }
            get { return _productprice; }
        }

        /// <summary>
        ///
        /// </summary>
        public string ProductDesc
        {
            set { _productdesc = value; }
            get { return _productdesc; }
        }

        #endregion Model
    }
}