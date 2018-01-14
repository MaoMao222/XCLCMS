namespace XCLCMS.View.AdminWeb.Models.Merchant
{
    public class MerchantAppAddVM
    {
        /// <summary>
        /// 表单action
        /// </summary>
        public string FormAction { get; set; }

        /// <summary>
        /// 商户应用model
        /// </summary>
        public XCLCMS.Data.Model.View.v_MerchantApp MerchantApp { get; set; }

        /// <summary>
        /// 记录状态select的options
        /// </summary>
        public string RecordStateOptions { get; set; }
    }
}