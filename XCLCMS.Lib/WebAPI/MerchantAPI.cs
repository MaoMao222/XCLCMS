using System.Collections.Generic;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 商户信息API
    /// </summary>
    public static class MerchantAPI
    {
        /// <summary>
        /// 查询商户信息实体
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.View.v_Merchant> Detail(APIRequestEntity<long> request)
        {
            return Library.Request<long, XCLCMS.Data.Model.View.v_Merchant>(request, "Merchant/Detail");
        }

        /// <summary>
        /// 查询商户信息分页列表
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Merchant>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            return Library.Request<PageListConditionEntity, XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Merchant>>(request, "Merchant/PageList");
        }

        /// <summary>
        /// 获取商户类型
        /// </summary>
        public static APIResponseEntity<Dictionary<string, long>> GetMerchantTypeDic(APIRequestEntity<object> request)
        {
            return Library.Request<object, Dictionary<string, long>>(request, "Merchant/GetMerchantTypeDic");
        }

        /// <summary>
        /// 判断商户名是否存在
        /// </summary>
        public static APIResponseEntity<bool> IsExistMerchantName(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Merchant.IsExistMerchantNameEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.Merchant.IsExistMerchantNameEntity, bool>(request, "Merchant/IsExistMerchantName", false);
        }

        /// <summary>
        /// 新增商户信息
        /// </summary>
        public static APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.Merchant> request)
        {
            return Library.Request<XCLCMS.Data.Model.Merchant, bool>(request, "Merchant/Add", false);
        }

        /// <summary>
        /// 修改商户信息
        /// </summary>
        public static APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.Merchant> request)
        {
            return Library.Request<XCLCMS.Data.Model.Merchant, bool>(request, "Merchant/Update", false);
        }

        /// <summary>
        /// 删除商户信息
        /// </summary>
        public static APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            return Library.Request<List<long>, bool>(request, "Merchant/Delete", false);
        }
    }
}