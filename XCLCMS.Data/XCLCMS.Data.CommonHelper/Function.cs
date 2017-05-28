using System.Collections.Generic;
using System.ComponentModel;

namespace XCLCMS.Data.CommonHelper
{
    /// <summary>
    /// 系统功能相关
    /// </summary>
    public class Function
    {
        /// <summary>
        /// 所有功能枚举（该数据由存储过程proc_Sys_GetFunctionEnumList生成）
        /// </summary>
        public enum FunctionEnum
        {
            /// <summary>
            ///用户管理-用户角色分配
            /// </summary>
            [Description("用户管理-用户角色分配")]
            SysFun_SetUserRole = 400165,

            /// <summary>
            ///用户管理-用户类别修改
            /// </summary>
            [Description("用户管理-用户类别修改")]
            SysFun_SetUserType = 400204,

            /// <summary>
            ///用户基本信息-用户基本信息添加
            /// </summary>
            [Description("用户基本信息-用户基本信息添加")]
            SysFun_UserAdmin_UserAdd = 400135,

            /// <summary>
            ///用户基本信息-用户基本信息删除
            /// </summary>
            [Description("用户基本信息-用户基本信息删除")]
            SysFun_UserAdmin_UserDel = 400136,

            /// <summary>
            ///用户基本信息-用户基本信息修改
            /// </summary>
            [Description("用户基本信息-用户基本信息修改")]
            SysFun_UserAdmin_UserEdit = 400137,

            /// <summary>
            ///用户基本信息-用户基本信息查看
            /// </summary>
            [Description("用户基本信息-用户基本信息查看")]
            SysFun_UserAdmin_UserView = 400138,

            /// <summary>
            ///系统日志-系统日志查看
            /// </summary>
            [Description("系统日志-系统日志查看")]
            SysFun_Set_SysLogView = 400140,

            /// <summary>
            ///系统日志-系统日志删除
            /// </summary>
            [Description("系统日志-系统日志删除")]
            SysFun_Set_SysLogDel = 400141,

            /// <summary>
            ///系统字典-系统字典添加
            /// </summary>
            [Description("系统字典-系统字典添加")]
            SysFun_Set_SysDicAdd = 400143,

            /// <summary>
            ///系统字典-系统字典删除
            /// </summary>
            [Description("系统字典-系统字典删除")]
            SysFun_Set_SysDicDel = 400144,

            /// <summary>
            ///系统字典-系统字典修改
            /// </summary>
            [Description("系统字典-系统字典修改")]
            SysFun_Set_SysDicEdit = 400145,

            /// <summary>
            ///系统字典-系统字典查看
            /// </summary>
            [Description("系统字典-系统字典查看")]
            SysFun_Set_SysDicView = 400146,

            /// <summary>
            ///系统配置-系统配置添加
            /// </summary>
            [Description("系统配置-系统配置添加")]
            SysFun_Set_SysWebSettingAdd = 400148,

            /// <summary>
            ///系统配置-系统配置删除
            /// </summary>
            [Description("系统配置-系统配置删除")]
            SysFun_Set_SysWebSettingDel = 400149,

            /// <summary>
            ///系统配置-系统配置修改
            /// </summary>
            [Description("系统配置-系统配置修改")]
            SysFun_Set_SysWebSettingEdit = 400150,

            /// <summary>
            ///系统配置-系统配置查看
            /// </summary>
            [Description("系统配置-系统配置查看")]
            SysFun_Set_SysWebSettingView = 400151,

            /// <summary>
            ///功能模块-功能模块添加
            /// </summary>
            [Description("功能模块-功能模块添加")]
            SysFun_Set_SysFunctionAdd = 400153,

            /// <summary>
            ///功能模块-功能模块删除
            /// </summary>
            [Description("功能模块-功能模块删除")]
            SysFun_Set_SysFunctionDel = 400154,

