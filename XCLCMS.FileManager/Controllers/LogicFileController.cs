using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace XCLCMS.FileManager.Controllers
{
    public class LogicFileController : BaseController
    {
        /// <summary>
        /// 逻辑文件列表
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FileManager_LogicFileView)]
        public ActionResult List()
        {
            XCLCMS.FileManager.Models.LogicFile.ListVM viewModel = new Models.LogicFile.ListVM();
            viewModel.IsSelectFile = XCLNetTools.StringHander.FormHelper.GetInt("IsSelectFile") == 1;
            viewModel.SelectFileCallBack = XCLNetTools.StringHander.FormHelper.GetString("selectFileCallback");

            #region 初始化查询条件

            viewModel.Search = new XCLNetSearch.Search();
            viewModel.Search.TypeList = new List<XCLNetSearch.SearchFieldInfo>() {
                new XCLNetSearch.SearchFieldInfo("文件ID","AttachmentID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("主文件ID","ParentID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("所属商户","FK_MerchantID|number|text",""),
                new XCLNetSearch.SearchFieldInfo("标题","Title|string|text",""),
                new XCLNetSearch.SearchFieldInfo("文件名","OriginFileName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("查看类型","ViewType|string|text",""),
                new XCLNetSearch.SearchFieldInfo("格式类型","FormatType|string|text",""),
                new XCLNetSearch.SearchFieldInfo("扩展名","Ext|string|text",""),
                new XCLNetSearch.SearchFieldInfo("相对路径","URL|string|text",""),
                new XCLNetSearch.SearchFieldInfo("描述信息","Description|string|text",""),
                new XCLNetSearch.SearchFieldInfo("下载数","DownLoadCount|number|text",""),
                new XCLNetSearch.SearchFieldInfo("查看数","ViewCount|number|text",""),
                new XCLNetSearch.SearchFieldInfo("大小（kb）","FileSize|number|text",""),
                new XCLNetSearch.SearchFieldInfo("图片宽度（如果是图片）","ImgWidth|number|text",""),
                new XCLNetSearch.SearchFieldInfo("图片高度（如果是图片）","ImgHeight|number|text",""),

                new XCLNetSearch.SearchFieldInfo("创建时间","CreateTime|dateTime|text",""),
                new XCLNetSearch.SearchFieldInfo("创建者名","CreaterName|string|text",""),
                new XCLNetSearch.SearchFieldInfo("更新时间","UpdateTime|dateTime|text",""),
                new XCLNetSearch.SearchFieldInfo("更新人名","UpdaterName|string|text","")
            };
            string strWhere = XCLNetTools.DataBase.SQLLibrary.JoinWithAnd(new List<string>() {
                     string.Format("RecordState='{0}'", XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString()),
                     viewModel.Search.StrSQL
                 });

            #endregion 初始化查询条件

            base.PageParamsInfo.PageSize = 15;
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.PageListConditionEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.PageListConditionEntity()
            {
                PagerInfoSimple = base.PageParamsInfo.ToPagerInfoSimple(),
                Where = strWhere
            };
            var response = XCLCMS.Lib.WebAPI.AttachmentAPI.PageList(request).Body;
            viewModel.AttachmentList = response.ResultList;
            viewModel.PagerModel = response.PagerInfo;

            if (viewModel.IsSelectFile)
            {
                ViewBag.IsShowNav = false;
                return View("~/Views/LogicFile/Select.cshtml", viewModel);
            }
            else
            {
                return View(viewModel);
            }
        }

        /// <summary>
        /// 查看文件详情
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FileManager_LogicFileView)]
        public ActionResult Show()
        {
            XCLCMS.FileManager.Models.LogicFile.ShowVM viewModel = new Models.LogicFile.ShowVM();
            viewModel.AttachmentID = XCLNetTools.StringHander.FormHelper.GetLong("AttachmentID");

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.DetailEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.Attachment.DetailEntity();
            request.Body.AttachmentID = viewModel.AttachmentID;
            request.Body.IsContainsSubAttachmentList = true;
            var response = XCLCMS.Lib.WebAPI.AttachmentAPI.Detail(request);
            viewModel.Attachment = response.Body.Attachment ?? new Data.Model.View.v_Attachment();
            viewModel.SubAttachmentList = response.Body.SubAttachmentList;

            return View(viewModel);
        }

        /// <summary>
        /// 修改文件信息
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FileManager_LogicFileUpdate)]
        public ActionResult Update()
        {
            XCLCMS.FileManager.Models.LogicFile.UpdateVM viewModel = new Models.LogicFile.UpdateVM();
            viewModel.AttachmentID = XCLNetTools.StringHander.FormHelper.GetLong("AttachmentID");

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.DetailEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.Attachment.DetailEntity();
            request.Body.AttachmentID = viewModel.AttachmentID;
            var response = XCLCMS.Lib.WebAPI.AttachmentAPI.Detail(request);
            viewModel.Attachment = response.Body.Attachment ?? new Data.Model.View.v_Attachment();

            return View(viewModel);
        }

        /// <summary>
        /// 修改文件信息 提交操作
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FileManager_LogicFileUpdate)]
        public override ActionResult UpdateSubmit(FormCollection fm)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.Model.Attachment>(base.UserToken);
            request.Body = new Data.Model.Attachment();
            request.Body.FK_MerchantID = XCLNetTools.StringHander.FormHelper.GetLong("FK_MerchantID");
            request.Body.AttachmentID = XCLNetTools.StringHander.FormHelper.GetLong("AttachmentID");
            request.Body.Title = XCLNetTools.StringHander.FormHelper.GetString("Title");
            request.Body.Description = XCLNetTools.StringHander.FormHelper.GetString("Description");
            var response = XCLCMS.Lib.WebAPI.AttachmentAPI.Update(request);
            return Json(response);
        }

        /// <summary>
        /// 文件删除操作
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FileManager_LogicFileDel)]
        public override ActionResult DelSubmit(FormCollection fm)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.FileInfo.DeleteEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.FileInfo.DeleteEntity();
            request.Body.IDList = (XCLNetTools.StringHander.FormHelper.GetString("attachmentIDs") ?? "").Split(',').ToList().ConvertAll(k => XCLNetTools.Common.DataTypeConvert.ToLong(k));
            request.Body.RootPath = XCLNetTools.FileHandler.ComFile.MapPath(XCLCMS.FileManager.Common.Library.FileManager_UploadPath);
            request.Body.TopPath = XCLCMS.FileManager.Common.Library.FileManager_UploadPath;
            var response = XCLCMS.Lib.WebAPI.AttachmentAPI.Delete(request);
            response.IsRefresh = response.IsSuccess;
            return Json(response);
        }
    }
}