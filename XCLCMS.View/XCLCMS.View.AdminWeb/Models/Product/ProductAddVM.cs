namespace XCLCMS.View.AdminWeb.Models.Product
{
    public class ProductAddVM
    {
        /// <summary>
        /// 记录状态select的option
        /// </summary>
        public string RecordStateOptions { get; set; }

        public string SaleTypeOptions { get; set; }

        public string PayedActionTypeOptions { get; set; }

        public string FormAction { get; set; }

        public XCLCMS.Data.Model.View.v_Product Product { get; set; }
    }
}