            /// <summary>
            ///功能模块-功能模块修改
            /// </summary>
            [Description("功能模块-功能模块修改")]
            SysFun_Set_SysFunctionEdit = 400155,

            /// <summary>
            ///功能模块-功能模块查看
            /// </summary>
            [Description("功能模块-功能模块查看")]
            SysFun_Set_SysFunctionView = 400156,

            /// <summary>
            ///其它-垃圾数据清理
            /// </summary>
            [Description("其它-垃圾数据清理")]
            SysFun_Set_ClearRubbishData = 400158,

            /// <summary>
            ///其它-缓存清理
            /// </summary>
            [Description("其它-缓存清理")]
            SysFun_Set_ClearCache = 400159,

            /// <summary>
            ///角色信息-角色信息查看
            /// </summary>
            [Description("角色信息-角色信息查看")]
            SysFun_SysRoleView = 400161,

            /// <summary>
            ///角色信息-角色信息添加
            /// </summary>
            [Description("角色信息-角色信息添加")]
            SysFun_SysRoleAdd = 400162,

            /// <summary>
            ///角色信息-角色信息修改
            /// </summary>
            [Description("角色信息-角色信息修改")]
            SysFun_SysRoleEdit = 400163,

            /// <summary>
            ///角色信息-角色信息删除
            /// </summary>
            [Description("角色信息-角色信息删除")]
            SysFun_SysRoleDel = 400164,

            /// <summary>
            ///商户管理-商户信息添加
            /// </summary>
            [Description("商户管理-商户信息添加")]
            SysFun_UserAdmin_MerchantAdd = 400167,

            /// <summary>
            ///商户管理-商户信息修改
            /// </summary>
            [Description("商户管理-商户信息修改")]
            SysFun_UserAdmin_MerchantEdit = 400168,

            /// <summary>
            ///商户管理-商户信息删除
            /// </summary>
            [Description("商户管理-商户信息删除")]
            SysFun_UserAdmin_MerchantDel = 400169,

            /// <summary>
            ///商户管理-商户信息查看
            /// </summary>
            [Description("商户管理-商户信息查看")]
            SysFun_UserAdmin_MerchantView = 400170,

            /// <summary>
            ///商户管理-商户应用信息添加
            /// </summary>
            [Description("商户管理-商户应用信息添加")]
            SysFun_UserAdmin_MerchantAppAdd = 400183,

            /// <summary>
            ///商户管理-商户应用信息修改
            /// </summary>
            [Description("商户管理-商户应用信息修改")]
            SysFun_UserAdmin_MerchantAppEdit = 400184,

            /// <summary>
            ///商户管理-商户应用信息删除
            /// </summary>
            [Description("商户管理-商户应用信息删除")]
            SysFun_UserAdmin_MerchantAppDel = 400185,

            /// <summary>
            ///商户管理-商户应用信息查看
            /// </summary>
            [Description("商户管理-商户应用信息查看")]
            SysFun_UserAdmin_MerchantAppView = 400186,

            /// <summary>
            ///文件管理-磁盘文件查看
            /// </summary>
            [Description("文件管理-磁盘文件查看")]
            FileManager_DiskFileView = 400172,

            /// <summary>
            ///文件管理-磁盘文件删除
            /// </summary>
            [Description("文件管理-磁盘文件删除")]
            FileManager_DiskFileDel = 400173,

            /// <summary>
            ///文件管理-逻辑文件查看
            /// </summary>
            [Description("文件管理-逻辑文件查看")]
            FileManager_LogicFileView = 400174,

            /// <summary>
            ///文件管理-文件上传
            /// </summary>
            [Description("文件管理-文件上传")]
            FileManager_FileAdd = 400175,

            /// <summary>
            ///文件管理-逻辑文件删除
            /// </summary>
            [Description("文件管理-逻辑文件删除")]
            FileManager_LogicFileDel = 400176,

            /// <summary>
            ///文件管理-逻辑文件修改
            /// </summary>
            [Description("文件管理-逻辑文件修改")]
            FileManager_LogicFileUpdate = 400177,

