using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 订单表
    /// </summary>
    [Serializable]
    public partial class Orders
    {
        public Orders()
        { }

        #region Model

        private long _orderid;
        private long _fk_productid;
        private long _fk_merchantid = 0;
        private long _fk_merchantappid = 0;
        private long _fk_userid = 0;
        private string _username;
        private decimal _price = 0M;
        private string _paystatus;
        private string _paytype;
        private DateTime? _dealdonetime;
        private int _flowstatus = 0;
        private int _version;
        private string _remark;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;

        /// <summary>
        /// 订单ID
        /// </summary>
        public long OrderID
        {
            set { _orderid = value; }
            get { return _orderid; }
        }

        /// <summary>
        /// 所属产品
        /// </summary>
        public long FK_ProductID
        {
            set { _fk_productid = value; }
            get { return _fk_productid; }
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
        /// 所属用户
        /// </summary>
        public long FK_UserID
        {
            set { _fk_userid = value; }
            get { return _fk_userid; }
        }

        /// <summary>
        /// 所属用户名
        /// </summary>
        public string UserName
        {
            set { _username = value; }
            get { return _username; }
        }

        /// <summary>
        /// 金额
        /// </summary>
        public decimal Price
        {
            set { _price = value; }
            get { return _price; }
        }

        /// <summary>
        /// 支付状态(PayStatusEnum)
        /// </summary>
        public string PayStatus
        {
            set { _paystatus = value; }
            get { return _paystatus; }
        }

        /// <summary>
        /// 支付方式(PayTypeEnum)
        /// </summary>
        public string PayType
        {
            set { _paytype = value; }
            get { return _paytype; }
        }

        /// <summary>
        /// 成交时间
        /// </summary>
        public DateTime? DealDoneTime
        {
            set { _dealdonetime = value; }
            get { return _dealdonetime; }
        }

        /// <summary>
        /// 流水状态
        /// </summary>
        public int FlowStatus
        {
            set { _flowstatus = value; }
            get { return _flowstatus; }
        }

        /// <summary>
        /// 记录版本号
        /// </summary>
        public int Version
        {
            set { _version = value; }
            get { return _version; }
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

        #endregion Model
    }
}