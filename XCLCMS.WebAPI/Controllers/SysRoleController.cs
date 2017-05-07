using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 角色管理
    /// </summary>
    public class SysRoleController : BaseAPIController
    {
        private XCLCMS.IService.WebAPI.ISysRoleService _iSysRoleService = null;

        private XCLCMS.IService.WebAPI.ISysRoleService iSysRoleService
        {
            get
            {
                if (null != this._iSysRoleService && null == this._iSysRoleService.ContextInfo)
                {
                    this._iSysRoleService.ContextInfo = base.ContextModel;
                }
                return this._iSysRoleService;
            }
            set
            {
                this._iSysRoleService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public SysRoleController(XCLCMS.IService.WebAPI.ISysRoleService sysRoleService, XCLCMS.IService.Logger.ILogService logService) : base(logService)
        {
            this.iSysRoleService = sysRoleService;
        }

        /// <summary>
        /// 查询角色信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_SysRoleView)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.SysRole>> Detail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = this.iSysRoleService.Detail(request);

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && null != response.Body && response.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.Body = null;
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                }

                #endregion 限制商户

                return response;
            });
        }

        /// <summary>
        /// 判断角色标识是否已经存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistCode([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.IsExistCodeEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysRoleService.IsExistCode(request);
            });
        }

        /// <summary>
        /// 判断角色名，在同一级别中是否存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistRoleNameInSameLevel([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.IsExistRoleNameInSameLevelEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysRoleService.IsExistRoleNameInSameLevel(request);
            });
        }

        /// <summary>
        /// 查询所有角色列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_SysRoleView)]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.View.v_SysRole>>> GetList([FromUri]  APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = this.iSysRoleService.GetList(request);

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && null != response.Body && response.Body.Count > 0)
                {
                    response.Body = response.Body.Where(k => k.FK_MerchantID <= 0 || k.FK_MerchantID == base.CurrentUserModel.FK_MerchantID).ToList();
                }

                #endregion 限制商户

                return response;
            });
        }

        /// <summary>
        /// 获取easyui tree格式的所有角色json
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLNetTools.Entity.EasyUI.TreeItem>>> GetAllJsonForEasyUITree([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.GetAllJsonForEasyUITreeEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysRoleService.GetAllJsonForEasyUITree(request);
            });
        }

        /// <summary>
        /// 获取当前SysRoleID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.Custom.SysRoleSimple>>> GetLayerListBySysRoleID([FromUri]  APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.GetLayerListBySysRoleIDEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysRoleService.GetLayerListBySysRoleID(request);
            });
        }

        /// <summary>
        /// 获取指定用户的角色
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.SysRole>>> GetRoleByUserID([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysRoleService.GetRoleByUserID(request);
            });
        }

        /// <summary>
        /// 添加角色
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_SysRoleAdd)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.AddOrUpdateEntity> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.SysRole.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                response = this.iSysRoleService.Add(request);

                return response;
            });
        }

        /// <summary>
        /// 修改角色
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_SysRoleEdit)]
        public async Task<APIResponseEntity<bool>> Update([FromBody] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.AddOrUpdateEntity> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.SysRole.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                response = this.iSysRoleService.Update(request);

                return response;
            });
        }

        /// <summary>
        /// 删除角色
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_SysRoleDel)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<List<long>> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (null != request.Body && request.Body.Count > 0)
                {
                    request.Body = request.Body.Where(k =>
                    {
                        var model = this.iSysRoleService.Detail(new APIRequestEntity<long>() { Body = k }).Body;
                        if (null == model)
                        {
                            return false;
                        }
                        if (base.IsOnlyCurrentMerchant && model.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                        {
                            return false;
                        }
                        return true;
                    }).ToList();
                }

                #endregion 限制商户

                return this.iSysRoleService.Delete(request);
            });
        }
    }
}