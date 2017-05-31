namespace XCLCMS.View.AdminWeb.Models.Ads
{
    public class AdsAddVM
    {
        /// <summary>
        /// 记录状态select的option
        /// </summary>
        public string RecordStateOptions { get; set; }

        public string FormAction { get; set; }

        public XCLCMS.Data.Model.Ads Ads { get; set; }

        /// <summary>
        /// 广告类型select的options
        /// </summary>
        public string AdsTypeOptions { get; set; }

        /// <summary>
        /// 打开方式select的options
        /// </summary>
        public string URLOpenTypeOptions { get; set; }
    }
}