using Newtonsoft.Json;
using RestSharp;
using System;
using System.Text;
using System.Web;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// WEB API Client
    /// </summary>
    public static class Library
    {
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
            RestClient client = null;

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
            httpRequest.AddHeader("XCLCMSHeaders", XCLNetTools.Serialize.JSON.Serialize(new XCLCMS.Lib.Model.ActionContextInfoEntity()
            {
                AppID = request.AppID,
                AppKey = request.AppKey,
                UserToken = request.UserToken
            }));
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
    }
}