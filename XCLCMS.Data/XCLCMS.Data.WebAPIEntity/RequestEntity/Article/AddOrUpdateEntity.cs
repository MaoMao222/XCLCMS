using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace XCLCMS.Data.WebAPIEntity.RequestEntity.Article
{
    [DataContract]
    [Serializable]
    public class AddOrUpdateEntity
    {
        [DataMember]
        public XCLCMS.Data.Model.Article Article { get; set; }

        [DataMember]
        public List<long> ArticleTypeIDList { get; set; }

        [DataMember]
        public List<long> ArticleAttachmentIDList { get; set; }

        [DataMember]
        public List<long> ArticleProductIDList { get; set; }
    }
}