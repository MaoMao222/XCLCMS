using System;
using System.Collections.Generic;
using System.Linq;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.IService.WebAPI;
using XCLNetTools.Generic;

namespace XCLCMS.Service.WebAPI
{
    /// <summary>
    /// 角色
    /// </summary>
    public class SysRoleService : ISysRoleService
    {
        private XCLCMS.Service.WebAPI.SysFunctionService sysFunctionWebAPIBLL = new XCLCMS.Service.WebAPI.SysFunctionService();
        private XCLCMS.Data.BLL.SysRole sysRoleBLL = new Data.BLL.SysRole();
        private XCLCMS.Data.BLL.View.v_SysRole vSysRoleBLL = new Data.BLL.View.v_SysRole();
        private XCLCMS.Data.BLL.Merchant merchantBLL = new XCLCMS.Data.BLL.Merchant();
        private XCLCMS.Data.BLL.View.v_SysFunction vSysFunctionBLL = new XCLCMS.Data.BLL.View.v_SysFunction();

        public ContextModel ContextInfo { get; set; }

        public SysRoleService()
        {
            this.sysFunctionWebAPIBLL.ContextInfo = this.ContextInfo;
        }

        /// <summary>
        /// 查询角色信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.SysRole> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.SysRole>();
            response.Body = this.sysRoleBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 判断角色标识是否已经存在
        /// </summary>
        public APIResponseEntity<bool> IsExistCode(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.IsExistCodeEntity> request)
        {
            var response = new APIResponseEntity<bool>();
            response.IsSuccess = true;
            response.Message = "该标识可以使用！";

            XCLCMS.Data.Model.SysRole model = null;
            if (request.Body.SysRoleID > 0)
            {
                model = this.sysRoleBLL.GetModel(request.Body.SysRoleID);
                if (null != model)
                {
                    if (string.Equals(request.Body.Code, model.Code, StringComparison.OrdinalIgnoreCase))
                    {
                        return response;
                    }
                }
            }
            if (!string.IsNullOrEmpty(request.Body.Code))
            {
                bool isExist = this.sysRoleBLL.IsExistCode(request.Body.Code);
                if (isExist)
                {
                    response.IsSuccess = false;
                    response.Message = "该标识名已存在！";
                }
            }
            return response;
        }

        /// <summary>
        /// 判断角色名，在同一级别中是否存在
        /// </summary>
        public APIResponseEntity<bool> IsExistRoleNameInSameLevel(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.IsExistRoleNameInSameLevelEntity> request)
        {
            var response = new APIResponseEntity<bool>();
            response.IsSuccess = true;
            response.Message = "该角色名可以使用！";

            if (request.Body.SysRoleID > 0)
            {
                var model = this.sysRoleBLL.GetModel(request.Body.SysRoleID);
                if (null != model)
                {
                    if (string.Equals(request.Body.RoleName, model.RoleName, StringComparison.OrdinalIgnoreCase))
                    {
                        return response;
                    }
                }
            }

            List<XCLCMS.Data.Model.SysRole> lst = this.sysRoleBLL.GetChildListByID(request.Body.ParentID);
            if (lst.IsNotNullOrEmpty())
            {
                if (lst.Exists(k => string.Equals(k.RoleName, request.Body.RoleName, StringComparison.OrdinalIgnoreCase)))
                {
                    response.IsSuccess = false;
                    response.Message = "该角色名在当前层级中已存在！";
                }
            }
            return response;
        }

