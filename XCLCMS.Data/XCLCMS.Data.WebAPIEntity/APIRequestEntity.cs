using System;
using System.Runtime.Serialization;

namespace XCLCMS.Data.WebAPIEntity
{
    /// <summary>
    /// web api request实体
    /// </summary>
    [Serializable]
    [DataContract]
    public class APIRequestEntity<TBody>
    {
        /// <summary>
        /// token
        /// </summary>
        [DataMember]
        public string UserToken { get; set; }

        /// <summary>
        /// 来源ip
        /// </summary>
        [DataMember]
        public string ClientIP { get; set; }

        /// <summary>
        /// url
        /// </summary>
        [DataMember]
        public string Url { get; set; }

        /// <summary>
        /// 来源url
        /// </summary>
        [DataMember]
        public string Reffer { get; set; }

        /// <summary>
        /// 请求ID
        /// </summary>
        [DataMember]
        public string RequestID { get; } = Guid.NewGuid().ToString("N");

        /// <summary>
        /// request的数据
        /// </summary>
        [DataMember]
        public TBody Body { get; set; }

        /// <summary>
        /// 应用程序商户应用号
        /// </summary>
        [DataMember]
        public long AppID { get; set; }

        /// <summary>
        /// 应用程序AppKey
        /// </summary>
        [DataMember]
        public string AppKey { get; set; }
    }
}