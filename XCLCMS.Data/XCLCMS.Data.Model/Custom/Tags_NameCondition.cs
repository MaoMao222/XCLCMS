using System;

namespace XCLCMS.Data.Model.Custom
{
    [Serializable]
    public class Tags_NameCondition
    {
        public string TagName { get; set; }

        public long FK_MerchantID { get; set; }

        public long FK_MerchantAppID { get; set; }
    }
}