        /// <summary>
        /// 查询所有角色列表
        /// </summary>
        public APIResponseEntity<List<XCLCMS.Data.Model.View.v_SysRole>> GetList(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<List<XCLCMS.Data.Model.View.v_SysRole>>();
            response.Body = this.vSysRoleBLL.GetList(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 获取easyui tree格式的所有角色json
        /// </summary>
        public APIResponseEntity<List<XCLNetTools.Entity.EasyUI.TreeItem>> GetAllJsonForEasyUITree(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.GetAllJsonForEasyUITreeEntity> request)
        {
            var response = new APIResponseEntity<List<XCLNetTools.Entity.EasyUI.TreeItem>>();
            response.IsSuccess = true;

            List<XCLCMS.Data.Model.View.v_SysRole> allData = null;
            List<XCLNetTools.Entity.EasyUI.TreeItem> tree = new List<XCLNetTools.Entity.EasyUI.TreeItem>();

            var merchantModel = this.merchantBLL.GetModel(request.Body.MerchantID);
            if (null == merchantModel)
            {
                response.IsSuccess = false;
                response.Message = "您指定的商户号无效！";
                return response;
            }

            allData = this.vSysRoleBLL.GetModelList("");

            if (request.Body.MerchantID > 0)
            {
                allData = allData.Where(k => k.FK_MerchantID <= 0 || k.FK_MerchantID == request.Body.MerchantID).ToList();
            }

            if (allData.IsNotNullOrEmpty())
            {
                var root = allData.Where(k => k.ParentID == 0).FirstOrDefault();//根节点
                if (null != root)
                {
                    tree.Add(new XCLNetTools.Entity.EasyUI.TreeItem()
                    {
                        ID = root.SysRoleID.ToString(),
                        State = root.IsLeaf == 1 ? "open" : "closed",
                        Text = root.RoleName
                    });

                    Action<XCLNetTools.Entity.EasyUI.TreeItem> getChildAction = null;
                    getChildAction = new Action<XCLNetTools.Entity.EasyUI.TreeItem>((parentModel) =>
                    {
                        var childs = allData.Where(k => k.ParentID == Convert.ToInt64(parentModel.ID)).ToList();
                        if (childs.IsNotNullOrEmpty())
                        {
                            childs = childs.OrderBy(k => k.Weight).ToList();
                            parentModel.Children = new List<XCLNetTools.Entity.EasyUI.TreeItem>();
                            childs.ForEach(m =>
                            {
                                var treeItem = new XCLNetTools.Entity.EasyUI.TreeItem()
                                {
                                    ID = m.SysRoleID.ToString(),
                                    State = m.IsLeaf == 1 ? "open" : "closed",
                                    Text = m.RoleName
                                };
                                getChildAction(treeItem);
                                parentModel.Children.Add(treeItem);
                            });
                        }
                    });

                    //从根节点开始
                    getChildAction(tree[0]);
                }
            }
            response.Body = tree;
            return response;
        }

        /// <summary>
        /// 获取当前SysRoleID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        public APIResponseEntity<List<XCLCMS.Data.Model.Custom.SysRoleSimple>> GetLayerListBySysRoleID(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.GetLayerListBySysRoleIDEntity> request)
        {
            var response = new APIResponseEntity<List<XCLCMS.Data.Model.Custom.SysRoleSimple>>();
            response.Body = this.sysRoleBLL.GetLayerListBySysRoleID(request.Body.SysRoleID);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 获取指定用户的角色
        /// </summary>
        public APIResponseEntity<List<XCLCMS.Data.Model.SysRole>> GetRoleByUserID(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<List<XCLCMS.Data.Model.SysRole>>();
            response.Body = this.sysRoleBLL.GetListByUserID(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 添加角色
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.AddOrUpdateEntity> request)
        {
            var response = new APIResponseEntity<bool>();
            var allLeafFunctionIds = this.vSysFunctionBLL.GetModelList("").Where(k => k.IsLeaf == 1).Select(k => (long)k.SysFunctionID).ToList();

            #region 数据校验

            if (null == request.Body.SysRole)
            {
                response.IsSuccess = false;
                response.Message = "请指定角色信息！";
                return response;
            }
            request.Body.SysRole.RoleName = (request.Body.SysRole.RoleName ?? "").Trim();
            request.Body.SysRole.Code = (request.Body.SysRole.Code ?? "").Trim();
            if (null == request.Body.FunctionIdList)
            {
                request.Body.FunctionIdList = new List<long>();
            }

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.SysRole.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            //追加默认的功能权限
            if (string.Equals(request.Body.SysRole.Code, XCLCMS.Data.CommonHelper.SysRoleConst.SysRoleCodeEnum.MerchantMainRole.ToString(), StringComparison.OrdinalIgnoreCase) || merchant.MerchantSystemType == XCLCMS.Data.CommonHelper.EnumType.MerchantSystemTypeEnum.NOR.ToString())
            {
                request.Body.FunctionIdList.AddRange(XCLCMS.Data.CommonHelper.Function.NormalMerchantFixedFunctionIDList);
            }
            request.Body.FunctionIdList = request.Body.FunctionIdList.Intersect(allLeafFunctionIds).Distinct().ToList();

            //必须指定角色信息
            if (string.IsNullOrEmpty(request.Body.SysRole.RoleName))
            {
                response.IsSuccess = false;
                response.Message = "请指定角色名！";
                return response;
            }

            //角色code是否存在
            if (!string.IsNullOrEmpty(request.Body.SysRole.Code))
            {
                if (this.sysRoleBLL.IsExistCode(request.Body.SysRole.Code))
                {
                    response.IsSuccess = false;
                    response.Message = string.Format("角色标识【{0}】已存在！", request.Body.SysRole.Code);
                    return response;
                }
            }

            //父角色是否存在
            var parentNodeModel = this.vSysRoleBLL.GetModel(request.Body.SysRole.ParentID);
            if (null == parentNodeModel)
            {
                response.IsSuccess = false;
                response.Message = "父角色不存在！";
                return response;
            }

            //父节点必须为第2层级
            if (parentNodeModel.NodeLevel != 2)
            {
                response.IsSuccess = false;
                response.Message = "父节点必须为第2层级节点！";
                return response;
            }
            //子角色与父角色必须在同一商户中
            if (!this.vSysRoleBLL.IsRoot(parentNodeModel.SysRoleID.Value))
            {
                if (parentNodeModel.FK_MerchantID != request.Body.SysRole.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "您添加的角色必须与父角色在同一个商户中！";
                    return response;
                }
            }

            //普通商户的权限是否已越界
            if (merchant.MerchantSystemType == XCLCMS.Data.CommonHelper.EnumType.MerchantSystemTypeEnum.NOR.ToString())
            {
                var normalFunIds = this.sysFunctionWebAPIBLL.GetNormalMerchantFunctionIDList(new APIRequestEntity<object>()).Body;
                if (request.Body.FunctionIdList.IsNotNullOrEmpty())
                {
                    if (request.Body.FunctionIdList.Exists(k => !normalFunIds.Contains(k)))
                    {
                        response.IsSuccess = false;
                        response.Message = "该角色的权限已越界！";
                        return response;
                    }
                }
            }

            #endregion 数据校验

            XCLCMS.Data.BLL.Strategy.SysRole.SysRoleContext sysRoleContext = new Data.BLL.Strategy.SysRole.SysRoleContext();
            sysRoleContext.ContextInfo = this.ContextInfo;
            sysRoleContext.SysRole = request.Body.SysRole;
            sysRoleContext.FunctionIdList = request.Body.FunctionIdList;
            sysRoleContext.HandleType = Data.BLL.Strategy.StrategyLib.HandleType.ADD;

            XCLCMS.Data.BLL.Strategy.ExecuteStrategy strategy = new Data.BLL.Strategy.ExecuteStrategy(new List<Data.BLL.Strategy.BaseStrategy>() {
                new XCLCMS.Data.BLL.Strategy.SysRole.SysRole(),
                new XCLCMS.Data.BLL.Strategy.SysRole.SysRoleFunction()
            });
            strategy.Execute<XCLCMS.Data.BLL.Strategy.SysRole.SysRoleContext>(sysRoleContext);

            if (strategy.Result != Data.BLL.Strategy.StrategyLib.ResultEnum.FAIL)
            {
                response.Message = "添加成功！";
                response.IsSuccess = true;
            }
            else
            {
                response.Message = strategy.ResultMessage;
                response.IsSuccess = false;
            }

            return response;
        }

        /// <summary>
        /// 修改角色
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.AddOrUpdateEntity> request)
        {
            var response = new APIResponseEntity<bool>();
            var allLeafFunctionIds = this.vSysFunctionBLL.GetModelList("").Where(k => k.IsLeaf == 1).Select(k => (long)k.SysFunctionID).ToList();

            #region 数据校验

            if (null == request.Body.SysRole)
            {
                response.IsSuccess = false;
                response.Message = "请指定角色信息！";
                return response;
            }

            var model = this.sysRoleBLL.GetModel(request.Body.SysRole.SysRoleID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的角色信息！";
                return response;
            }

            request.Body.SysRole.RoleName = (request.Body.SysRole.RoleName ?? "").Trim();
            request.Body.SysRole.Code = (request.Body.SysRole.Code ?? "").Trim();
            if (null == request.Body.FunctionIdList)
            {
                request.Body.FunctionIdList = new List<long>();
            }

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.SysRole.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            //只能修改商户主角色节点下面的角色信息（层级为3的节点）
            var vSysRoleModel = this.vSysRoleBLL.GetModel(request.Body.SysRole.SysRoleID);
            if (vSysRoleModel.NodeLevel != 3)
            {
                response.IsSuccess = false;
                response.Message = "只能修改商户主角色节点下面的角色信息（层级为3的节点）！";
                return response;
            }

            //追加默认的功能权限
            if (string.Equals(request.Body.SysRole.Code, XCLCMS.Data.CommonHelper.SysRoleConst.SysRoleCodeEnum.MerchantMainRole.ToString(), StringComparison.OrdinalIgnoreCase) || merchant.MerchantSystemType == XCLCMS.Data.CommonHelper.EnumType.MerchantSystemTypeEnum.NOR.ToString())
            {
                request.Body.FunctionIdList.AddRange(XCLCMS.Data.CommonHelper.Function.NormalMerchantFixedFunctionIDList);
            }
            request.Body.FunctionIdList = request.Body.FunctionIdList.Intersect(allLeafFunctionIds).ToList();

            //必须指定角色信息
            if (string.IsNullOrEmpty(request.Body.SysRole.RoleName))
            {
                response.IsSuccess = false;
                response.Message = "请指定角色名！";
                return response;
            }

            //角色code是否存在
            if (!string.IsNullOrEmpty(request.Body.SysRole.Code))
            {
                if (!string.Equals(model.Code, request.Body.SysRole.Code, StringComparison.OrdinalIgnoreCase) && this.sysRoleBLL.IsExistCode(request.Body.SysRole.Code))
                {
                    response.IsSuccess = false;
                    response.Message = string.Format("角色标识【{0}】已存在！", request.Body.SysRole.Code);
                    return response;
                }
            }

            //普通商户的权限是否已越界
            if (merchant.MerchantSystemType == XCLCMS.Data.CommonHelper.EnumType.MerchantSystemTypeEnum.NOR.ToString())
            {
                var normalFunIds = this.sysFunctionWebAPIBLL.GetNormalMerchantFunctionIDList(new APIRequestEntity<object>()).Body;
                if (request.Body.FunctionIdList.IsNotNullOrEmpty())
                {
                    if (request.Body.FunctionIdList.Exists(k => !normalFunIds.Contains(k)))
                    {
                        response.IsSuccess = false;
                        response.Message = "该角色的权限已越界！";
                        return response;
                    }
                }
            }

            #endregion 数据校验

            model.Code = request.Body.SysRole.Code;
            model.Remark = request.Body.SysRole.Remark;
            model.RoleName = request.Body.SysRole.RoleName;
            model.Sort = request.Body.SysRole.Sort;
            model.Weight = request.Body.SysRole.Weight;

            XCLCMS.Data.BLL.Strategy.SysRole.SysRoleContext sysRoleContext = new Data.BLL.Strategy.SysRole.SysRoleContext();
            sysRoleContext.ContextInfo = this.ContextInfo;
            sysRoleContext.SysRole = model;
            sysRoleContext.FunctionIdList = request.Body.FunctionIdList;
            sysRoleContext.HandleType = Data.BLL.Strategy.StrategyLib.HandleType.UPDATE;

            XCLCMS.Data.BLL.Strategy.ExecuteStrategy strategy = new Data.BLL.Strategy.ExecuteStrategy(new List<Data.BLL.Strategy.BaseStrategy>() {
                new XCLCMS.Data.BLL.Strategy.SysRole.SysRole(),
                new XCLCMS.Data.BLL.Strategy.SysRole.SysRoleFunction()
            });
            strategy.Execute<XCLCMS.Data.BLL.Strategy.SysRole.SysRoleContext>(sysRoleContext);

            if (strategy.Result != Data.BLL.Strategy.StrategyLib.ResultEnum.FAIL)
            {
                response.Message = "修改成功！";
                response.IsSuccess = true;
            }
            else
            {
                response.Message = strategy.ResultMessage;
                response.IsSuccess = false;
            }

            return response;
        }

        /// <summary>
        /// 删除角色
        /// </summary>
        public APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            var response = new APIResponseEntity<bool>();

            if (null == request.Body || request.Body.Count == 0)
            {
                response.IsSuccess = false;
                response.Message = "请指定要删除的角色ID！";
                return response;
            }

            request.Body = request.Body.Distinct().ToList();

            foreach (var k in request.Body)
            {
                //只能删除商户主节点下面的角色（层级为3的节点）
                var sysRoleModel = this.vSysRoleBLL.GetModel(k);
                if (sysRoleModel.NodeLevel != 3)
                {
                    response.IsSuccess = false;
                    response.Message = "只能删除商户主节点下面的角色（层级为3的节点）！";
                    return response;
                }
            }

            int successCount = 0;

            foreach (var id in request.Body)
            {
                var sysRoleModel = this.sysRoleBLL.GetModel(id);
                if (null != sysRoleModel)
                {
                    //商户至少要保留一个角色
                    if (this.vSysRoleBLL.GetCountByMerchantID(sysRoleModel.FK_MerchantID) <= 1)
                    {
                        response.IsSuccess = false;
                        response.Message = "商户至少要保留一个角色！";
                        return response;
                    }

                    if (this.merchantBLL.GetModel(sysRoleModel.FK_MerchantID).MerchantSystemType == XCLCMS.Data.CommonHelper.EnumType.MerchantSystemTypeEnum.SYS.ToString())
                    {
                        response.IsSuccess = false;
                        response.Message = "不能删除系统内置商户的角色信息！";
                        return response;
                    }

                    //删除
                    sysRoleModel.UpdaterID = this.ContextInfo.UserInfoID;
                    sysRoleModel.UpdaterName = this.ContextInfo.UserName;
                    sysRoleModel.UpdateTime = DateTime.Now;
                    sysRoleModel.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.D.ToString();
                    if (this.sysRoleBLL.Update(sysRoleModel))
                    {
                        successCount++;
                    }
                }
            }

            response.IsSuccess = true;
            response.Message = string.Format("已成功删除【{0}】条记录！", successCount);

            return response;
        }
    }
}