namespace XCLCMS.View.AdminWeb.Models.FriendLinks
{
    public class FriendLinksAddVM
    {
        /// <summary>
        /// 记录状态select的option
        /// </summary>
        public string RecordStateOptions { get; set; }

        public string FormAction { get; set; }

        public XCLCMS.Data.Model.View.v_FriendLinks FriendLinks { get; set; }
    }
}