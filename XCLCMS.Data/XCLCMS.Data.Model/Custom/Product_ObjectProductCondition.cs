using System;

namespace XCLCMS.Data.Model.Custom
{
    [Serializable]
    public class Product_ObjectProductCondition
    {
        public string ObjectType { get; set; }

        public long ObjectID { get; set; }

        public long FK_MerchantID { get; set; }

        public long FK_MerchantAppID { get; set; }

        public string RecordState { get; set; } = "N";
    }
}