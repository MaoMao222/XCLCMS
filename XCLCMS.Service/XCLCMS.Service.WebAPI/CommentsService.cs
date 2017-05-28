using System;
using System.Collections.Generic;
using XCLCMS.Data.Model;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;
using XCLCMS.IService.WebAPI;

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
        /// 新增评论
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<Comments> request)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 删除评论
        /// </summary>
        public APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 评论详情
        /// </summary>
        public APIResponseEntity<Data.Model.Comments> Detail(APIRequestEntity<long> request)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 评论分页列表
        /// </summary>
        public APIResponseEntity<PageListResponseEntity<v_Comments>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 修改评论
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<Comments> request)
        {
            throw new NotImplementedException();
        }
    }
}