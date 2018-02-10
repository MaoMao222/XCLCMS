using System.Collections.Generic;

namespace XCLCMS.View.AdminWeb.Models.KeyValueInfo
{
    public class KeyValueInfoAddVM
    {
        public string RecordStateOptions { get; set; }

        public string FormAction { get; set; }

        public XCLCMS.Data.Model.View.v_KeyValueInfo KeyValueInfo { get; set; }

        public List<long> KeyValueInfoTypeIDList { get; set; }
    }
}