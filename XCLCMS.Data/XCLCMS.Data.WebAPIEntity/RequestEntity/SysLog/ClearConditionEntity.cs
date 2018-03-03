using System;
using System.Runtime.Serialization;

namespace XCLCMS.Data.WebAPIEntity.RequestEntity.SysLog
{
    [Serializable]
    [DataContract]
    public class ClearConditionEntity
    {
        [DataMember]
        public DateTime? StartTime { get; set; }

        [DataMember]
        public DateTime? EndTime { get; set; }

        [DataMember]
        public long MerchantID { get; set; }
    }
}