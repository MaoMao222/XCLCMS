using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 产品表
    /// </summary>
    [Serializable]
    public partial class Product
    {
        private long _productid;
        private long _fk_merchantid = 0;
        private long _fk_merchantappid = 0;
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

        /// <summary>
        /// 产品ID
        /// </summary>
        public long ProductID
        {
            set { _productid = value; }
            get { return _productid; }
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
        /// 名称
        /// </summary>
        public string ProductName
        {
            set { _productname = value; }
            get { return _productname; }
        }

        /// <summary>
        /// 产品描述
        /// </summary>
        public string Description
        {
            set { _description = value; }
            get { return _description; }
        }

        /// <summary>
        /// 售价
        /// </summary>
        public decimal Price
        {
            set { _price = value; }
            get { return _price; }
        }

        /// <summary>
        /// 销售方式(SaleTypeEnum)
        /// </summary>
        public string SaleType
        {
            set { _saletype = value; }
            get { return _saletype; }
        }

        /// <summary>
        /// 销售标题
        /// </summary>
        public string SaleTitle
        {
            set { _saletitle = value; }
            get { return _saletitle; }
        }

        /// <summary>
        /// 购买成功后处理方式(PayedActionTypeEnum)
        /// </summary>
        public string PayedActionType
        {
            set { _payedactiontype = value; }
            get { return _payedactiontype; }
        }

        /// <summary>
        /// 购买成功后展示内容
        /// </summary>
        public string PayedRemark
        {
            set { _payedremark = value; }
            get { return _payedremark; }
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