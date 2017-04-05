using System;
using System.Runtime.Serialization;

namespace XCLCMS.Data.WebAPIEntity.RequestEntity.UserCenter
{
    /// <summary>
    /// 密码信息
    /// </summary>
    [Serializable]
    [DataContract]
    public class PasswordEntity
    {
        /// <summary>
        /// 用户id
        /// </summary>
        [DataMember]
        public long UserInfoID { get; set; }

        /// <summary>
        /// 原密码明文
        /// </summary>
        [DataMember]
        public string OldPwd { get; set; }

        /// <summary>
        /// 新密码明文
        /// </summary>
        [DataMember]
        public string NewPwd { get; set; }
    }
}