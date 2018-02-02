namespace XCLCMS.View.AdminWeb.Models.Orders
{
    public class OrdersAddVM
    {
        /// <summary>
        /// 记录状态select的option
        /// </summary>
        public string RecordStateOptions { get; set; }

        /// <summary>
        /// 支付方式select的option
        /// </summary>
        public string PayTypeOptions { get; set; }

        public string FormAction { get; set; }

        public XCLCMS.Data.Model.View.v_Orders Orders { get; set; }
    }
}