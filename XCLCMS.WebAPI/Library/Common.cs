using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Web;
using System.Web.Http.Controllers;

namespace XCLCMS.WebAPI.Library
{
    /// <summary>
    /// 公共类
    /// </summary>
    public class Common
    {
        /// <summary>
        /// 根据登录令牌获取用户实体
        /// </summary>
        public static XCLCMS.Data.Model.UserInfo GetUserInfoByUserToken(string token)
        {
            var tokenModel = XCLCMS.WebAPI.Library.EncryptHelper.GetUserNamePwdByToken(token);
            if (null != tokenModel)
            {
                return new XCLCMS.Data.BLL.UserInfo().GetModel(tokenModel.UserName, tokenModel.Pwd);
            }
            return null;
        }

        /// <summary>
        /// 从请求上下文中获取参数的关键信息
        /// </summary>
        public static XCLCMS.WebAPI.Model.ActionContextInfoEntity GetInfoFromActionContext(HttpActionContext actionContext)
        {
            if (null == actionContext || null == actionContext.Request)
            {
                return null;
            }
            XCLCMS.WebAPI.Model.ActionContextInfoEntity model = null;

            //post参数
            if (actionContext.Request.Method == HttpMethod.Post)
            {
                string body = actionContext.Request.Content.ReadAsStringAsync().Result;
                if (string.IsNullOrWhiteSpace(body))
                {
                    return model;
                }
                model = new Model.ActionContextInfoEntity();
                var jobj = JObject.Parse(body);
                JToken jtoken = null;
                if (jobj.TryGetValue("AppID", out jtoken))
                {
                    model.AppID = XCLNetTools.Common.DataTypeConvert.ToLong(Convert.ToString(jtoken));
                }
                if (jobj.TryGetValue("AppKey", out jtoken))
                {
                    model.AppKey = Convert.ToString(jtoken);
                }
                if (jobj.TryGetValue("UserToken", out jtoken))
                {
                    model.UserToken = Convert.ToString(jtoken);
                }
            }

            //get参数
            if (actionContext.Request.Method == HttpMethod.Get)
            {
                var queryString = HttpUtility.ParseQueryString(actionContext.Request.RequestUri.Query);
                if (null != queryString)
                {
                    model = new Model.ActionContextInfoEntity();
                    model.AppID = XCLNetTools.Common.DataTypeConvert.ToLong(queryString["AppID"]);
                    model.AppKey = queryString["AppKey"];
                    model.UserToken = queryString["UserToken"];
                }
            }
            return model;
        }
    }
}