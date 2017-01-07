using System.Collections.Generic;
using XCLCMS.Data.Model;
using XCLCMS.Data.Model.View;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.FriendLinks;
using XCLCMS.Data.WebAPIEntity.ResponseEntity;

namespace XCLCMS.IService.WebAPI
{
    public interface IFriendLinksService : IBaseInfoService
    {
        APIResponseEntity<bool> Add(APIRequestEntity<Data.Model.FriendLinks> request);

        APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request);

        APIResponseEntity<Data.Model.FriendLinks> Detail(APIRequestEntity<long> request);

        APIResponseEntity<bool> IsExistTitle(APIRequestEntity<IsExistTitleEntity> request);

        APIResponseEntity<PageListResponseEntity<v_FriendLinks>> PageList(APIRequestEntity<PageListConditionEntity> request);

        APIResponseEntity<bool> Update(APIRequestEntity<Data.Model.FriendLinks> request);
    }
}