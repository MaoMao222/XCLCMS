using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLNetTools.Generic;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 商户管理
    /// </summary>
    public class MerchantController : BaseAPIController
    {
        private XCLCMS.Data.BLL.View.v_Merchant vMerchantBLL = new Data.BLL.View.v_Merchant();
        private XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();
        private XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new XCLCMS.Data.BLL.MerchantApp();
        private XCLCMS.Data.BLL.SysRole sysRoleBLL = new XCLCMS.Data.BLL.SysRole();
        private XCLCMS.Data.BLL.SysDic sysDicBLL = new XCLCMS.Data.BLL.SysDic();

        /// <summary>
        /// 查询商户信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantView)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.Merchant>> Detail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<XCLCMS.Data.Model.Merchant>();
                response.Body = merchantBLL.GetModel(request.Body);
                response.IsSuccess = true;

                //限制商户
                if (base.IsOnlyCurrentMerchant && null != response.Body && response.Body.MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.Body = null;
                    response.IsSuccess = false;
                }

                return response;
            });
        }

        /// <summary>
        /// 查询商户信息分页列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantView)]
        public async Task<APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Merchant>>> PageList([FromUri] APIRequestEntity<PageListConditionEntity> request)
        {
            return await Task.Run(() =>
            {
                var pager = request.Body.PagerInfoSimple.ToPagerInfo();
                var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Merchant>>();
                response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_Merchant>();

                //限制商户
                if (base.IsOnlyCurrentMerchant)
                {
                    request.Body.Where = XCLNetTools.DataBase.SQLLibrary.JoinWithAnd(new List<string>() {
                    request.Body.Where,
                    string.Format("MerchantID={0}",base.CurrentUserModel.FK_MerchantID)
                });
                }

                response.Body.ResultList = vMerchantBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
                {
                    OrderBy = "[MerchantID] desc",
                    Where = request.Body.Where
                });
                response.Body.PagerInfo = pager;
                response.IsSuccess = true;
                return response;
            });
        }

        /// <summary>
        /// 获取商户类型
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<Dictionary<string, long>>> GetMerchantTypeDic([FromUri] APIRequestEntity<object> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<Dictionary<string, long>>();
                response.Body = this.merchantBLL.GetMerchantTypeDic();
                response.IsSuccess = true;
                return response;
            });
        }

        /// <summary>
        /// 判断商户名是否存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistMerchantName([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Merchant.IsExistMerchantNameEntity> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();
                response.IsSuccess = true;
                response.Message = "该商户名可以使用！";

                request.Body.MerchantName = (request.Body.MerchantName ?? "").Trim();

                if (request.Body.MerchantID > 0)
                {
                    var model = merchantBLL.GetModel(request.Body.MerchantID);
                    if (null != model)
                    {
                        if (string.Equals(request.Body.MerchantName, model.MerchantName, StringComparison.OrdinalIgnoreCase))
                        {
                            return response;
                        }
                    }
                }

                if (!string.IsNullOrEmpty(request.Body.MerchantName))
                {
                    bool isExist = merchantBLL.IsExistMerchantName(request.Body.MerchantName);
                    if (isExist)
                    {
                        response.IsSuccess = false;
                        response.Message = "该商户名已被占用！";
                    }
                }

                return response;
            });
        }

        /// <summary>
        /// 新增商户信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantAdd)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.Model.Merchant> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 数据校验

                request.Body.MerchantName = (request.Body.MerchantName ?? "").Trim();

                if (string.IsNullOrWhiteSpace(request.Body.MerchantName))
                {
                    response.IsSuccess = false;
                    response.Message = "请提供商户名！";
                    return response;
                }

                if (this.merchantBLL.IsExistMerchantName(request.Body.MerchantName))
                {
                    response.IsSuccess = false;
                    response.Message = string.Format("商户名【{0}】已存在！", request.Body.MerchantName);
                    return response;
                }

                #endregion 数据校验

                var sysRoleId = XCLCMS.Data.BLL.Common.Common.GenerateID(Data.CommonHelper.EnumType.IDTypeEnum.RLE);
                var subSysRoleId = XCLCMS.Data.BLL.Common.Common.GenerateID(Data.CommonHelper.EnumType.IDTypeEnum.RLE);
                var sysDicID = XCLCMS.Data.BLL.Common.Common.GenerateID(Data.CommonHelper.EnumType.IDTypeEnum.DIC);

                using (var scope = new TransactionScope())
                {
                    bool flag = false;

                    //添加商户基础信息
                    flag = this.merchantBLL.Add(request.Body);

                    //初始化角色节点
                    if (flag)
                    {
                        //添加根角色节点
                        var rootRole = sysRoleBLL.GetRootModel();

                        flag = sysRoleBLL.Add(new Data.Model.SysRole()
                        {
                            CreaterID = base.CurrentUserModel.UserInfoID,
                            CreaterName = base.CurrentUserModel.UserName,
                            FK_MerchantID = request.Body.MerchantID,
                            ParentID = rootRole.SysRoleID,
                            RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString(),
                            CreateTime = DateTime.Now,
                            RoleName = request.Body.MerchantName,
                            UpdaterID = base.CurrentUserModel.UserInfoID,
                            UpdaterName = base.CurrentUserModel.UserName,
                            UpdateTime = DateTime.Now,
                            SysRoleID = sysRoleId
                        });
                    }

                    //初始化字典库节点
                    if (flag)
                    {
                        var rootDic = this.sysDicBLL.GetRootModel();
                        flag = this.sysDicBLL.Add(new Data.Model.SysDic()
                        {
                            CreaterID = base.CurrentUserModel.UserInfoID,
                            CreaterName = base.CurrentUserModel.UserName,
                            CreateTime = DateTime.Now,
                            DicName = request.Body.MerchantName,
                            FK_MerchantID = request.Body.MerchantID,
                            ParentID = rootDic.SysDicID,
                            RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString(),
                            SysDicID = sysDicID,
                            UpdaterID = base.CurrentUserModel.UserInfoID,
                            UpdaterName = base.CurrentUserModel.UserName,
                            UpdateTime = DateTime.Now
                        });
                    }

                    response.IsSuccess = flag;
                    if (response.IsSuccess)
                    {
                        scope.Complete();
                    }
                }

                //添加商户默认角色
                if (response.IsSuccess)
                {
                    XCLCMS.Lib.WebAPI.Library.SysRoleAPI_Add(request.UserToken, new Data.WebAPIEntity.RequestEntity.SysRole.AddOrUpdateEntity()
                    {
                        SysRole = new Data.Model.SysRole()
                        {
                            CreaterID = base.CurrentUserModel.UserInfoID,
                            CreaterName = base.CurrentUserModel.UserName,
                            FK_MerchantID = request.Body.MerchantID,
                            ParentID = sysRoleId,
                            RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString(),
                            CreateTime = DateTime.Now,
                            RoleName = XCLCMS.Data.CommonHelper.SysRoleConst.DefaultRoleName,
                            UpdaterID = base.CurrentUserModel.UserInfoID,
                            UpdaterName = base.CurrentUserModel.UserName,
                            UpdateTime = DateTime.Now,
                            SysRoleID = subSysRoleId
                        },
                        FunctionIdList = request.Body.MerchantSystemType == XCLCMS.Data.CommonHelper.EnumType.MerchantSystemTypeEnum.NOR.ToString() ? XCLCMS.Lib.Permission.PerHelper.GetNormalMerchantFunctionIDList() : null
                    });
                }

                if (response.Body)
                {
                    response.Message = "商户信息添加成功！";
                }
                else
                {
                    response.Message = "商户信息添加失败！";
                }

                return response;
            });
        }

        /// <summary>
        /// 修改商户信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantEdit)]
        public async Task<APIResponseEntity<bool>> Update([FromBody] APIRequestEntity<XCLCMS.Data.Model.Merchant> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                #region 数据校验

                var model = merchantBLL.GetModel(request.Body.MerchantID);
                if (null == model)
                {
                    response.IsSuccess = false;
                    response.Message = "请指定有效的商户信息！";
                    return response;
                }

                if (!string.Equals(model.MerchantName, request.Body.MerchantName))
                {
                    if (this.merchantBLL.IsExistMerchantName(request.Body.MerchantName))
                    {
                        response.IsSuccess = false;
                        response.Message = string.Format("商户名【{0}】已存在！", request.Body.MerchantName);
                        return response;
                    }
                }

                if (model.MerchantSystemType == XCLCMS.Data.CommonHelper.EnumType.MerchantSystemTypeEnum.SYS.ToString() && !string.Equals(request.Body.MerchantSystemType, model.MerchantSystemType, StringComparison.OrdinalIgnoreCase))
                {
                    response.IsSuccess = false;
                    response.Message = "不能修改系统内置商户的类型！";
                    return response;
                }

                //限制商户
                if (base.IsOnlyCurrentMerchant && request.Body.MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能修改自己的商户信息！";
                    return response;
                }

                #endregion 数据校验

                model.RecordState = request.Body.RecordState;
                model.MerchantSystemType = request.Body.MerchantSystemType;
                model.Address = request.Body.Address;
                model.ContactName = request.Body.ContactName;
                model.Domain = request.Body.Domain;
                model.Email = request.Body.Email;
                model.Landline = request.Body.Landline;
                model.LogoURL = request.Body.LogoURL;
                model.MerchantName = request.Body.MerchantName;
                model.MerchantRemark = request.Body.MerchantRemark;
                model.MerchantState = request.Body.MerchantState;
                model.FK_MerchantType = request.Body.FK_MerchantType;
                model.OtherContact = request.Body.OtherContact;
                model.PassNumber = request.Body.PassNumber;
                model.FK_PassType = request.Body.FK_PassType;
                model.QQ = request.Body.QQ;
                model.RegisterTime = request.Body.RegisterTime;
                model.Remark = request.Body.Remark;
                model.Tel = request.Body.Tel;
                model.UpdaterID = base.CurrentUserModel.UserInfoID;
                model.UpdaterName = base.CurrentUserModel.UserName;
                model.UpdateTime = DateTime.Now;

                response.IsSuccess = this.merchantBLL.Update(model);
                if (response.IsSuccess)
                {
                    response.Message = "商户信息修改成功！";
                }
                else
                {
                    response.Message = "商户信息修改失败！";
                }
                return response;
            });
        }

        /// <summary>
        /// 删除商户信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.SysFun_UserAdmin_MerchantDel)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<List<long>> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<bool>();

                if (request.Body.IsNotNullOrEmpty())
                {
                    request.Body = request.Body.Where(k => k > 0).Distinct().ToList();
                }

                if (request.Body.IsNullOrEmpty())
                {
                    response.IsSuccess = false;
                    response.Message = "请指定要删除的商户ID！";
                    return response;
                }

                foreach (var k in request.Body)
                {
                    var merchantModel = merchantBLL.GetModel(k);
                    if (null == merchantModel)
                    {
                        continue;
                    }
                    //限制商户
                    if (base.IsOnlyCurrentMerchant && merchantModel.MerchantID != base.CurrentUserModel.FK_MerchantID)
                    {
                        continue;
                    }
                    if (merchantModel.MerchantSystemType == XCLCMS.Data.CommonHelper.EnumType.MerchantSystemTypeEnum.SYS.ToString())
                    {
                        response.IsSuccess = false;
                        response.Message = string.Format("不可以删除系统内置商户【{0}】！", merchantModel.MerchantName);
                        return response;
                    }
                }

                if (!this.merchantBLL.Delete(request.Body, base.ContextModel))
                {
                    response.IsSuccess = false;
                    response.Message = "删除失败！";
                    return response;
                }

                response.IsSuccess = true;
                response.Message = "已成功删除商户信息！";
                response.IsRefresh = true;

                return response;
            });
        }
    }
}