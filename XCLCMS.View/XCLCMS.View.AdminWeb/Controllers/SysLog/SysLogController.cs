using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace XCLCMS.View.AdminWeb.Controllers.SysLog
{
    /// <summary>
    /// 日志controller
    /// </summary>
    public class SysLogController : BaseController
    {
        /// <summary>
        /// 日志列表
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysLogView)]
        public ActionResult Index()
        {
            XCLCMS.View.AdminWeb.Models.SysLog.SysLogListVM viewModel = new XCLCMS.View.AdminWeb.Models.SysLog.SysLogListVM();

            #region 初始化查询条件

            viewModel.Search = new XCLNetSearch.Search();
            viewModel.Search.TypeList = new List<XCLNetSearch.SearchFieldInfo>() {
                new XCLNetSearch.SearchFieldInfo("日志ID","SysLogID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户号","FK_MerchantID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属应用号","FK_MerchantAppID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("日志级别","LogLevel|string|text",""),
                new XCLNetSearch.SearchFieldInfo("日志类别","LogType|string|text",""),
                new XCLNetSearch.SearchFieldInfo("来源URL","RefferUrl|string|text",""),
                new XCLNetSearch.SearchFieldInfo("Url","Url|string|text",""),
                new XCLNetSearch.SearchFieldInfo("日志代码","Code|string|text",""),
                new XCLNetSearch.SearchFieldInfo("标题","Title|string|text",""),
                new XCLNetSearch.SearchFieldInfo("内容","Contents|string|text",""),
                new XCLNetSearch.SearchFieldInfo("客户端IP","ClientIP|string|text",""),
                new XCLNetSearch.SearchFieldInfo("备注","Remark|string|text",""),
                new XCLNetSearch.SearchFieldInfo("创建时间",string.Format("CreateTime|dateTime{0}|text",(int)XCLNetSearch.Common.SearchDateFmt.yyyy_MM_dd_HH_mm_ss),"","yyyy-MM-dd HH:mm:ss")
            };
            string strWhere = viewModel.Search.StrSQL;

            #endregion 初始化查询条件

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.PageListConditionEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.PageListConditionEntity()
            {
                PagerInfoSimple = base.PageParamsInfo.ToPagerInfoSimple(),
                Where = strWhere
            };
            var response = XCLCMS.Lib.WebAPI.SysLogAPI.PageList(request).Body;

            viewModel.SysLogList = response.ResultList;
            viewModel.PagerModel = response.PagerInfo;

            viewModel.ClearLogDateTypeList = XCLNetTools.Enum.EnumHelper.GetEnumFieldModelList(typeof(XCLNetTools.Enum.CommonEnum.BeforeDateTypeEnum));

            return View("~/Views/SysLog/SysLogList.cshtml", viewModel);
        }

        /// <summary>
        /// 清空日志
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysLogDel)]
        public ActionResult ClearSubmit()
        {
            XCLNetTools.Enum.CommonEnum.BeforeDateTypeEnum dateType;
            Enum.TryParse<XCLNetTools.Enum.CommonEnum.BeforeDateTypeEnum>(XCLNetTools.StringHander.FormHelper.GetString("dateType"), out dateType);

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.SysLog.ClearConditionEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.SysLog.ClearConditionEntity()
            {
                EndTime = XCLNetTools.StringHander.DateHelper.GetBeforeDateTypeDateTime(dateType)
            };
            var response = XCLCMS.Lib.WebAPI.SysLogAPI.Delete(request);

            return Json(response);
        }
    }
}