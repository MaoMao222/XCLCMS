using System;
using System.IO.Compression;
using System.Web.Mvc;

namespace XCLCMS.Lib.Base
{
    /// <summary>
    /// 抽象基类
    /// </summary>
    public abstract class AbstractBaseController : Controller
    {
        private XCLCMS.Data.Model.Custom.UserInfoDetailModel _currentUserInfoDetailModel = null;
        private XCLCMS.Data.Model.UserInfo _currentUserModel = null;
        private XCLCMS.Data.Model.Custom.ContextModel _contextModel = null;
        private string _userToken = null;
        private XCLCMS.Data.Model.MerchantApp _currentApplicationMerchantApp = null;
        private XCLCMS.Data.Model.Merchant _currentApplicationMerchant = null;
        private XCLCMS.Data.Model.MerchantApp _currentUserMerchantApp = null;
        private XCLCMS.Data.Model.Merchant _currentUserMerchant = null;

        #region 当前登录用户相关

        /// <summary>
        /// 当前登录用户详情
        /// </summary>
        public XCLCMS.Data.Model.Custom.UserInfoDetailModel CurrentUserInfoDetailModel
        {
            get
            {
                if (null == this._currentUserInfoDetailModel)
                {
                    this._currentUserInfoDetailModel = XCLCMS.Lib.Common.LoginHelper.GetUserInfoFromLoginInfo();
                }
                return this._currentUserInfoDetailModel;
            }
        }

        /// <summary>
        /// 当前登录的用户实体
        /// </summary>
        public XCLCMS.Data.Model.UserInfo CurrentUserModel
        {
            get
            {
                if (this._currentUserModel == null)
                {
                    this._currentUserModel = null == this.CurrentUserInfoDetailModel ? null : this.CurrentUserInfoDetailModel.UserInfo;
                }
                return this._currentUserModel;
            }
        }

        /// <summary>
        /// 当前已登录用户的ID
        /// </summary>
        public long UserID
        {
            get
            {
                return null != this.CurrentUserModel ? this.CurrentUserModel.UserInfoID : 0;
            }
        }

        /// <summary>
        /// 当前用户登录令牌
        /// </summary>
        public string UserToken
        {
            get
            {
                if (string.IsNullOrWhiteSpace(this._userToken))
                {
                    this._userToken = null == this.CurrentUserInfoDetailModel ? null : this.CurrentUserInfoDetailModel.Token;
                }
                return this._userToken;
            }
        }

        /// <summary>
        /// 当前用户所属的商户信息实体
        /// </summary>
        public XCLCMS.Data.Model.Merchant CurrentUserMerchant
        {
            get
            {
                if (null == this._currentUserMerchant)
                {
                    this._currentUserMerchant = null == this.CurrentUserInfoDetailModel ? null : this.CurrentUserInfoDetailModel.Merchant;
                }
                return this._currentUserMerchant;
            }
        }

        /// <summary>
        /// 当前用户所属的商户应用实体
        /// </summary>
        public XCLCMS.Data.Model.MerchantApp CurrentUserMerchantApp
        {
            get
            {
                if (null == this._currentUserMerchantApp)
                {
                    this._currentUserMerchantApp = null == this.CurrentUserInfoDetailModel ? null : this.CurrentUserInfoDetailModel.MerchantApp;
                }
                return this._currentUserMerchantApp;
            }
        }

        #endregion 当前登录用户相关

        #region 其它

        /// <summary>
        /// db上下文
        /// </summary>
        public XCLCMS.Data.Model.Custom.ContextModel ContextModel
        {
            get
            {
                if (null == this._contextModel)
                {
                    this._contextModel = new Data.Model.Custom.ContextModel()
                    {
                        UserInfoID = this.CurrentUserModel.UserInfoID,
                        UserName = this.CurrentUserModel.UserName
                    };
                }
                return this._contextModel;
            }
        }

