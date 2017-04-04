using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.IService.WebAPI
{
    /// <summary>
    /// 个人中心服务
    /// </summary>
    public interface IUserCenterService: IBaseInfoService
    {
        APIResponseEntity<bool> UpdateUserInfo(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.UserCenter.UserBaseInfoEntity> request);
    }
}
