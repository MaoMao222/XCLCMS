using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 系统日志 API
    /// </summary>
    public static class SysLogAPI
    {
        /// <summary>
        /// 查询系统日志信息分页列表
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.SysLog>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            return Library.Request<PageListConditionEntity, XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.SysLog>>(request, "SysLog/PageList");
        }

        /// <summary>
        /// 添加日志信息
        /// </summary>
        public static APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.SysLog> request)
        {
            return Library.Request<XCLCMS.Data.Model.SysLog, bool>(request, "SysLog/Add", false);
        }

        /// <summary>
        /// 删除日志信息
        /// </summary>
        public static APIResponseEntity<bool> Delete(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysLog.ClearConditionEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.SysLog.ClearConditionEntity, bool>(request, "SysLog/Delete", false);
        }
    }
}