using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace XCLCMS.Data.WebAPIEntity.RequestEntity.FileInfo
{
    [DataContract]
    [Serializable]
    public class DeleteEntity
    {
        [DataMember]
        public List<long> IDList { get; set; }

        [DataMember]
        public string RootPath { get; set; }

        [DataMember]
        public string TopPath { get; set; }
    }
}