using System;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.IService.WebAPI;

namespace XCLCMS.Service.WebAPI
{
    /// <summary>
    /// 日志
    /// </summary>
    public class SysLogService : ISysLogService
    {
        private readonly XCLCMS.Data.BLL.SysLog sysLogBLL = new Data.BLL.SysLog();
        private readonly XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();
        private readonly XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 查询系统日志信息分页列表
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.SysLog>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            var pager = request.Body.PagerInfoSimple.ToPagerInfo();
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.SysLog>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.SysLog>();

            response.Body.ResultList = sysLogBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
            {
                OrderBy = "[SysLogID] desc",
                Where = request.Body.Where
            });
            response.Body.PagerInfo = pager;
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 新增系统日志
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.SysLog> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            request.Body.Title = (request.Body.Title ?? "").Trim();
            request.Body.Code = (request.Body.Code ?? string.Empty).Trim();
            request.Body.Contents = request.Body.Contents?.Trim();
            request.Body.Remark = request.Body.Remark?.Trim();

            //必须提供有效的AppKey
            var app = this.merchantAppBLL.GetModel(request.AppKey);
            if (null == app)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户Key！";
                return response;
            }

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            if (app.FK_MerchantID != merchant.MerchantID)
            {
                response.IsSuccess = false;
                response.Message = "商户标识不匹配！";
                return response;
            }

            if (string.IsNullOrWhiteSpace(request.Body.Title))
            {
                response.IsSuccess = false;
                response.Message = "请提供日志标题！";
                return response;
            }

            //应用号与商户一致
            if (!this.merchantAppBLL.IsTheSameMerchantInfoID(request.Body.FK_MerchantID, request.Body.FK_MerchantAppID))
            {
                response.IsSuccess = false;
                response.Message = "商户号与应用号不匹配，请核对后再试！";
                return response;
            }

            #endregion 数据校验

            request.Body.CreateTime = DateTime.Now;
            response.IsSuccess = this.sysLogBLL.Add(request.Body);

            if (response.IsSuccess)
            {
                response.Message = "日志信息添加成功！";
            }
            else
            {
                response.Message = "日志信息添加失败！";
            }

            return response;
        }

        /// <summary>
        /// 批量删除系统日志信息
        /// </summary>
        public APIResponseEntity<bool> Delete(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysLog.ClearConditionEntity> request)
        {
            var response = new APIResponseEntity<bool>();
            if (this.sysLogBLL.ClearListByDateTime(request.Body.StartTime, request.Body.EndTime, request.Body.MerchantID))
            {
                response.IsSuccess = true;
                response.IsRefresh = true;
                response.Message = "删除成功！";
            }
            else
            {
                response.IsSuccess = false;
                response.Message = "删除失败！";
            }
            return response;
        }
    }
}