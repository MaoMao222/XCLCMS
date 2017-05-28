using System;
using System.Collections.Generic;
using System.Linq;
using XCLCMS.Data.Model;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;
using XCLCMS.IService.WebAPI;
using XCLNetTools.Generic;

namespace XCLCMS.Service.WebAPI
{
    /// <summary>
    /// 评论
    /// </summary>
    public class CommentsService : ICommentsService
    {
        private XCLCMS.Data.BLL.Comments commentsBLL = new XCLCMS.Data.BLL.Comments();
        private XCLCMS.Data.BLL.View.v_Comments vCommentsBLL = new Data.BLL.View.v_Comments();
        private XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();
        private XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 评论详情
        /// </summary>
        public APIResponseEntity<Data.Model.Comments> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.Comments>();
            response.Body = commentsBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 评论分页列表
        /// </summary>
        public APIResponseEntity<PageListResponseEntity<v_Comments>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            var pager = request.Body.PagerInfoSimple.ToPagerInfo();
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Comments>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_Comments>();
            response.Body.ResultList = vCommentsBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
            {
                OrderBy = "[CommentsID] desc",
                Where = request.Body.Where
            });
            response.Body.PagerInfo = pager;
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 新增评论
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<Comments> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            request.Body.Contents = (request.Body.Contents ?? "").Trim();
            request.Body.UserName = request.Body.UserName?.Trim();
            request.Body.Email = request.Body.Email?.Trim();

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            if (string.IsNullOrWhiteSpace(request.Body.Contents))
            {
                response.IsSuccess = false;
                response.Message = "请提供评论内容！";
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

            request.Body.CreaterID = this.ContextInfo.UserInfoID;
            request.Body.CreaterName = this.ContextInfo.UserName;
            request.Body.CreateTime = DateTime.Now;
            request.Body.UpdaterID = request.Body.CreaterID;
            request.Body.UpdaterName = request.Body.CreaterName;
            request.Body.UpdateTime = request.Body.CreateTime;
            response.IsSuccess = this.commentsBLL.Add(request.Body);

            if (response.IsSuccess)
            {
                response.Message = "评论信息添加成功！";
            }
            else
            {
                response.Message = "评论信息添加失败！";
            }

            return response;
        }

        /// <summary>
        /// 修改评论
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<Comments> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            var model = this.commentsBLL.GetModel(request.Body.CommentsID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的评论信息！";
                return response;
            }

            request.Body.Contents = (request.Body.Contents ?? "").Trim();
            request.Body.UserName = request.Body.UserName?.Trim();
            request.Body.Email = request.Body.Email?.Trim();

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
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

            model.UserName = request.Body.UserName;
            model.Email = request.Body.Email;
            model.Remark = request.Body.Remark;
            model.FK_MerchantID = request.Body.FK_MerchantID;
            model.FK_MerchantAppID = request.Body.FK_MerchantAppID;
            model.RecordState = request.Body.RecordState;
            model.UpdaterID = this.ContextInfo.UserInfoID;
            model.UpdaterName = this.ContextInfo.UserName;
            model.UpdateTime = DateTime.Now;
            model.Contents = request.Body.Contents;
            model.BadCount = request.Body.BadCount;
            model.FK_ObjectID = request.Body.FK_ObjectID;
            model.GoodCount = request.Body.GoodCount;
            model.MiddleCount = request.Body.MiddleCount;
            model.ObjectType = request.Body.ObjectType;
            model.ParentCommentID = request.Body.ParentCommentID;
            model.UserName = request.Body.UserName;
            model.VerifyState = request.Body.VerifyState;

            response.IsSuccess = this.commentsBLL.Update(model);
            if (response.IsSuccess)
            {
                response.Message = "评论信息修改成功！";
            }
            else
            {
                response.Message = "评论信息修改失败！";
            }
            return response;
        }

        /// <summary>
        /// 删除评论
        /// </summary>
        public APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            var response = new APIResponseEntity<bool>();

            if (request.Body.IsNotNullOrEmpty())
            {
                request.Body = request.Body.Where(k => k > 0).Distinct().ToList();
            }

            if (request.Body.IsNullOrEmpty())
            {
                response.IsSuccess = false;
                response.Message = "请指定要删除的评论ID！";
                return response;
            }

            foreach (var k in request.Body)
            {
                var model = this.commentsBLL.GetModel(k);
                if (null == model)
                {
                    continue;
                }

                model.UpdaterID = this.ContextInfo.UserInfoID;
                model.UpdaterName = this.ContextInfo.UserName;
                model.UpdateTime = DateTime.Now;
                model.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.R.ToString();
                if (!this.commentsBLL.Update(model))
                {
                    response.IsSuccess = false;
                    response.Message = "评论删除失败！";
                    return response;
                }
            }

            response.IsSuccess = true;
            response.Message = "已成功删除评论！";
            response.IsRefresh = true;

            return response;
        }
    }
}