        /// <summary>
        /// 当前应用程序的商户应用实体
        /// </summary>
        public XCLCMS.Data.Model.MerchantApp CurrentApplicationMerchantApp
        {
            get
            {
                if (null == this._currentApplicationMerchantApp)
                {
                    this._currentApplicationMerchantApp = XCLCMS.Lib.Common.Comm.GetCurrentApplicationMerchantApp();
                }
                return this._currentApplicationMerchantApp;
            }
        }

        /// <summary>
        /// 当前应用程序的商户信息实体
        /// </summary>
        public XCLCMS.Data.Model.Merchant CurrentApplicationMerchant
        {
            get
            {
                if (null == this._currentApplicationMerchant)
                {
                    this._currentApplicationMerchant = XCLCMS.Lib.Common.Comm.GetCurrentApplicationMerchant();
                }
                return this._currentApplicationMerchant;
            }
        }

        #endregion 其它

        #region 页面操作相关

        /// <summary>
        /// 当前页面分页参数信息
        /// </summary>
        public XCLNetTools.Entity.PagerInfo PageParamsInfo { get; set; }

        /// <summary>
        /// 当前页面操作类型
        /// </summary>
        public XCLNetTools.Enum.CommonEnum.HandleTypeEnum CurrentHandleType
        {
            get
            {
                XCLNetTools.Enum.CommonEnum.HandleTypeEnum type = XCLNetTools.Enum.CommonEnum.HandleTypeEnum.ADD;
                string handleType = XCLNetTools.StringHander.FormHelper.GetString("HandleType").ToUpper();
                if (!string.IsNullOrEmpty(handleType))
                {
                    if (!Enum.TryParse(handleType, out type))
                    {
                        type = XCLNetTools.Enum.CommonEnum.HandleTypeEnum.OTHER;
                    }
                }
                return type;
            }
        }

        /// <summary>
        /// 页面操作类型HandleType的参数值
        /// </summary>
        public string CurrentHandleTypeValue
        {
            get
            {
                return XCLNetTools.StringHander.FormHelper.GetString("HandleType").ToUpper();
            }
        }

        /// <summary>
        /// 添加
        /// </summary>
        [ValidateInput(false)]
        [HttpPost]
        public virtual ActionResult AddSubmit(FormCollection fm)
        {
            return null;
        }

        /// <summary>
        /// 删除
        /// </summary>
        [HttpPost]
        public virtual ActionResult DelSubmit(FormCollection fm)
        {
            return null;
        }

        /// <summary>
        /// 更新
        /// </summary>
        [ValidateInput(false)]
        [HttpPost]
        public virtual ActionResult UpdateSubmit(FormCollection fm)
        {
            return null;
        }

        /// <summary>
        /// 导入
        /// </summary>
        [ValidateInput(false)]
        [HttpPost]
        public virtual ActionResult InputSubmit(FormCollection fm)
        {
            return null;
        }

        /// <summary>
        /// 导出
        /// </summary>
        [HttpPost]
        public virtual ActionResult OutputSubmit(FormCollection fm)
        {
            return null;
        }

        #endregion 页面操作相关

        #region 拦截器

        /// <summary>
        /// OnActionExecuting
        /// </summary>
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

            //操作类型
            ViewBag.CurrentHandleType = this.CurrentHandleType;
            ViewBag.UserID = this.UserID;
            ViewBag.ResourceVersion = this.CurrentApplicationMerchantApp.ResourceVersion;
            ViewBag.CurrentApplicationMerchantApp = this.CurrentApplicationMerchantApp;
            ViewBag.CurrentApplicationMerchant = this.CurrentApplicationMerchant;

            if (null != this.CurrentUserModel)
            {
                ViewBag.CurrentUserMerchantApp = this.CurrentUserMerchantApp;
                ViewBag.CurrentUserMerchant = this.CurrentUserMerchant;
                ViewBag.UserToken = this.UserToken;
                ViewBag.IsMainUserForMerchant = this.CurrentUserModel.UserType == XCLCMS.Data.CommonHelper.EnumType.UserTypeEnum.MAI.ToString();
            }

            //公共信息
            XCLCMS.Lib.Model.CommonModel commonModel = new XCLCMS.Lib.Model.CommonModel();
            commonModel.CurrentUserModel = this.CurrentUserModel;
            ViewBag.CommonModel = commonModel;

