using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace XCLCMS.Lib.Common
{
    /// <summary>
    /// 公共操作
    /// </summary>
    public class Comm
    {
        #region 缓存相关

        /// <summary>
        /// 站点配置信息缓存
        /// </summary>
        public const string SettingCacheName = "SettingCacheName";

        /// <summary>
        /// 缓存清理
        /// </summary>
        public static void ClearCache()
        {
            XCLNetTools.Cache.CacheClass.Clear(XCLCMS.Lib.Common.Comm.SettingCacheName);
        }

        #endregion 缓存相关

        #region 配置相关

        /// <summary>
        /// 获取当前系统所处环境
        /// </summary>
        public static XCLNetTools.Enum.CommonEnum.SysEnvironmentEnum GetCurrentEnvironment()
        {
            string val = XCLNetTools.XML.ConfigClass.GetConfigString("SysEnvironment");
            if (string.IsNullOrWhiteSpace(val))
            {
                throw new ArgumentNullException("SysEnvironment", "appSettings中缺少环境节点配置信息！");
            }
            return (XCLNetTools.Enum.CommonEnum.SysEnvironmentEnum)Enum.Parse(typeof(XCLNetTools.Enum.CommonEnum.SysEnvironmentEnum), val.Trim().ToUpper());
        }

        /// <summary>
        /// 获取当前应用ID
        /// </summary>
        public static long AppID
        {
            get
            {
                var id = XCLNetTools.Common.DataTypeConvert.ToLong(XCLNetTools.XML.ConfigClass.GetConfigString("AppID"));
                if (id <= 0)
                {
                    throw new ArgumentNullException("AppID", "请在配置文件中配置有效的AppID！");
                }
                return id;
            }
        }

        /// <summary>
        /// 获取当前应用AppKey
        /// </summary>
        public static string AppKey
        {
            get
            {
                var str = XCLNetTools.XML.ConfigClass.GetConfigString("AppKey");
                if (string.IsNullOrWhiteSpace(str))
                {
                    throw new ArgumentNullException("AppKey", "请在配置文件中配置有效的AppKey！");
                }
                return str;
            }
        }

        /// <summary>
        /// 获取当前应用WebAPIJsUrl
        /// </summary>
        public static string WebAPIJsUrl
        {
            get
            {
                var str = XCLNetTools.XML.ConfigClass.GetConfigString("WebAPIJsUrl");
                if (string.IsNullOrWhiteSpace(str))
                {
                    throw new ArgumentNullException("WebAPIJsUrl", "请在配置文件中配置有效的WebAPIJsUrl！");
                }
                return str;
            }
        }

        /// <summary>
        /// 获取当前应用WebAPIServiceURL
        /// </summary>
        public static string WebAPIServiceURL
        {
            get
            {
                var str = XCLNetTools.XML.ConfigClass.GetConfigString("WebAPIServiceURL");
                if (string.IsNullOrWhiteSpace(str))
                {
                    throw new ArgumentNullException("WebAPIServiceURL", "请在配置文件中配置有效的WebAPIServiceURL！");
                }
                return str;
            }
        }

        #endregion 配置相关

        #region 数据字典相关

        /// <summary>
        /// 将指定code的SysDic的子项转为options
        /// </summary>
        public static string GetSysDicOptionsByCode(string code, XCLNetTools.Entity.SetOptionEntity options = null)
        {
            StringBuilder str = new StringBuilder();
            if (null != options && options.IsNeedPleaseSelect)
            {
                str.Append("<option value=''>--请选择--</option>");
            }

            List<XCLCMS.Data.Model.SysDic> lst = null;
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<object>();
            request.Body = code;
            var response = XCLCMS.Lib.WebAPI.SysDicAPI.GetChildListByCode(request);
            if (null != response)
            {
                lst = response.Body;
            }

            if (null != lst && lst.Count > 0)
            {
                lst.ForEach(m =>
                {
                    if (null != options)
                    {
                        str.AppendFormat("<option value='{0}' {2}>{1}</option>", m.SysDicID, m.DicName, string.Equals(options.DefaultValue, m.SysDicID.ToString(), StringComparison.OrdinalIgnoreCase) ? " selected='selected' " : "");
                    }
                    else
                    {
                        str.AppendFormat("<option value='{0}'>{1}</option>", m.SysDicID, m.DicName);
                    }
                });
            }
            return str.ToString();
        }

        #endregion 数据字典相关

        #region 文件管理相关

        /// <summary>
        /// 允许上传的附件扩展名信息（小写）
        /// </summary>
        public static List<string> AllowUploadExtInfo = new Func<List<string>>(() =>
        {
            return XCLNetTools.Enum.EnumHelper.GetEnumFieldModelList(typeof(XCLNetTools.Enum.CommonEnum.FileExtInfoEnum)).Where(k =>
                k.Text == XCLNetTools.Enum.CommonEnum.FileExtInfoEnum.Txt.ToString() ||
                k.Text == XCLNetTools.Enum.CommonEnum.FileExtInfoEnum.Compress.ToString() ||
                k.Text == XCLNetTools.Enum.CommonEnum.FileExtInfoEnum.Image.ToString() ||
                k.Text == XCLNetTools.Enum.CommonEnum.FileExtInfoEnum.Music.ToString() ||
                k.Text == XCLNetTools.Enum.CommonEnum.FileExtInfoEnum.Office.ToString() ||
                k.Text == XCLNetTools.Enum.CommonEnum.FileExtInfoEnum.Pdf.ToString() ||
                k.Text == XCLNetTools.Enum.CommonEnum.FileExtInfoEnum.Video.ToString()
            ).Select(k => k.Description).ToList();
        }).Invoke();

        /// <summary>
        /// 根据文件id，返回用于网站上显示的文件地址
        /// </summary>
        public static string GetAttachmentAbsoluteURL(long id)
        {
            if (id <= 0)
            {
                return null;
            }
            XCLCMS.Data.Model.View.v_Attachment model = null;
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.DetailEntity>();
            request.Body = new Data.WebAPIEntity.RequestEntity.Attachment.DetailEntity();
            request.Body.AttachmentID = id;
            var response = XCLCMS.Lib.WebAPI.AttachmentAPI.Detail(request);
            if (null != response)
            {
                model = response.Body.Attachment;
            }
            return null != model ? GetAttachmentAbsoluteURL(model.URL) : null;
        }

        /// <summary>
        /// 将文件管理中的文件相对路径转为url绝对路径
        /// 如：~/upload/files/123.jpg -> //www.w.com/filemanager/upload/files/123.jpg
        /// </summary>
        public static string GetAttachmentAbsoluteURL(string relativeUrl)
        {
            if (string.IsNullOrWhiteSpace(relativeUrl))
            {
                throw new ArgumentNullException("relativeUrl", "必须指定参数：relativeUrl！");
            }
            return System.Web.HttpUtility.UrlDecode(relativeUrl).Trim().Replace("~/", XCLCMS.Lib.Common.Setting.SettingModel.FileManager_RootURL);
        }

        #endregion 文件管理相关

        #region 其它

        /// <summary>
        /// 类别枚举json
        /// </summary>
        public static readonly string GetAllEnumJson = XCLNetTools.Enum.EnumHelper.GetEnumJson(typeof(XCLCMS.Data.CommonHelper.EnumType));

        /// <summary>
        /// 重写json
        /// </summary>
        public static JsonResult XCLJsonResult(object data, JsonRequestBehavior jsonRequestBehavior = JsonRequestBehavior.DenyGet)
        {
            return new XCLNetTools.MVC.JsonResultFormat() { Data = data, JsonRequestBehavior = jsonRequestBehavior };
        }

        /// <summary>
        /// 获取当前应用程序的商户实体
        /// </summary>
        public static XCLCMS.Data.Model.Merchant GetCurrentApplicationMerchant()
        {
            return XCLCMS.Lib.Common.Comm.GetCurrentApplicationMerchantAppInfo().Merchant;
        }

        /// <summary>
        /// 获取当前应用程序的商户应用实体
        /// </summary>
        public static XCLCMS.Data.Model.MerchantApp GetCurrentApplicationMerchantApp()
        {
            return XCLCMS.Lib.Common.Comm.GetCurrentApplicationMerchantAppInfo().MerchantApp;
        }

        /// <summary>
        /// 获取当前应用程序的商户应用信息
        /// </summary>
        public static XCLCMS.Data.Model.Custom.MerchantAppInfoModel GetCurrentApplicationMerchantAppInfo()
        {
            XCLCMS.Data.Model.Custom.MerchantAppInfoModel model = null;
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<object>();
            request.Body = XCLCMS.Lib.Common.Comm.AppKey;
            var response = XCLCMS.Lib.WebAPI.MerchantAppAPI.DetailByAppKey(request);
            if (null != response && null != response.Body && null != response.Body.Merchant && null != response.Body.MerchantApp)
            {
                model = response.Body;
            }
            else
            {
                throw new Exception("商户应用信息获取失败，请配置有效的AppKey！");
            }
            return model;
        }

        #endregion 其它
    }
}