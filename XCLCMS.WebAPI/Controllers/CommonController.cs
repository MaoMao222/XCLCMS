using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 公共
    /// </summary>
    public class CommonController : BaseAPIController
    {
        private XCLCMS.Service.WebAPI.Common bll = null;

        /// <summary>
        /// 构造
        /// </summary>
        public CommonController()
        {
            this.bll = new XCLCMS.Service.WebAPI.Common(base.ContextModel);
        }

        /// <summary>
        /// 生成ID号
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<long>> GenerateID([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.bll.GenerateID(request);
            });
        }

        /// <summary>
        /// 垃圾数据清理
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_ClearRubbishData)]
        public async Task<APIResponseEntity<bool>> ClearRubbishData([FromUri] APIRequestEntity<object> request)
        {
            return await Task.Run(() =>
            {
                return this.bll.ClearRubbishData(request);
            });
        }
    }
}