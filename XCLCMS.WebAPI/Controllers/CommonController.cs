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
        private XCLCMS.IService.WebAPI.ICommonService _iCommonService = null;

        private XCLCMS.IService.WebAPI.ICommonService iCommonService
        {
            get
            {
                if (null != this._iCommonService && null == this._iCommonService.ContextInfo)
                {
                    this._iCommonService.ContextInfo = base.ContextModel;
                }
                return this._iCommonService;
            }
            set
            {
                this._iCommonService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public CommonController(XCLCMS.IService.WebAPI.ICommonService commonService, XCLCMS.IService.Logger.ILogService logService) : base(logService)
        {
            this.iCommonService = commonService;
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
                return this.iCommonService.GenerateID(request);
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
                return this.iCommonService.ClearRubbishData(request);
            });
        }
    }
}