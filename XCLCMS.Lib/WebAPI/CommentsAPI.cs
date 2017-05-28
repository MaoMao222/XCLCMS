using System.Collections.Generic;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 评论管理 API
    /// </summary>
    public static class CommentsAPI
    {
        /// <summary>
        /// 查询评论信息实体
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.Comments> Detail(APIRequestEntity<long> request)
        {
            return Library.Request<long, XCLCMS.Data.Model.Comments>(request, "Comments/Detail");
        }

        /// <summary>
        /// 查询评论信息分页列表
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Comments>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            return Library.Request<PageListConditionEntity, XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Comments>>(request, "Comments/PageList");
        }

        /// <summary>
        /// 新增评论信息
        /// </summary>
        public static APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.Comments> request)
        {
            return Library.Request<XCLCMS.Data.Model.Comments, bool>(request, "Comments/Add", false);
        }

        /// <summary>
        /// 修改评论信息
        /// </summary>
        public static APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.Comments> request)
        {
            return Library.Request<XCLCMS.Data.Model.Comments, bool>(request, "Comments/Update", false);
        }

        /// <summary>
        /// 删除评论信息
        /// </summary>
        public static APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            return Library.Request<List<long>, bool>(request, "Comments/Delete", false);
        }
    }
}