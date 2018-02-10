using System.Collections.Generic;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 产品管理 API
    /// </summary>
    public static class ProductAPI
    {
        /// <summary>
        /// 查询产品信息实体
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.View.v_Product> Detail(APIRequestEntity<long> request)
        {
            return Library.Request<long, XCLCMS.Data.Model.View.v_Product>(request, "Product/Detail");
        }

        /// <summary>
        /// 根据产品关系信息查询产品列表
        /// </summary>
        public static APIResponseEntity<List<XCLCMS.Data.Model.Product>> GetObjectProductList(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Product.GetObjectProductListEntity> request)
        {
            return Library.Request<XCLCMS.Data.WebAPIEntity.RequestEntity.Product.GetObjectProductListEntity, List<XCLCMS.Data.Model.Product>>(request, "Product/GetObjectProductList");
        }

        /// <summary>
        /// 查询产品信息分页列表
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Product>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            return Library.Request<PageListConditionEntity, XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Product>>(request, "Product/PageList");
        }

        /// <summary>
        /// 新增产品信息
        /// </summary>
        public static APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.Product> request)
        {
            return Library.Request<XCLCMS.Data.Model.Product, bool>(request, "Product/Add", false);
        }

        /// <summary>
        /// 修改产品信息
        /// </summary>
        public static APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.Product> request)
        {
            return Library.Request<XCLCMS.Data.Model.Product, bool>(request, "Product/Update", false);
        }

        /// <summary>
        /// 删除产品信息
        /// </summary>
        public static APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            return Library.Request<List<long>, bool>(request, "Product/Delete", false);
        }
    }
}