            //分页信息
            this.PageParamsInfo = new XCLNetTools.Entity.PagerInfo(XCLNetTools.StringHander.FormHelper.GetInt("page", 1), XCLNetTools.StringHander.FormHelper.GetInt("pageSize", 10), 0);

            //页面全局配置信息
            var pageConfig = new XCLCMS.Lib.Model.PageGlobalConfig();
            pageConfig.AppID = XCLCMS.Lib.Common.Comm.AppID;
            if (null != commonModel)
            {
                pageConfig.IsLogOn = commonModel.IsLogOn;
                if (null != commonModel.CurrentUserModel)
                {
                    pageConfig.UserID = commonModel.CurrentUserModel.UserInfoID;
                    pageConfig.UserName = commonModel.CurrentUserModel.UserName;
                    pageConfig.AppKey = XCLCMS.Lib.Common.Comm.AppKey;
                }
            }
            pageConfig.RootURL = XCLNetTools.StringHander.Common.RootUri;
            pageConfig.UserToken = this.UserToken;
            pageConfig.FileManagerFileListURL = XCLCMS.Lib.Common.Setting.SettingModel.FileManager_FileListURL;
            pageConfig.FileManagerLogicFileListURL = XCLCMS.Lib.Common.Setting.SettingModel.FileManager_LogicFileListURL;
            pageConfig.WebAPIServiceURL = XCLCMS.Lib.Common.Comm.WebAPIServiceURL;
            pageConfig.ClientIP = XCLNetTools.Common.IPHelper.GetClientIP();
            pageConfig.Url = Request.Url?.AbsoluteUri;
            pageConfig.Reffer = Request.UrlReferrer?.AbsoluteUri;
            pageConfig.EnumConfig = string.Empty;
            ViewBag.PageGlobalConfigJSON = string.Format("var XCLCMSPageGlobalConfig={0};XCLCMSPageGlobalConfig.EnumConfig={1};", Newtonsoft.Json.JsonConvert.SerializeObject(pageConfig), XCLCMS.Lib.Common.Comm.GetAllEnumJson);

            #region meta信息设置

            //设置title
            if (string.IsNullOrWhiteSpace(ViewBag.Title))
            {
                ViewBag.Title = this.CurrentApplicationMerchantApp.MetaTitle;
            }
            else
            {
                ViewBag.Title = string.Format("{0}—{1}", ViewBag.Title, this.CurrentApplicationMerchantApp.MetaTitle);
            }
            //设置keywords
            if (string.IsNullOrWhiteSpace(ViewBag.KeyWords))
            {
                ViewBag.KeyWords = this.CurrentApplicationMerchantApp.MetaKeyWords;
            }
            else
            {
                ViewBag.KeyWords = string.Format("{0}—{1}", ViewBag.KeyWords, this.CurrentApplicationMerchantApp.MetaKeyWords);
            }
            //设置description
            if (string.IsNullOrWhiteSpace(ViewBag.Description))
            {
                ViewBag.Description = this.CurrentApplicationMerchantApp.MetaDescription;
            }
            else
            {
                ViewBag.Description = string.Format("{0}—{1}", ViewBag.Description, this.CurrentApplicationMerchantApp.MetaDescription);
            }

            #endregion meta信息设置
        }

        /// <summary>
        /// OnActionExecuted
        /// </summary>
        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);
            //gzip压缩
            var acceptEncoding = (filterContext.HttpContext.Request.Headers["Accept-Encoding"] ?? "").ToLower();
            if (!string.IsNullOrEmpty(acceptEncoding))
            {
                var response = filterContext.HttpContext.Response;
                if (acceptEncoding.Contains("gzip"))
                {
                    response.AppendHeader("Content-encoding", "gzip");
                    response.Filter = new GZipStream(response.Filter, CompressionMode.Compress);
                }
                else if (acceptEncoding.Contains("deflate"))
                {
                    response.AppendHeader("Content-encoding", "deflate");
                    response.Filter = new DeflateStream(response.Filter, CompressionMode.Compress);
                }
            }
        }

        #endregion 拦截器
    }
}