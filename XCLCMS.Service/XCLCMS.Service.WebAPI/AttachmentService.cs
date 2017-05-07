using System;
using System.Collections.Generic;
using System.Linq;
using XCLCMS.Data.Model;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;
using XCLCMS.IService.WebAPI;
using XCLNetTools.Generic;

namespace XCLCMS.Service.WebAPI
{
    /// <summary>
    /// 附件
    /// </summary>
    public class AttachmentService : IAttachmentService
    {
        private XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();
        private XCLCMS.Data.BLL.Attachment attachmentBLL = new XCLCMS.Data.BLL.Attachment();
        private XCLCMS.Data.BLL.ObjectAttachment objectAttachmentBLL = new XCLCMS.Data.BLL.ObjectAttachment();
        public XCLCMS.Data.BLL.View.v_Attachment vAttachmentBLL = new XCLCMS.Data.BLL.View.v_Attachment();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 查询附件信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.Custom.AttachmentWithSubModel> Detail(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.DetailEntity> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.Custom.AttachmentWithSubModel>();
            if (request.Body.IsContainsSubAttachmentList)
            {
                response.Body = vAttachmentBLL.GetModelWithSub(request.Body.AttachmentID);
            }
            else
            {
                response.Body = new AttachmentWithSubModel();
                response.Body.Attachment = this.vAttachmentBLL.GetModel(request.Body.AttachmentID);
            }
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 根据附件关系信息查询附件列表
        /// </summary>
        public APIResponseEntity<List<XCLCMS.Data.Model.Attachment>> GetObjectAttachmentList(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.GetObjectAttachmentListEntity> request)
        {
            var response = new APIResponseEntity<List<XCLCMS.Data.Model.Attachment>>();
            var lst = this.objectAttachmentBLL.GetModelList((XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum)Enum.Parse(typeof(XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum), request.Body.ObjectType), request.Body.ObjectID);
            List<long> ids = new List<long>();
            if (null != lst && lst.Count > 0)
            {
                ids = lst.Select(k => k.FK_AttachmentID).ToList();
            }
            response.Body = this.attachmentBLL.GetList(ids);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 根据文件id，查询文件详情列表
        /// </summary>
        public APIResponseEntity<List<XCLCMS.Data.Model.Attachment>> GetAttachmentListByIDList(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Attachment.GetAttachmentListByIDListEntity> request)
        {
            var response = new APIResponseEntity<List<XCLCMS.Data.Model.Attachment>>();
            response.Body = this.attachmentBLL.GetList(request.Body.AttachmentIDList);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 附件分页列表
        /// </summary>
        public APIResponseEntity<PageListResponseEntity<XCLCMS.Data.Model.View.v_Attachment>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            var pager = request.Body.PagerInfoSimple.ToPagerInfo();
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Attachment>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_Attachment>();
            response.Body.ResultList = vAttachmentBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
            {
                OrderBy = "[AttachmentID] desc",
                Where = request.Body.Where
            });
            response.Body.PagerInfo = pager;
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 添加附件信息
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<Attachment> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            if (string.IsNullOrWhiteSpace(request.Body.URL))
            {
                response.IsSuccess = false;
                response.Message = "必须指定文件路径！";
                return response;
            }

            #endregion 数据校验

            request.Body.CreaterID = this.ContextInfo.UserInfoID;
            request.Body.CreaterName = this.ContextInfo.UserName;
            request.Body.CreateTime = DateTime.Now;
            request.Body.UpdaterID = request.Body.CreaterID;
            request.Body.UpdaterName = request.Body.CreaterName;
            request.Body.UpdateTime = request.Body.CreateTime;
            response.IsSuccess = this.attachmentBLL.Add(request.Body);

            if (response.IsSuccess)
            {
                response.Message = "添加成功！";
            }
            else
            {
                response.Message = "添加失败！";
            }

            return response;
        }

        /// <summary>
        /// 修改附件信息
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<Attachment> request)
        {
            var response = new APIResponseEntity<bool>();

            var model = this.attachmentBLL.GetModel(request.Body.AttachmentID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的附件信息！";
                return response;
            }

            model.Description = request.Body.Description;
            model.Title = request.Body.Title;
            model.UpdaterID = this.ContextInfo.UserInfoID;
            model.UpdaterName = this.ContextInfo.UserName;
            model.UpdateTime = DateTime.Now;

            response.IsSuccess = this.attachmentBLL.Update(model);

            if (response.IsSuccess)
            {
                response.Message = "修改成功！";
            }
            else
            {
                response.Message = "修改失败！";
            }

            return response;
        }

        /// <summary>
        /// 删除附件信息
        /// </summary>
        public APIResponseEntity<bool> Delete(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.FileInfo.DeleteEntity> request)
        {
            var response = new APIResponseEntity<bool>();
            if (request.Body.IDList.IsNullOrEmpty())
            {
                response.IsSuccess = false;
                response.Message = "请指定要删除的附件ID！";
                return response;
            }

            if (string.IsNullOrWhiteSpace(request.Body.RootPath) || string.IsNullOrWhiteSpace(request.Body.TopPath))
            {
                response.IsSuccess = false;
                response.Message = "请指定用于物理删除的路径信息！";
                return response;
            }

            var path = string.Empty;

            //删除数据库信息
            this.attachmentBLL.Delete(request.Body.IDList, this.ContextInfo);

            //删除物理文件
            request.Body.IDList.ForEach(k =>
            {
                var model = this.attachmentBLL.GetModel(k);
                if (null != model && !string.IsNullOrWhiteSpace(model.URL))
                {
                    path = model.URL.Replace(request.Body.TopPath, request.Body.RootPath);
                    if (path.IndexOf(@"\Upload\Files\") >= 0)
                    {
                        XCLNetTools.FileHandler.ComFile.DeleteFile(path);
                    }
                }
            });

            response.IsSuccess = true;
            response.Message = "删除成功！";
            return response;
        }
    }
}