using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Text;
using System.Web;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// WEB API 公共库
    /// </summary>
    public class Library
    {
        #region 基础

        /// <summary>
        /// 请求
        /// </summary>
        /// <typeparam name="TRequest">请求类型</typeparam>
        /// <typeparam name="TResponse">返回类型</typeparam>
        /// <param name="request">请求类对象</param>
        /// <param name="path">请求路径</param>
        /// <param name="isGet">是否为get请求，默认为get</param>
        /// <returns>请求结果</returns>
        public static APIResponseEntity<TResponse> Request<TRequest, TResponse>(APIRequestEntity<TRequest> request, string path, bool isGet = true)
        {
            var response = new APIResponseEntity<TResponse>();
            string requestJson = JsonConvert.SerializeObject(request);
            string requestURL = (XCLCMS.Lib.Common.Comm.WebAPIServiceURL.Trim().Trim('/') + '/' + path.Trim().Trim('/')).Trim('?');
            RestRequest httpRequest = null;
            IRestResponse httpResponse = null;
            string res = string.Empty;
            var client = new RestClient(requestURL);

            if (isGet)
            {
                client = new RestClient(requestURL + (requestURL.IndexOf('?') >= 0 ? "&" : "?") + XCLNetTools.Serialize.Lib.ConvertJsonToUrlParameters(requestJson));
                httpRequest = new RestRequest(Method.GET);
            }
            else
            {
                client = new RestClient(requestURL);
                httpRequest = new RestRequest(Method.POST);
                httpRequest.RequestFormat = DataFormat.Json;
                httpRequest.AddParameter("application/json", requestJson, ParameterType.RequestBody);
            }

            httpRequest.AddHeader("Accept", "application/json");
            httpRequest.AddHeader("Accept-Encoding", "GZIP");
            httpRequest.AddHeader("Content-Type", "application/json");
            client.Timeout = 30000;
            client.Encoding = System.Text.Encoding.UTF8;

            try
            {
                httpResponse = client.Execute(httpRequest);
                res = httpResponse.Content;
                if (!string.IsNullOrWhiteSpace(res))
                {
                    try
                    {
                        response = Newtonsoft.Json.JsonConvert.DeserializeObject<APIResponseEntity<TResponse>>(res);
                    }
                    catch
                    {
                        response.IsException = true;
                        response.IsSuccess = false;
                        response.Message = "Api响应报文反序列化失败！";
                        response.MessageMore = res;
                    }
                }
                if (null != response && response.IsException)
                {
                    throw new Exception(string.Format("{0}{1}{1}{2}", response.Message, Environment.NewLine, response.MessageMore));
                }
            }
            catch (AggregateException ex)
            {
                if (null != ex.InnerExceptions && ex.InnerExceptions.Count > 0)
                {
                    var errorSB = new StringBuilder();
                    foreach (var m in ex.InnerExceptions)
                    {
                        errorSB.Append(m.Message + Environment.NewLine);
                    }
                    XCLNetLogger.Log.WriteLog(XCLNetLogger.Config.LogConfig.LogLevel.ERROR, "webapi请求出错", errorSB.ToString());
                }
            }
            catch (Exception ex)
            {
                XCLNetLogger.Log.WriteLog(ex);
                throw;
            }
            return response;
        }

        /// <summary>
        /// 创建request对象
        /// </summary>
        /// <returns>request对象</returns>
        public static APIRequestEntity<TRequest> CreateRequest<TRequest>(string userToken = null)
        {
            APIRequestEntity<TRequest> request = new APIRequestEntity<TRequest>();
            request.ClientIP = XCLNetTools.Common.IPHelper.GetClientIP();
            request.UserToken = userToken;
            request.Url = HttpContext.Current?.Request?.Url?.AbsoluteUri;
            request.Reffer = HttpContext.Current?.Request?.UrlReferrer?.AbsoluteUri;
            request.AppID = XCLCMS.Lib.Common.Comm.AppID;
            request.AppKey = XCLCMS.Lib.Common.Comm.AppKey;
            return request;
        }

        #endregion 基础

        #region CommonAPI相关

        /// <summary>
        /// 生成ID
        /// </summary>
        public static long CommonAPI_GenerateID(string userToken, XCLCMS.Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity entity)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity>(userToken);
            request.Body = entity;
            var response = XCLCMS.Lib.WebAPI.CommonAPI.GenerateID(request);
            if (null == response)
            {
                return 0;
            }
            return response.Body;
        }

        #endregion CommonAPI相关

        #region MerchantAPI相关

        /// <summary>
        /// 获取商户类型
        /// </summary>
        public static Dictionary<string, long> MerchantAPI_GetMerchantTypeDic(string userToken)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<object>(userToken);
            request.Body = new object();
            var response = XCLCMS.Lib.WebAPI.MerchantAPI.GetMerchantTypeDic(request);
            if (null == response)
            {
                return null;
            }
            return response.Body;
        }

        #endregion MerchantAPI相关

        #region SysDicAPI相关

        /// <summary>
        /// 获取证件类型
        /// </summary>
        public static Dictionary<string, long> SysDicAPI_GetPassTypeDic(string userToken)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<object>(userToken);
            request.Body = new object();
            var response = XCLCMS.Lib.WebAPI.SysDicAPI.GetPassTypeDic(request);
            if (null == response)
            {
                return null;
            }
            return response.Body;
        }

        /// <summary>
        /// 获取当前sysDicID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        public static List<XCLCMS.Data.Model.Custom.SysDicSimple> SysDicAPI_GetLayerListBySysDicID(string userToken, XCLCMS.Data.WebAPIEntity.RequestEntity.SysDic.GetLayerListBySysDicIDEntity entity)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.SysDic.GetLayerListBySysDicIDEntity>(userToken);
            request.Body = entity;
            var response = XCLCMS.Lib.WebAPI.SysDicAPI.GetLayerListBySysDicID(request);
            if (null == response)
            {
                return null;
            }
            return response.Body;
        }

        /// <summary>
        /// 获取XCLCMS管理后台系统的菜单
        /// </summary>
        public static List<XCLCMS.Data.Model.View.v_SysDic> SysDicAPI_GetSystemMenuModelList(string userToken)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<object>(userToken);
            request.Body = new object();
            var response = XCLCMS.Lib.WebAPI.SysDicAPI.GetSystemMenuModelList(request);
            if (null == response)
            {
                return null;
            }
            return response.Body;
        }

        /// <summary>
        /// 根据SysDicID查询其子项
        /// </summary>
        public static List<XCLCMS.Data.Model.SysDic> SysDicAPI_GetChildListByID(string userToken, long sysDicID)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(userToken);
            request.Body = sysDicID;
            var response = XCLCMS.Lib.WebAPI.SysDicAPI.GetChildListByID(request);
            if (null == response)
            {
                return null;
            }
            return response.Body;
        }

        #endregion SysDicAPI相关

        #region SysFunctionAPI相关

        /// <summary>
        /// 获取当前SysFunctionID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        public static List<XCLCMS.Data.Model.Custom.SysFunctionSimple> SysFunctionAPI_GetLayerListBySysFunctionId(string userToken, XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.GetLayerListBySysFunctionIdEntity entity)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.GetLayerListBySysFunctionIdEntity>(userToken);
            request.Body = entity;
            var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.GetLayerListBySysFunctionId(request);
            if (null == response)
            {
                return null;
            }
            return response.Body;
        }

        /// <summary>
        /// 获取指定角色的所有功能
        /// </summary>
        public static List<XCLCMS.Data.Model.SysFunction> SysFunctionAPI_GetListByRoleID(string userToken, long sysRoleID)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(userToken);
            request.Body = sysRoleID;
            var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.GetListByRoleID(request);
            if (null == response)
            {
                return null;
            }
            return response.Body;
        }

        #endregion SysFunctionAPI相关

        #region SysRoleAPI 相关

        /// <summary>
        /// 获取当前SysRoleID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        public static List<XCLCMS.Data.Model.Custom.SysRoleSimple> SysRoleAPI_GetLayerListBySysRoleID(string userToken, XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.GetLayerListBySysRoleIDEntity entity)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.GetLayerListBySysRoleIDEntity>(userToken);
            request.Body = entity;
            var response = XCLCMS.Lib.WebAPI.SysRoleAPI.GetLayerListBySysRoleID(request);
            if (null == response)
            {
                return null;
            }
            return response.Body;
        }

        #endregion SysRoleAPI 相关
    }
}