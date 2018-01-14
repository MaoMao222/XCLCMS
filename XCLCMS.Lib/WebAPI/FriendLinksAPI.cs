using System.Collections.Generic;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 友情链接 API
    /// </summary>
    public static class FriendLinksAPI
    {
        /// <summary>
        /// 查询友情链接信息实体
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.View.v_FriendLinks> Detail(APIRequestEntity<long> request)
        {
            return Library.Request<long, XCLCMS.Data.Model.View.v_FriendLinks>(request, "FriendLinks/Detail");
        }

        /// <summary>
        /// 查询友情链接信息分页列表
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_FriendLinks>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            return Library.Request<PageListConditionEntity, XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_FriendLinks>>(request, "FriendLinks/PageList");
        }

        /// <summary>
        /// 判断友情链接标题是否存在
        /// </summary>
        public static APIResponseEntity<bool> IsExistTitle(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.FriendLinks.IsExistTitleEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.FriendLinks.IsExistTitleEntity, bool>(request, "FriendLinks/IsExistTitle");
        }

        /// <summary>
        /// 新增友情链接信息
        /// </summary>
        public static APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.FriendLinks> request)
        {
            return Library.Request<XCLCMS.Data.Model.FriendLinks, bool>(request, "FriendLinks/Add", false);
        }

        /// <summary>
        /// 修改友情链接信息
        /// </summary>
        public static APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.FriendLinks> request)
        {
            return Library.Request<XCLCMS.Data.Model.FriendLinks, bool>(request, "FriendLinks/Update", false);
        }

        /// <summary>
        /// 删除友情链接信息
        /// </summary>
        public static APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            return Library.Request<List<long>, bool>(request, "FriendLinks/Delete", false);
        }
    }
}