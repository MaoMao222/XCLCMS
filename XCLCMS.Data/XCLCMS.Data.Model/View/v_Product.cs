using System;

namespace XCLCMS.Data.Model.View
{
    /// <summary>
    /// v_Product:实体类(属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [Serializable]
    public partial class v_Product
    {
        private long _productid;
        private long _fk_merchantid;
        private long _fk_merchantappid;
        private string _productname;
        private string _description;
        private decimal _price;
        private string _saletype;
        private string _saletitle;
        private string _payedactiontype;
        private string _payedremark;
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

        /// <summary>
        ///
        /// </summary>
        public long ProductID
        {
            set { _productid = value; }
            get { return _productid; }
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
        public string ProductName
        {
            set { _productname = value; }
            get { return _productname; }
        }

        /// <summary>
        ///
        /// </summary>
        public string Description
        {
            set { _description = value; }
            get { return _description; }
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
        public string SaleType
        {
            set { _saletype = value; }
            get { return _saletype; }
        }

        /// <summary>
        ///
        /// </summary>
        public string SaleTitle
        {
            set { _saletitle = value; }
            get { return _saletitle; }
        }

        /// <summary>
        ///
        /// </summary>
        public string PayedActionType
        {
            set { _payedactiontype = value; }
            get { return _payedactiontype; }
        }

        /// <summary>
        ///
        /// </summary>
        public string PayedRemark
        {
            set { _payedremark = value; }
            get { return _payedremark; }
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
    }
}