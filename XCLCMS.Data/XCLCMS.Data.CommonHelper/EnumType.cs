using System.ComponentModel;

namespace XCLCMS.Data.CommonHelper
{
    /// <summary>
    /// 枚举类型
    /// </summary>
    /// <remarks>
    /// 所有枚举，定长char
    /// </remarks>
    public class EnumType
    {
        #region 公共

        /// <summary>
        /// 主体类型
        /// </summary>
        public enum ObjectTypeEnum
        {
            /// <summary>
            /// 文章表 Article
            /// </summary>
            [Description("文章表")]
            ART,

            /// <summary>
            /// 产品表 Product
            /// </summary>
            [Description("产品表")]
            PRO
        }

        /// <summary>
        /// 是否
        /// </summary>
        public enum YesNoEnum
        {
            /// <summary>
            /// 是 Yes
            /// </summary>
            [Description("是")]
            Y,

            /// <summary>
            /// 否 No
            /// </summary>
            [Description("否")]
            N
        }

        /// <summary>
        /// 记录状态
        /// </summary>
        public enum RecordStateEnum
        {
            /// <summary>
            /// 正常 Normal
            /// </summary>
            [Description("正常")]
            N,

            /// <summary>
            /// 回收 Recycle
            /// </summary>
            [Description("回收")]
            R,

            /// <summary>
            /// 已删除 Deleted
            /// </summary>
            [Description("已删除")]
            D
        }

        /// <summary>
        /// 链接打开方式
        /// </summary>
        public enum URLOpenTypeEnum
        {
            /// <summary>
            /// 默认 None
            /// </summary>
            [Description("默认")]
            NON,

            /// <summary>
            /// 新窗口 _blank
            /// </summary>
            [Description("新窗口")]
            BLA
        }

        /// <summary>
        /// 审核状态
        /// </summary>
        public enum VerifyStateEnum
        {
            /// <summary>
            /// 待审核  Wait
            /// </summary>
            [Description("待审核")]
            WAT,

            /// <summary>
            /// 审核不通过 No
            /// </summary>
            [Description("审核不通过")]
            NON,

            /// <summary>
            /// 审核通过 Yes
            /// </summary>
            [Description("审核通过")]
            YES
        }

        #endregion 公共

        #region 文章

        /// <summary>
        /// 文章状态
        /// </summary>
        public enum ArticleStateEnum
        {
            /// <summary>
            /// 草稿 Draft
            /// </summary>
            [Description("草稿")]
            DRA,

            /// <summary>
            /// 已发布 Published
            /// </summary>
            [Description("已发布")]
            PUB
        }

        /// <summary>
        /// 文章内容类型
        /// </summary>
        public enum ArticleContentTypeEnum
        {
            /// <summary>
            /// 纯文字 Word
            /// </summary>
            [Description("纯文字")]
            WOR,

            /// <summary>
            /// 图集 Image
            /// </summary>
            [Description("图集")]
            IMG,

            /// <summary>
            /// 视频 Video
            /// </summary>
            [Description("视频")]
            VID,

            /// <summary>
            /// 跳转链接 URL
            /// </summary>
            [Description("跳转链接")]
            URL
        }

        /// <summary>
        /// 文章来源枚举
        /// </summary>
        public enum ArticleFromInfoEnum
        {
            /// <summary>
            /// 原创
            /// </summary>
            [Description("原创")]
            原创,

            /// <summary>
            /// 网络
            /// </summary>
            [Description("网络")]
            网络,

            /// <summary>
            /// 未知
            /// </summary>
            [Description("未知")]
            未知
        }

        /// <summary>
        /// 文章作者枚举
        /// </summary>
        public enum ArticleAuthorNameEnum
        {
            /// <summary>
            /// 管理员
            /// </summary>
            [Description("管理员")]
            管理员,

            /// <summary>
            /// 佚名
            /// </summary>
            [Description("佚名")]
            佚名
        }

        #endregion 文章

        #region 附件

        /// <summary>
        /// 附件浏览方式
        /// </summary>
        public enum AttachmentViewTypeEnum
        {
            /// <summary>
            /// 普通 Normal
            /// </summary>
            [Description("普通")]
            NOR,

            /// <summary>
            /// 需要下载 Download
            /// </summary>
            [Description("需要下载")]
            DOW
        }

        /// <summary>
        /// 附件格式类型
        /// </summary>
        public enum AttachmentFormatTypeEnum
        {
            /// <summary>
            /// 文字 Word
            /// </summary>
            [Description("文字")]
            WOR,

            /// <summary>
            /// 图片 Image
            /// </summary>
            [Description("图片")]
            IMG,

            /// <summary>
            /// 视频 Video
            /// </summary>
            [Description("视频")]
            VID,

            /// <summary>
            /// 压缩包 RAR
            /// </summary>
            [Description("压缩包")]
            RAR,

            /// <summary>
            /// 其它 Other
            /// </summary>
            [Description("其它")]
            OTH
        }

        #endregion 附件

        #region 建议反馈

        /// <summary>
        /// 反馈类型
        /// </summary>
        public enum FeedbackTypeEnum
        {
            /// <summary>
            /// 建议 Advise
            /// </summary>
            [Description("建议与意见")]
            ADV,

