using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace XCLCMS.FileManager.Controllers
{
    public class FileInfoController : BaseController
    {
        /// <summary>
        /// 磁盘文件列表页
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FileManager_DiskFileView)]
        public ActionResult List()
        {
            Models.FileInfo.ListVM viewModel = this.GetFormViewModel();
            if (string.IsNullOrEmpty(viewModel.CurrentDirectory))
            {
                viewModel.CurrentDirectory = XCLCMS.FileManager.Common.Library.FileManager_UploadPath;
            }
            viewModel.CurrentDirectory = viewModel.CurrentDirectory.TrimEnd('/') + '/';

            viewModel.DirectoryNavigation = new List<XCLNetTools.Entity.TextValue>();
            var navArray = viewModel.CurrentDirectory.TrimStart(XCLCMS.FileManager.Common.Library.FileManager_UploadPath.ToCharArray()).Trim('/').Split('/');
            StringBuilder link = new StringBuilder();
            for (int i = 0; i < navArray.Length; i++)
            {
                var s = navArray[i];
                link.Append(s + "/");
                viewModel.DirectoryNavigation.Add(new XCLNetTools.Entity.TextValue()
                {
                    Text = s,
                    Value = string.Format("{0}{1}", XCLCMS.FileManager.Common.Library.FileManager_UploadPath, link.ToString())
                });
            }

            return View(viewModel);
        }

        private Models.FileInfo.ListVM GetFormViewModel()
        {
            Models.FileInfo.ListVM viewModel = new Models.FileInfo.ListVM();
            viewModel.CurrentDirectory = HttpUtility.UrlDecode(XCLNetTools.StringHander.FormHelper.GetString("dir"));
            return viewModel;
        }

        /// <summary>
        /// 查询磁盘文件列表
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FileManager_DiskFileView)]
        public JsonResult GetFileList()
        {
            var viewModel = this.GetFormViewModel();

            XCLNetTools.Message.MessageModel msg = new XCLNetTools.Message.MessageModel();
            msg.IsSuccess = true;

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.FileInfo.DiskFileListEntity>(base.UserToken);
            request.Body = new Data.WebAPIEntity.RequestEntity.FileInfo.DiskFileListEntity();
            request.Body.CurrentDirectory = XCLNetTools.FileHandler.ComFile.MapPath(viewModel.CurrentDirectory);
            request.Body.RootPath = XCLNetTools.FileHandler.ComFile.MapPath(XCLCMS.FileManager.Common.Library.FileManager_UploadPath);
            request.Body.WebRootPath = XCLCMS.FileManager.Common.Library.FileManager_UploadPath.Replace("~/", XCLNetTools.StringHander.Common.RootUri);
            var response = XCLCMS.Lib.WebAPI.FileInfoAPI.DiskFileList(request);
            msg.CustomObject = response.Body;

            return new XCLNetTools.MVC.JsonResultFormat()
            {
                Data = msg,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        /// <summary>
        /// 磁盘文件删除
        /// </summary>
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.FileManager_DiskFileDel)]
        public override ActionResult DelSubmit(FormCollection fm)
        {
            XCLNetTools.Message.MessageModel msg = new XCLNetTools.Message.MessageModel();
            var paths = (XCLNetTools.StringHander.FormHelper.GetString("paths") ?? "").Split(',').ToList();
            if (null == paths || paths.Count == 0)
            {
                msg.IsSuccess = false;
                msg.Message = "请指定要删除的文件！";
                return Json(msg);
            }
            string p = string.Empty;
            foreach (var m in paths)
            {
                if (string.IsNullOrWhiteSpace(m))
                {
                    continue;
                }
                p = System.Web.HttpUtility.UrlDecode(m);
                //安全起见，删除前判断是否为指定的目录
                if (p.IndexOf(Server.MapPath(XCLCMS.FileManager.Common.Library.FileManager_UploadPath)) >= 0)
                {
                    XCLNetTools.FileHandler.ComFile.DeleteFile(p);
                    XCLNetTools.FileHandler.FileDirectory.DelTree(p);
                }
                else
                {
                    msg.IsSuccess = false;
                    msg.Message = "非法的删除操作！";
                    return Json(msg);
                }
            }
            msg.IsSuccess = true;
            msg.Message = "删除成功！";
            return Json(msg);
        }
    }
}