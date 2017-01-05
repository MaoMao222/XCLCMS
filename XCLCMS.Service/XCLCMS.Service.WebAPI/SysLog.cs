using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.Service.WebAPI
{
    /// <summary>
    /// 日志
    /// </summary>
    public class SysLog : BaseInfo
    {
        public XCLCMS.Data.BLL.SysLog sysLogBLL = new Data.BLL.SysLog();

        public SysLog(XCLCMS.Data.Model.Custom.ContextModel contextModel) : base(contextModel)
        {
        }

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
        /// 批量删除系统日志信息
        /// </summary>
        public APIResponseEntity<bool> Delete(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysLog.ClearConditionEntity> request, long merchantID = 0)
        {
            var response = new APIResponseEntity<bool>();
            if (this.sysLogBLL.ClearListByDateTime(request.Body.StartTime, request.Body.EndTime, merchantID))
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