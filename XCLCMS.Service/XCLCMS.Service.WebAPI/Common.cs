using System;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.Service.WebAPI
{
    /// <summary>
    /// 公共
    /// </summary>
    public class Common : BaseInfo
    {
        public Common(XCLCMS.Data.Model.Custom.ContextModel contextModel) : base(contextModel)
        {
        }

        /// <summary>
        /// 生成ID号
        /// </summary>
        public APIResponseEntity<long> GenerateID(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity> request)
        {
            var response = new APIResponseEntity<long>();
            response.Body = XCLCMS.Data.BLL.Common.Common.GenerateID((Data.CommonHelper.EnumType.IDTypeEnum)Enum.Parse(typeof(Data.CommonHelper.EnumType.IDTypeEnum), request.Body.IDType), request.Body.Remark);
            if (response.Body > 0)
            {
                response.IsSuccess = true;
                response.Message = "生成ID成功！";
            }
            else
            {
                response.IsSuccess = false;
                response.Message = "生成ID失败！";
            }

            return response;
        }

        /// <summary>
        /// 垃圾数据清理
        /// </summary>
        public APIResponseEntity<bool> ClearRubbishData(APIRequestEntity<object> request)
        {
            var response = new APIResponseEntity<bool>();
            XCLCMS.Data.BLL.Common.Common.ClearRubbishData();
            response.IsSuccess = true;
            response.Message = "垃圾数据清理成功！";
            return response;
        }
    }
}