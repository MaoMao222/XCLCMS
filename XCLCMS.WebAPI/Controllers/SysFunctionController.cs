using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 功能模块 管理
    /// </summary>
    public class SysFunctionController : BaseAPIController
    {
        private XCLCMS.IService.WebAPI.ISysFunctionService _iSysFunctionService = null;

        private XCLCMS.IService.WebAPI.ISysFunctionService iSysFunctionService
        {
            get
            {
                if (null != this._iSysFunctionService && null == this._iSysFunctionService.ContextInfo)
                {
                    this._iSysFunctionService.ContextInfo = base.ContextModel;
                }
                return this._iSysFunctionService;
            }
            set
            {
                this._iSysFunctionService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public SysFunctionController(XCLCMS.IService.WebAPI.ISysFunctionService sysFunctionService, XCLCMS.IService.Logger.ILogService logService) : base(logService)
        {
            this.iSysFunctionService = sysFunctionService;
        }

        /// <summary>
        /// 查询功能信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_SysRoleView)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.SysFunction>> Detail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysFunctionService.Detail(request);
            });
        }

        /// <summary>
        /// 判断功能标识是否已经存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistCode([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.IsExistCodeEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysFunctionService.IsExistCode(request);
            });
        }

        /// <summary>
        /// 判断功能名，在同一级别中是否存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistFunctionNameInSameLevel([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.IsExistFunctionNameInSameLevelEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysFunctionService.IsExistFunctionNameInSameLevel(request);
            });
        }

        /// <summary>
        /// 查询所有功能列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysFunctionView)]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.View.v_SysFunction>>> GetList([FromUri]  APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysFunctionService.GetList(request);
            });
        }

        /// <summary>
        /// 获取easyui tree格式的所有功能json
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLNetTools.Entity.EasyUI.TreeItem>>> GetAllJsonForEasyUITree([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.GetAllJsonForEasyUITreeEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysFunctionService.GetAllJsonForEasyUITree(request);
            });
        }

        /// <summary>
        /// 获取当前SysFunctionID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.Custom.SysFunctionSimple>>> GetLayerListBySysFunctionId([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.GetLayerListBySysFunctionIdEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysFunctionService.GetLayerListBySysFunctionId(request);
            });
        }

        /// <summary>
        /// 获取指定角色的所有功能
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.SysFunction>>> GetListByRoleID([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysFunctionService.GetListByRoleID(request);
            });
        }

        /// <summary>
        /// 获取普通商户的所有功能数据源列表
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.View.v_SysFunction>>> GetNormalMerchantFunctionTreeList([FromUri] APIRequestEntity<object> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysFunctionService.GetNormalMerchantFunctionTreeList(request);
            });
        }

        /// <summary>
        /// 判断指定用户是否至少拥有权限组中的某个权限
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> HasAnyPermission([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.HasAnyPermissionEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysFunctionService.HasAnyPermission(request);
            });
        }

        /// <summary>
        /// 添加功能
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysFunctionAdd)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.Model.SysFunction> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysFunctionService.Add(request);
            });
        }

        /// <summary>
        /// 修改功能
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysFunctionEdit)]
        public async Task<APIResponseEntity<bool>> Update([FromBody] APIRequestEntity<XCLCMS.Data.Model.SysFunction> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysFunctionService.Update(request);
            });
        }

        /// <summary>
        /// 删除功能
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysFunctionDel)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<List<long>> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysFunctionService.Delete(request);
            });
        }

        /// <summary>
        /// 删除指定功能的所有节点
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysFunctionDel)]
        public async Task<APIResponseEntity<bool>> DelChild([FromBody] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysFunctionService.DelChild(request);
            });
        }
    }
}