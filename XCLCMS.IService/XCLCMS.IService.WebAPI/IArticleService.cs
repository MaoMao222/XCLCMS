using System.Collections.Generic;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.Article;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;

namespace XCLCMS.IService.WebAPI
{
    public interface IArticleService : IBaseInfoService
    {
        APIResponseEntity<bool> Add(APIRequestEntity<AddOrUpdateEntity> request);

        APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request);

        APIResponseEntity<v_Article> Detail(APIRequestEntity<long> request);

        APIResponseEntity<bool> IsExistCode(APIRequestEntity<IsExistCodeEntity> request);

        APIResponseEntity<PageListResponseEntity<v_Article>> PageList(APIRequestEntity<PageListConditionEntity> request);

        APIResponseEntity<ArticleRelationDetailModel> RelationDetail(APIRequestEntity<long> request);

        APIResponseEntity<PageListResponseEntity<v_Article>> SimplePageList(APIRequestEntity<SimplePageListEntity> request);

        APIResponseEntity<bool> Update(APIRequestEntity<AddOrUpdateEntity> request);
    }
}