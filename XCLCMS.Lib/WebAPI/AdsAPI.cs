using System.Collections.Generic;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 广告位管理 API
    /// </summary>
    public static class AdsAPI
    {
        /// <summary>
        /// 查询广告信息实体
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.Ads> Detail(APIRequestEntity<long> request)
        {
            return Library.Request<long, XCLCMS.Data.Model.Ads>(request, "Ads/Detail");
        }

        /// <summary>
        /// 根据code来查询广告信息实体
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.Ads> DetailByCode(APIRequestEntity<string> request)
        {
            return Library.Request<string, XCLCMS.Data.Model.Ads>(request, "Ads/DetailByCode");
        }

        /// <summary>
        /// 查询广告信息分页列表
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Ads>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            return Library.Request<PageListConditionEntity, XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Ads>>(request, "Ads/PageList");
        }

        /// <summary>
        /// 检查广告code是否已存在
        /// </summary>
        public static APIResponseEntity<bool> IsExistCode(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Ads.IsExistCodeEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.Ads.IsExistCodeEntity, bool>(request, "Ads/IsExistCode");
        }

        /// <summary>
        /// 新增广告信息
        /// </summary>
        public static APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.Ads> request)
        {
            return Library.Request<XCLCMS.Data.Model.Ads, bool>(request, "Ads/Add", false);
        }

        /// <summary>
        /// 修改广告信息
        /// </summary>
        public static APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.Ads> request)
        {
            return Library.Request<XCLCMS.Data.Model.Ads, bool>(request, "Ads/Update", false);
        }

        /// <summary>
        /// 删除广告信息
        /// </summary>
        public static APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            return Library.Request<List<long>, bool>(request, "Ads/Delete", false);
        }
    }
}