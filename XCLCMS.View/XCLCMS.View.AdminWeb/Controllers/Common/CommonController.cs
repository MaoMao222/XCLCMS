using System.Linq;
using System.Web.Mvc;

namespace XCLCMS.View.AdminWeb.Controllers.Common
{
    /// <summary>
    /// 公共controller
    /// </summary>
    public class CommonController : BaseController
    {
        /// <summary>
        /// 清理缓存
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_ClearCache)]
        public JsonResult ClearCache()
        {
            XCLCMS.Lib.Common.Comm.ClearCache();
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();
            msgModel.IsSuccess = true;
            msgModel.IsRefresh = true;
            msgModel.Message = "缓存清理成功！";
            return Json(msgModel, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 垃圾数据清理
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_ClearRubbishData)]
        public JsonResult ClearRubbishData()
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<object>(base.UserToken);
            request.Body = new object();
            var response = XCLCMS.Lib.WebAPI.CommonAPI.ClearRubbishData(request);
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 根据文件id查询文件详情
        /// </summary>
        /// <returns></returns>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FileManager_LogicFileView)]
        public JsonResult GetFileInfo()
        {
            var ids = (XCLNetTools.StringHander.FormHelper.GetString("FileID") ?? "").Split(',').ToList().ConvertAll(k => XCLNetTools.Common.DataTypeConvert.ToLong(k));
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.GetAttachmentListByIDListEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.Attachment.GetAttachmentListByIDListEntity();
            request.Body.AttachmentIDList = ids;
            var response = XCLCMS.Lib.WebAPI.AttachmentAPI.GetAttachmentListByIDList(request);

            msgModel.CustomObject = response.Body;
            msgModel.IsSuccess = response.IsSuccess;
            return Json(msgModel, JsonRequestBehavior.AllowGet);
        }
    }
}