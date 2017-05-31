namespace XCLCMS.View.AdminWeb.Models.Comments
{
    public class CommentsAddVM
    {
        /// <summary>
        /// 记录状态select的option
        /// </summary>
        public string RecordStateOptions { get; set; }

        public string FormAction { get; set; }

        public XCLCMS.Data.Model.Comments Comments { get; set; }

        /// <summary>
        /// 审核状态select的options
        /// </summary>
        public string VerifyStateOptions { get; set; }
    }
}