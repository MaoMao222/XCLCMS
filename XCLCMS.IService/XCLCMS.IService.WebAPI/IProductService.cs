using System.Collections.Generic;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;

namespace XCLCMS.IService.WebAPI
{
    public interface IProductService : IBaseInfoService
    {
        APIResponseEntity<bool> Add(APIRequestEntity<Data.Model.Product> request);

        APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request);

        APIResponseEntity<Data.Model.View.v_Product> Detail(APIRequestEntity<long> request);

        APIResponseEntity<PageListResponseEntity<v_Product>> PageList(APIRequestEntity<PageListConditionEntity> request);

        APIResponseEntity<bool> Update(APIRequestEntity<Data.Model.Product> request);

        APIResponseEntity<List<Data.Model.Product>> GetObjectProductList(APIRequestEntity<Product_ObjectProductCondition> request);
    }
}