using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 字典库 管理
    /// </summary>
    public class SysDicController : BaseAPIController
    {
        private XCLCMS.IService.WebAPI.ISysDicService _iSysDicService = null;

        private XCLCMS.IService.WebAPI.ISysDicService iSysDicService
        {
            get
            {
                if (null != this._iSysDicService && null == this._iSysDicService.ContextInfo)
                {
                    this._iSysDicService.ContextInfo = base.ContextModel;
                }
                return this._iSysDicService;
            }
            set
            {
                this._iSysDicService = value;
            }
        }

        /// <summary>
        /// 构造
        /// </summary>
        public SysDicController(XCLCMS.IService.WebAPI.ISysDicService sysDicService, XCLCMS.IService.Logger.ILogService logService) : base(logService)
        {
            this.iSysDicService = sysDicService;
        }

        /// <summary>
        /// 查询字典信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysDicView)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.SysDic>> Detail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = this.iSysDicService.Detail(request);

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
        /// 根据code查询其子项
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.SysDic>>> GetChildListByCode([FromUri] APIRequestEntity<string> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysDicService.GetChildListByCode(request);
            });
        }

        /// <summary>
        /// 判断字典的唯一标识是否已经存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistSysDicCode([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysDic.IsExistSysDicCodeEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysDicService.IsExistSysDicCode(request);
            });
        }

        /// <summary>
        /// 判断字典名，在同一级别中是否存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistSysDicNameInSameLevel([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysDic.IsExistSysDicNameInSameLevelEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysDicService.IsExistSysDicNameInSameLevel(request);
            });
        }

        /// <summary>
        /// 根据code来获取字典的easyui tree格式
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLNetTools.Entity.EasyUI.TreeItem>>> GetEasyUITreeByCode([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysDic.GetEasyUITreeByCodeEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysDicService.GetEasyUITreeByCode(request);
            });
        }

        /// <summary>
        /// 查询所有字典列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysDicView)]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.View.v_SysDic>>> GetList([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = this.iSysDicService.GetList(request);

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
        /// 根据条件获取字典的easy tree 列表
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLNetTools.Entity.EasyUI.TreeItem>>> GetEasyUITreeByCondition([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysDic.GetEasyUITreeByConditionEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysDicService.GetEasyUITreeByCondition(request);
            });
        }

        /// <summary>
        /// 获取XCLCMS管理后台系统的菜单
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.View.v_SysDic>>> GetSystemMenuModelList([FromUri] APIRequestEntity<object> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysDicService.GetSystemMenuModelList(request);
            });
        }

        /// <summary>
        /// 根据SysDicID查询其子项
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.SysDic>>> GetChildListByID([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysDicService.GetChildListByID(request);
            });
        }

        /// <summary>
        /// 获取当前sysDicID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.Custom.SysDicSimple>>> GetLayerListBySysDicID([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysDic.GetLayerListBySysDicIDEntity> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysDicService.GetLayerListBySysDicID(request);
            });
        }

        /// <summary>
        /// 获取证件类型
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<Dictionary<string, long>>> GetPassTypeDic([FromUri] APIRequestEntity<object> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysDicService.GetPassTypeDic(request);
            });
        }

        /// <summary>
        /// 递归获取指定SysDicID下的所有列表（不包含该SysDicID的记录）
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<List<XCLCMS.Data.Model.View.v_SysDic>>> GetAllUnderListByID([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                return this.iSysDicService.GetAllUnderListByID(request);
            });
        }

        /// <summary>
        /// 添加字典
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysDicAdd)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.Model.SysDic> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                response = this.iSysDicService.Add(request);

                return response;
            });
        }

        /// <summary>
        /// 修改字典
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysDicEdit)]
        public async Task<APIResponseEntity<bool>> Update([FromBody] APIRequestEntity<XCLCMS.Data.Model.SysDic> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 限制商户

                if (base.IsOnlyCurrentMerchant && request.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能操作属于自己商户下的数据信息！";
                    return response;
                }

                #endregion 限制商户

                response = this.iSysDicService.Update(request);

                return response;
            });
        }

        /// <summary>
        /// 删除字典
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_Set_SysDicDel)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<List<long>> request)
        {
            return await Task.Run(() =>
            {
                #region 限制商户

                if (null != request.Body && request.Body.Count > 0)
                {
                    request.Body = request.Body.Where(k =>
                    {
                        var model = this.iSysDicService.Detail(new APIRequestEntity<long>() { Body = k }).Body;
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

                return this.iSysDicService.Delete(request);
            });
        }
    }
}