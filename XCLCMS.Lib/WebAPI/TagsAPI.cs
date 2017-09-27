using System.Collections.Generic;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 标签 API
    /// </summary>
    public static class TagsAPI
    {
        /// <summary>
        /// 查询标签信息实体
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.Tags> Detail(APIRequestEntity<long> request)
        {
            return Library.Request<long, XCLCMS.Data.Model.Tags>(request, "Tags/Detail");
        }

        /// <summary>
        /// 查询标签信息分页列表
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Tags>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            return Library.Request<PageListConditionEntity, XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Tags>>(request, "Tags/PageList");
        }

        /// <summary>
        /// 查询指定对象的所有标签列表
        /// </summary>
        public static APIResponseEntity<List<Data.Model.Tags>> GetObjectTags(APIRequestEntity<Tags_ObjectTagsCondition> request)
        {
            return Library.Request<Tags_ObjectTagsCondition, List<Data.Model.Tags>>(request, "Tags/GetObjectTags");
        }

        /// <summary>
        /// 判断标签标题是否存在
        /// </summary>
        public static APIResponseEntity<bool> IsExistTagName(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Tags.IsExistTagNameEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.Tags.IsExistTagNameEntity, bool>(request, "Tags/IsExistTagName");
        }

        /// <summary>
        /// 新增标签信息
        /// </summary>
        public static APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.Tags> request)
        {
            return Library.Request<XCLCMS.Data.Model.Tags, bool>(request, "Tags/Add", false);
        }

        /// <summary>
        /// 修改标签信息
        /// </summary>
        public static APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.Tags> request)
        {
            return Library.Request<XCLCMS.Data.Model.Tags, bool>(request, "Tags/Update", false);
        }

        /// <summary>
        /// 删除标签信息
        /// </summary>
        public static APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            return Library.Request<List<long>, bool>(request, "Tags/Delete", false);
        }
    }
}