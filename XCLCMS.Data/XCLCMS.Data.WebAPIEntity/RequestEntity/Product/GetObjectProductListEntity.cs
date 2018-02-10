using System;
using System.Runtime.Serialization;

namespace XCLCMS.Data.WebAPIEntity.RequestEntity.Product
{
    [Serializable]
    [DataContract]
    public class GetObjectProductListEntity
    {
        [DataMember]
        public string ObjectType { get; set; }

        [DataMember]
        public long ObjectID { get; set; }
    }
}