using System;

namespace XCLCMS.Data.CommonHelper
{
    /// <summary>
    /// 加密解密相关
    /// </summary>
    public class EncryptHelper
    {
        /// <summary>
        /// 用户登录密码key
        /// </summary>
        public const string PwdKey = "XCL1989";

        /// <summary>
        /// 通用des加密key
        /// </summary>
        public const string DESKey = "XCL1989";

        /// <summary>
        /// 给字符串md5加密（使用key）
        /// </summary>
        public static string EncryptStringMD5(string str)
        {
            return XCLNetTools.Encrypt.MD5.EncodeMD5(str, PwdKey);
        }

        /// <summary>
        /// 给字符串md5加密（使用key）
        /// </summary>
        public static string EncryptStringMD5(string str, string key)
        {
            return XCLNetTools.Encrypt.MD5.EncodeMD5(str, key);
        }

        /// <summary>
        /// 判断使用md5明文和密文是否匹配
        /// </summary>
        public static bool EncryptStringMD5IsEqual(string str, string md5Str, string key)
        {
            return XCLNetTools.Encrypt.MD5.IsEqualMD5(str, md5Str, key);
        }

        /// <summary>
        /// 通用des加密(已带key)
        /// </summary>
        public static string EncryptStringDES(string str)
        {
            return XCLNetTools.Encrypt.DESEncrypt.Encrypt(str, DESKey);
        }

        /// <summary>
        /// 通用des 解密
        /// </summary>
        public static string DecryptStringDES(string desString)
        {
            return XCLNetTools.Encrypt.DESEncrypt.Decrypt(desString, DESKey);
        }

        /// <summary>
        /// 根据用户名密码实体来生成登录令牌
        /// </summary>
        public static string CreateToken(XCLCMS.Data.Model.Custom.UserNamePwd model)
        {
            if (null == model)
            {
                return null;
            }
            return EncryptHelper.EncryptStringDES(string.Format("{0}^{1}^{2}", model.UserName, model.Pwd, DateTime.Now.AddDays(7).Ticks));
        }

        /// <summary>
        /// 从加密的令牌中获取用户名和密码实体
        /// </summary>
        public static XCLCMS.Data.Model.Custom.UserNamePwd GetUserNamePwdByToken(string token)
        {
            XCLCMS.Data.Model.Custom.UserNamePwd model = null;
            if (string.IsNullOrWhiteSpace(token))
            {
                return model;
            }
            var ut = EncryptHelper.DecryptStringDES(token) ?? string.Empty;//解密为：admin^21232F297A57A5A743894A0E4A801FC3^636176029022230294
            string[] strSplit = ut.Split('^');
            if (strSplit.Length != 3)
            {
                return model;
            }
            long ticks = XCLNetTools.Common.DataTypeConvert.ToLong(strSplit[2]);
            if (DateTime.Now.Ticks > ticks)
            {
                return model;
            }
            model = new Data.Model.Custom.UserNamePwd();
            model.UserName = strSplit[0];
            model.Pwd = strSplit[1];
            return model;
        }
    }
}