using System;
using System.Runtime.Serialization;

namespace XCLCMS.Data.WebAPIEntity.RequestEntity.UserCenter
{
    /// <summary>
    /// 用户基本信息
    /// </summary>
    [Serializable]
    [DataContract]
    public class UserBaseInfoEntity
    {
        /// <summary>
        /// 用户名
        /// </summary>
        [DataMember]
        public string UserName { get; set; }

        /// <summary>
        /// 真实姓名
        /// </summary>
        [DataMember]
        public string RealName { get; set; }

        /// <summary>
        /// 昵称
        /// </summary>
        [DataMember]
        public string NickName { get; set; }

        /// <summary>
        /// 性别
        /// </summary>
        [DataMember]
        public string SexType { get; set; }

        /// <summary>
        /// 出生日期
        /// </summary>
        [DataMember]
        public DateTime? Birthday { get; set; }

        /// <summary>
        /// 年龄
        /// </summary>
        [DataMember]
        public int Age { get; set; }

        /// <summary>
        /// 手机号
        /// </summary>
        [DataMember]
        public string Tel { get; set; }

        /// <summary>
        /// QQ
        /// </summary>
        [DataMember]
        public string QQ { get; set; }

        /// <summary>
        /// 电子邮件
        /// </summary>
        [DataMember]
        public string Email { get; set; }

        /// <summary>
        /// 其它联系方式
        /// </summary>
        [DataMember]
        public string OtherContact { get; set; }
    }
}