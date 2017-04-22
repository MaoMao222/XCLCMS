using System;
using System.Runtime.Serialization;

namespace XCLCMS.Data.WebAPIEntity.RequestEntity.UserCenter
{
    /// <summary>
    /// 商户信息
    /// </summary>
    [Serializable]
    [DataContract]
    public class MerchantInfoEntity
    {
        /// <summary>
        /// 商户ID
        /// </summary>
        [DataMember]
        public long MerchantID { get; set; }

        /// <summary>
        /// 绑定的域名
        /// </summary>
        [DataMember]
        public string Domain { get; set; }

        /// <summary>
        /// 联系人
        /// </summary>
        [DataMember]
        public string ContactName { get; set; }

        /// <summary>
        /// 手机
        /// </summary>
        [DataMember]
        public string Tel { get; set; }

        /// <summary>
        /// 固话
        /// </summary>
        [DataMember]
        public string Landline { get; set; }

        /// <summary>
        /// 电子邮件
        /// </summary>
        [DataMember]
        public string Email { get; set; }

        /// <summary>
        /// qq
        /// </summary>
        [DataMember]
        public string QQ { get; set; }

        /// <summary>
        /// 证件类型（参见字典库）
        /// </summary>
        [DataMember]
        public long FK_PassType { get; set; }

        /// <summary>
        /// 证件号
        /// </summary>
        [DataMember]
        public string PassNumber { get; set; }

        /// <summary>
        /// 地址
        /// </summary>
        [DataMember]
        public string Address { get; set; }

        /// <summary>
        /// 其它联系信息
        /// </summary>
        [DataMember]
        public string OtherContact { get; set; }
    }
}