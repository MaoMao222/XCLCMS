using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace XCLCMS.Data.WebAPIEntity.RequestEntity.Orders
{
    [Serializable]
    [DataContract]
    public class UserProductOrderQueryEntity
    {
        [DataMember]
        public long UserID { get; set; }

        [DataMember]
        public string UserName { get; set; }

        [DataMember]
        public long ProductID { get; set; }
    }
}