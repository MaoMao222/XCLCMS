using System.Collections.Generic;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 商户应用信息API
    /// </summary>
    public static class MerchantAppAPI
    {
        /// <summary>
        /// 查询商户应用信息实体
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.View.v_MerchantApp> Detail(APIRequestEntity<long> request)
        {
            return Library.Request<long, XCLCMS.Data.Model.View.v_MerchantApp>(request, "MerchantApp/Detail");
        }

        /// <summary>
        /// 根据加密后的AppKey查询商户信息
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.Custom.MerchantAppInfoModel> DetailByAppKey(APIRequestEntity<object> request)
        {
            return Library.Request<object, XCLCMS.Data.Model.Custom.MerchantAppInfoModel>(request, "MerchantApp/DetailByAppKey");
        }

        /// <summary>
        /// 查询商户应用信息分页列表
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_MerchantApp>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            return Library.Request<PageListConditionEntity, XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_MerchantApp>>(request, "MerchantApp/PageList");
        }

        /// <summary>
        /// 判断商户应用名是否存在
        /// </summary>
        public static APIResponseEntity<bool> IsExistMerchantAppName(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.MerchantApp.IsExistMerchantAppNameEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.MerchantApp.IsExistMerchantAppNameEntity, bool>(request, "MerchantApp/IsExistMerchantAppName");
        }

        /// <summary>
        /// 新增商户应用信息
        /// </summary>
        public static APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.MerchantApp> request)
        {
            return Library.Request<XCLCMS.Data.Model.MerchantApp, bool>(request, "MerchantApp/Add", false);
        }

        /// <summary>
        /// 修改商户应用信息
        /// </summary>
        public static APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.MerchantApp> request)
        {
            return Library.Request<XCLCMS.Data.Model.MerchantApp, bool>(request, "MerchantApp/Update", false);
        }

        /// <summary>
        /// 删除商户应用信息
        /// </summary>
        public static APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            return Library.Request<List<long>, bool>(request, "MerchantApp/Delete", false);
        }
    }
}