            /// <summary>
            ///文章管理-文章信息添加
            /// </summary>
            [Description("文章管理-文章信息添加")]
            SysFun_UserAdmin_ArticleAdd = 400179,

            /// <summary>
            ///文章管理-文章信息删除
            /// </summary>
            [Description("文章管理-文章信息删除")]
            SysFun_UserAdmin_ArticleDel = 400180,

            /// <summary>
            ///文章管理-文章信息修改
            /// </summary>
            [Description("文章管理-文章信息修改")]
            SysFun_UserAdmin_ArticleEdit = 400181,

            /// <summary>
            ///文章管理-文章信息查看
            /// </summary>
            [Description("文章管理-文章信息查看")]
            SysFun_UserAdmin_ArticleView = 400182,

            /// <summary>
            ///数据过滤-仅限当前商户
            /// </summary>
            [Description("数据过滤-仅限当前商户")]
            SysFun_DataFilter_OnlyCurrentMerchant = 400188,

            /// <summary>
            ///友情链接管理-友情链接添加
            /// </summary>
            [Description("友情链接管理-友情链接添加")]
            FriendLinks_Add = 400190,

            /// <summary>
            ///友情链接管理-友情链接删除
            /// </summary>
            [Description("友情链接管理-友情链接删除")]
            FriendLinks_Del = 400191,

            /// <summary>
            ///友情链接管理-友情链接修改
            /// </summary>
            [Description("友情链接管理-友情链接修改")]
            FriendLinks_Edit = 400192,

            /// <summary>
            ///友情链接管理-友情链接查看
            /// </summary>
            [Description("友情链接管理-友情链接查看")]
            FriendLinks_View = 400193,

            /// <summary>
            ///标签管理-标签信息查看
            /// </summary>
            [Description("标签管理-标签信息查看")]
            Tags_View = 400195,

            /// <summary>
            ///标签管理-标签信息删除
            /// </summary>
            [Description("标签管理-标签信息删除")]
            Tags_Del = 400196,

            /// <summary>
            ///标签管理-标签信息添加
            /// </summary>
            [Description("标签管理-标签信息添加")]
            Tags_Add = 400197,

            /// <summary>
            ///标签管理-标签信息修改
            /// </summary>
            [Description("标签管理-标签信息修改")]
            Tags_Edit = 400198,

            /// <summary>
            ///广告位管理-广告位查看
            /// </summary>
            [Description("广告位管理-广告位查看")]
            Ads_View = 400200,

            /// <summary>
            ///广告位管理-广告位删除
            /// </summary>
            [Description("广告位管理-广告位删除")]
            Ads_Del = 400201,

            /// <summary>
            ///广告位管理-广告位添加
            /// </summary>
            [Description("广告位管理-广告位添加")]
            Ads_Add = 400202,

            /// <summary>
            ///广告位管理-广告位修改
            /// </summary>
            [Description("广告位管理-广告位修改")]
            Ads_Edit = 400203,

            /// <summary>
            ///评论管理-评论查看
            /// </summary>
            [Description("评论管理-评论查看")]
            Comments_View = 400206,

            /// <summary>
            ///评论管理-评论删除
            /// </summary>
            [Description("评论管理-评论删除")]
            Comments_Del = 400207,

            /// <summary>
            ///评论管理-评论添加
            /// </summary>
            [Description("评论管理-评论添加")]
            Comments_Add = 400208,

            /// <summary>
            ///评论管理-评论修改
            /// </summary>
            [Description("评论管理-评论修改")]
            Comments_Edit = 400209,
        }

        /// <summary>
        /// 普通商户角色必须包含的权限功能ID列表
        /// </summary>
        public static List<long> NormalMerchantFixedFunctionIDList = new List<long>() {
            (long)FunctionEnum.SysFun_DataFilter_OnlyCurrentMerchant
        };
    }
}