            /// <summary>
            /// 系统异常 Error
            /// </summary>
            [Description("系统异常")]
            ERR
        }

        #endregion 建议反馈

        #region 用户

        /// <summary>
        /// 性别
        /// </summary>
        public enum UserSexTypeEnum
        {
            /// <summary>
            /// 男 Man
            /// </summary>
            [Description("男")]
            M,

            /// <summary>
            /// 女 Female
            /// </summary>
            [Description("女")]
            F
        }

        /// <summary>
        /// 用户状态
        /// </summary>
        public enum UserStateEnum
        {
            /// <summary>
            /// 正常 Normal
            /// </summary>
            [Description("正常")]
            N,

            /// <summary>
            /// 禁用 Disabled
            /// </summary>
            [Description("禁用")]
            D
        }

        /// <summary>
        /// 用户类型
        /// </summary>
        public enum UserTypeEnum
        {
            /// <summary>
            /// 默认
            /// </summary>
            [Description("默认")]
            NON,

            /// <summary>
            /// 商户主账号
            /// </summary>
            [Description("商户主账号")]
            MAI
        }

        #endregion 用户

        #region 日志

        /// <summary>
        /// 日志类型  (该类型varchar(50))
        /// </summary>
        public enum LogTypeEnum
        {
            /// <summary>
            /// 系统日志 System
            /// </summary>
            [Description("系统日志")]
            SYSTEM,

            /// <summary>
            /// 登录日志 Logon
            /// </summary>
            [Description("登录日志")]
            LOGIN,

            /// <summary>
            /// 其它日志 Other
            /// </summary>
            [Description("其它日志")]
            OTHER
        }

        #endregion 日志

        #region 广告

        /// <summary>
        /// 广告类型
        /// </summary>
        public enum AdsTypeEnum
        {
            /// <summary>
            /// 文字 Word
            /// </summary>
            [Description("文字")]
            WOR,

            /// <summary>
            /// 图片 Image
            /// </summary>
            [Description("图片")]
            IMG,

            /// <summary>
            /// 纯代码 Code
            /// </summary>
            [Description("纯代码")]
            COD
        }

        #endregion 广告

        #region 商户

        /// <summary>
        /// 商户状态
        /// </summary>
        public enum MerchantStateEnum
        {
            /// <summary>
            /// 有效 Yes
            /// </summary>
            [Description("有效")]
            Y,

            /// <summary>
            /// 无效 No
            /// </summary>
            [Description("无效")]
            N
        }

        /// <summary>
        /// 商户系统类型
        /// </summary>
        public enum MerchantSystemTypeEnum
        {
            /// <summary>
            /// 普通商户 Normal
            /// </summary>
            [Description("普通商户")]
            NOR,

            /// <summary>
            /// 系统内置商户 System
            /// </summary>
            [Description("系统内置商户")]
            SYS,
        }

        #endregion 商户

        #region ID生成

        /// <summary>
        /// ID生成类型
        /// </summary>
        public enum IDTypeEnum
        {
            /// <summary>
            /// 用户信息  UserInfo
            /// </summary>
            [Description("用户信息")]
            USR,

            /// <summary>
            /// 系统配置  SysWebSetting
            /// </summary>
            [Description("系统配置")]
            SET,

            /// <summary>
            /// 系统字典 SysDic
            /// </summary>
            [Description("系统字典")]
            DIC,

            /// <summary>
            /// 系统功能 SysFunction
            /// </summary>
            [Description("系统功能")]
            FUN,

            /// <summary>
            /// 角色 Role
            /// </summary>
            [Description("角色")]
            RLE,

            /// <summary>
            /// 商户 Merchant
            /// </summary>
            [Description("商户")]
            MER,

            /// <summary>
            /// 附件 Attachment
            /// </summary>
            [Description("附件")]
            ATT,

            /// <summary>
            /// 文章信息 Article
            /// </summary>
            [Description("文章信息")]
            ART,

            /// <summary>
            /// 商户应用 MerchantApp
            /// </summary>
            [Description("商户应用")]
            MEP,

            /// <summary>
            /// 友情链接 FriendLinks
            /// </summary>
            [Description("友情链接")]
            LIK,

            /// <summary>
            /// 标签 Tag
            /// </summary>
            [Description("标签")]
            TAG,

            /// <summary>
            /// 广告位 Ads
            /// </summary>
            [Description("广告位")]
            ADS
        }

        #endregion ID生成

        #region 系统配置

        /// <summary>
        /// 配置值的类型
        /// </summary>
        public enum SysWebSettingValueTypeEnum
        {
            /// <summary>
            /// 字符串 String
            /// </summary>
            [Description("字符串")]
            STR,

            /// <summary>
            /// 数字 Number
            /// </summary>
            [Description("数字")]
            NUM,

            /// <summary>
            /// Json
            /// </summary>
            [Description("JSON")]
            JON,

            /// <summary>
            /// 开关 Switch
            /// </summary>
            [Description("开关")]
            SWH
        }

        #endregion 系统配置
    }
}