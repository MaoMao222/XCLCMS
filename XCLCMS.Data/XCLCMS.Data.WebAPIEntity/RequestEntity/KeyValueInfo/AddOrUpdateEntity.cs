using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo
{
    [DataContract]
    [Serializable]
    public class AddOrUpdateEntity
    {
        [DataMember]
        public XCLCMS.Data.Model.KeyValueInfo KeyValueInfo { get; set; }

        [DataMember]
        public List<long> KeyValueInfoTypeIDList { get; set; }
    }
}