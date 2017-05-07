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
    /// 权限功能
    /// </summary>
    public class SysFunctionService : ISysFunctionService
    {
        private XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();
        private XCLCMS.Data.BLL.SysFunction sysFunctionBLL = new Data.BLL.SysFunction();
        private XCLCMS.Data.BLL.View.v_SysFunction vSysFunctionBLL = new Data.BLL.View.v_SysFunction();
        private XCLCMS.Data.BLL.View.v_SysRole vSysRoleBLL = new XCLCMS.Data.BLL.View.v_SysRole();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 查询功能信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.SysFunction> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.SysFunction>();
            response.Body = this.sysFunctionBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 判断功能标识是否已经存在
        /// </summary>
        public APIResponseEntity<bool> IsExistCode(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.IsExistCodeEntity> request)
        {
            var response = new APIResponseEntity<bool>();
            response.IsSuccess = true;
            response.Message = "该标识可以使用！";

            XCLCMS.Data.Model.SysFunction model = null;
            if (request.Body.SysFunctionID > 0)
            {
                model = sysFunctionBLL.GetModel(request.Body.SysFunctionID);
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
                bool isExist = sysFunctionBLL.IsExistCode(request.Body.Code);
                if (isExist)
                {
                    response.IsSuccess = false;
                    response.Message = "该标识名已存在！";
                }
            }
            return response;
        }

        /// <summary>
        /// 判断功能名，在同一级别中是否存在
        /// </summary>
        public APIResponseEntity<bool> IsExistFunctionNameInSameLevel(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.IsExistFunctionNameInSameLevelEntity> request)
        {
            var response = new APIResponseEntity<bool>();
            response.IsSuccess = true;
            response.Message = "该功能名可以使用！";

            XCLCMS.Data.Model.SysFunction model = null;

            if (request.Body.SysFunctionID > 0)
            {
                model = sysFunctionBLL.GetModel(request.Body.SysFunctionID);
                if (null != model)
                {
                    if (string.Equals(request.Body.FunctionName, model.FunctionName, StringComparison.OrdinalIgnoreCase))
                    {
                        return response;
                    }
                }
            }

            List<XCLCMS.Data.Model.SysFunction> lst = sysFunctionBLL.GetChildListByID(request.Body.ParentID);
            if (lst.IsNotNullOrEmpty())
            {
                if (lst.Exists(k => string.Equals(k.FunctionName, request.Body.FunctionName, StringComparison.OrdinalIgnoreCase)))
                {
                    response.IsSuccess = false;
                    response.Message = "该功能名在当前层级中已存在！";
                }
            }

            return response;
        }

        /// <summary>
        /// 查询所有功能列表
        /// </summary>
        public APIResponseEntity<List<XCLCMS.Data.Model.View.v_SysFunction>> GetList(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<List<XCLCMS.Data.Model.View.v_SysFunction>>();
            response.Body = this.vSysFunctionBLL.GetList(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 获取easyui tree格式的所有功能json
        /// </summary>
        public APIResponseEntity<List<XCLNetTools.Entity.EasyUI.TreeItem>> GetAllJsonForEasyUITree(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.GetAllJsonForEasyUITreeEntity> request)
        {
            var response = new APIResponseEntity<List<XCLNetTools.Entity.EasyUI.TreeItem>>();
            response.IsSuccess = true;

            List<XCLCMS.Data.Model.View.v_SysFunction> allData = null;
            List<XCLNetTools.Entity.EasyUI.TreeItem> tree = new List<XCLNetTools.Entity.EasyUI.TreeItem>();

            var merchantModel = this.merchantBLL.GetModel(request.Body.MerchantID);
            if (null == merchantModel)
            {
                response.IsSuccess = false;
                response.Message = "您指定的商户号无效！";
                return response;
            }

            //根据情况，是否只显示普通商户的功能权限以供选择
            if (merchantModel.MerchantSystemType == XCLCMS.Data.CommonHelper.EnumType.MerchantSystemTypeEnum.NOR.ToString())
            {
                allData = this.GetNormalMerchantFunctionTreeList(new APIRequestEntity<object>()).Body;
            }
            else
            {
                //所有权限功能
                allData = this.vSysFunctionBLL.GetModelList("");
            }

            if (allData.IsNotNullOrEmpty())
            {
                var root = allData.Where(k => k.ParentID == 0).FirstOrDefault();//根节点
                if (null != root)
                {
                    tree.Add(new XCLNetTools.Entity.EasyUI.TreeItem()
                    {
                        ID = root.SysFunctionID.ToString(),
                        State = root.IsLeaf == 1 ? "open" : "closed",
                        Text = root.FunctionName
                    });

                    Action<XCLNetTools.Entity.EasyUI.TreeItem> getChildAction = null;
                    getChildAction = new Action<XCLNetTools.Entity.EasyUI.TreeItem>((parentModel) =>
                    {
                        var childs = allData.Where(k => k.ParentID == Convert.ToInt64(parentModel.ID)).ToList();
                        if (childs.IsNotNullOrEmpty())
                        {
                            parentModel.Children = new List<XCLNetTools.Entity.EasyUI.TreeItem>();
                            childs.ForEach(m =>
                            {
                                var treeItem = new XCLNetTools.Entity.EasyUI.TreeItem()
                                {
                                    ID = m.SysFunctionID.ToString(),
                                    State = m.IsLeaf == 1 ? "open" : "closed",
                                    Text = m.FunctionName
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
        /// 获取当前SysFunctionID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        public APIResponseEntity<List<XCLCMS.Data.Model.Custom.SysFunctionSimple>> GetLayerListBySysFunctionId(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.GetLayerListBySysFunctionIdEntity> request)
        {
            var response = new APIResponseEntity<List<XCLCMS.Data.Model.Custom.SysFunctionSimple>>();
            response.Body = this.sysFunctionBLL.GetLayerListBySysFunctionId(request.Body.SysFunctionId);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 获取指定角色的所有功能
        /// </summary>
        public APIResponseEntity<List<XCLCMS.Data.Model.SysFunction>> GetListByRoleID(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<List<XCLCMS.Data.Model.SysFunction>>();
            response.Body = this.sysFunctionBLL.GetListByRoleID(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 获取普通商户的所有功能数据源列表
        /// </summary>
        public APIResponseEntity<List<XCLCMS.Data.Model.View.v_SysFunction>> GetNormalMerchantFunctionTreeList(APIRequestEntity<object> request)
        {
            var response = new APIResponseEntity<List<XCLCMS.Data.Model.View.v_SysFunction>>();
            var roleModel = this.vSysRoleBLL.GetModelByCode(XCLCMS.Data.CommonHelper.SysRoleConst.SysRoleCodeEnum.MerchantMainRole.ToString());
            if (null == roleModel)
            {
                throw new Exception("请指定普通商户所有功能主角色！");
            }
            var allFuns = this.vSysFunctionBLL.GetModelList("");
            var funLst = this.sysFunctionBLL.GetListByRoleID(roleModel.SysRoleID.Value);
            var resultId = new List<long>();
            if (null != funLst && funLst.Count > 0)
            {
                funLst.ForEach(k =>
                {
                    var lst = this.sysFunctionBLL.GetLayerListBySysFunctionId(k.SysFunctionID);
                    if (null != lst && lst.Count > 0)
                    {
                        resultId.AddRange(lst.Select(m => m.SysFunctionID));
                    }
                });
            }
            resultId = resultId.Distinct().ToList();
            response.Body = allFuns.Where(k => resultId.Contains(k.SysFunctionID.Value)).ToList() ?? new List<Data.Model.View.v_SysFunction>();
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 判断指定用户是否至少拥有权限组中的某个权限
        /// </summary>
        public APIResponseEntity<bool> HasAnyPermission(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.HasAnyPermissionEntity> request)
        {
            var response = new APIResponseEntity<bool>();
            response.Body = this.sysFunctionBLL.CheckUserHasAnyFunction(request.Body.UserId, request.Body.FunctionIDList);
            return response;
        }

        /// <summary>
        /// 添加功能
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.SysFunction> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            request.Body.FunctionName = (request.Body.FunctionName ?? "").Trim();
            request.Body.Code = (request.Body.Code ?? "").Trim();

            //字典名必填
            if (string.IsNullOrEmpty(request.Body.FunctionName))
            {
                response.IsSuccess = false;
                response.Message = "请提供功能名！";
                return response;
            }

            //若有code，则判断是否唯一
            if (!string.IsNullOrEmpty(request.Body.Code))
            {
                if (this.sysFunctionBLL.IsExistCode(request.Body.Code))
                {
                    response.IsSuccess = false;
                    response.Message = string.Format("功能唯一标识【{0}】已存在！", request.Body.Code);
                    return response;
                }
            }

            #endregion 数据校验

            request.Body.CreaterID = this.ContextInfo.UserInfoID;
            request.Body.CreaterName = this.ContextInfo.UserName;
            request.Body.CreateTime = DateTime.Now;
            request.Body.UpdaterID = request.Body.CreaterID;
            request.Body.UpdaterName = request.Body.CreaterName;
            request.Body.UpdateTime = request.Body.CreateTime;

            if (this.sysFunctionBLL.Add(request.Body))
            {
                response.IsSuccess = true;
                response.Message = "添加成功！";
            }
            else
            {
                response.IsSuccess = false;
                response.Message = "添加失败！";
            }

            return response;
        }

        /// <summary>
        /// 修改功能
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.SysFunction> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            var model = this.sysFunctionBLL.GetModel(request.Body.SysFunctionID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的功能信息！";
                return response;
            }

            request.Body.FunctionName = (request.Body.FunctionName ?? "").Trim();
            request.Body.Code = (request.Body.Code ?? "").Trim();

            //功能名必填
            if (string.IsNullOrEmpty(request.Body.FunctionName))
            {
                response.IsSuccess = false;
                response.Message = "请提供功能名！";
                return response;
            }

            //若有code，则判断是否唯一
            if (!string.IsNullOrEmpty(request.Body.Code))
            {
                if (!string.Equals(model.Code, request.Body.Code) && this.sysFunctionBLL.IsExistCode(request.Body.Code))
                {
                    response.IsSuccess = false;
                    response.Message = string.Format("功能唯一标识【{0}】已存在！", request.Body.Code);
                    return response;
                }
            }

            #endregion 数据校验

            model.Code = request.Body.Code;
            model.Remark = request.Body.Remark;
            model.UpdaterID = this.ContextInfo.UserInfoID;
            model.UpdaterName = this.ContextInfo.UserName;
            model.UpdateTime = DateTime.Now;
            model.FunctionName = request.Body.FunctionName;

            if (this.sysFunctionBLL.Update(model))
            {
                response.IsSuccess = true;
                response.Message = "修改成功！";
            }
            else
            {
                response.IsSuccess = false;
                response.Message = "修改失败！";
            }

            return response;
        }

        /// <summary>
        /// 删除功能
        /// </summary>
        public APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            var response = new APIResponseEntity<bool>();

            if (null == request.Body || request.Body.Count == 0)
            {
                response.IsSuccess = false;
                response.Message = "请指定要删除的功能ID！";
                return response;
            }

            request.Body = request.Body.Distinct().ToList();

            int successCount = 0;

            request.Body.ForEach(id =>
            {
                var sysDicModel = this.sysFunctionBLL.GetModel(id);
                if (null != sysDicModel)
                {
                    sysDicModel.UpdaterID = this.ContextInfo.UserInfoID;
                    sysDicModel.UpdaterName = this.ContextInfo.UserName;
                    sysDicModel.UpdateTime = DateTime.Now;
                    sysDicModel.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.D.ToString();
                    if (this.sysFunctionBLL.Update(sysDicModel))
                    {
                        successCount++;
                    }
                }
            });

            response.IsSuccess = true;
            response.Message = string.Format("已成功删除【{0}】条记录！", successCount);

            return response;
        }

        /// <summary>
        /// 删除指定功能的所有节点
        /// </summary>
        public APIResponseEntity<bool> DelChild(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<bool>();

            if (request.Body <= 0)
            {
                response.IsSuccess = false;
                response.Message = "请指定要删除所有子节点的功能ID！";
                return response;
            }

            response.IsSuccess = this.sysFunctionBLL.DelChild(new Data.Model.SysFunction()
            {
                SysFunctionID = request.Body,
                UpdaterID = this.ContextInfo.UserInfoID,
                UpdaterName = this.ContextInfo.UserName,
                UpdateTime = DateTime.Now
            });

            if (response.IsSuccess)
            {
                response.Message = "成功删除所有子节点！";
            }
            else
            {
                response.Message = "删除所有子节点失败！";
            }

            return response;
        }

        /// <summary>
        /// 获取普通商户的所有功能id List
        /// </summary>
        public APIResponseEntity<List<long>> GetNormalMerchantFunctionIDList(APIRequestEntity<object> request)
        {
            var response = new APIResponseEntity<List<long>>();
            response.IsSuccess = true;
            var lst = this.GetNormalMerchantFunctionTreeList(new APIRequestEntity<object>()).Body;
            if (null != lst && lst.Count > 0)
            {
                response.Body = lst.Where(k => k.IsLeaf == 1).Select(k => (long)k.SysFunctionID).ToList();
            }
            if (null == response.Body)
            {
                response.Body = new List<long>();
            }
            return response;
        }
    }
}