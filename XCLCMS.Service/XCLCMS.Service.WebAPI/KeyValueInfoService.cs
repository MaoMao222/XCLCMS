using System;
using System.Collections.Generic;
using System.Linq;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.IService.WebAPI;
using XCLNetTools.Generic;

namespace XCLCMS.Service.WebAPI
{
    public class KeyValueInfoService : IKeyValueInfoService
    {
        private readonly XCLCMS.Data.BLL.KeyValueInfo KeyValueInfoBLL = new XCLCMS.Data.BLL.KeyValueInfo();
        private readonly XCLCMS.Data.BLL.View.v_KeyValueInfo vKeyValueInfoBLL = new Data.BLL.View.v_KeyValueInfo();
        private readonly XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();
        private readonly XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();
        private readonly XCLCMS.Data.BLL.SysDic sysDicBLL = new Data.BLL.SysDic();
        private readonly XCLCMS.Data.BLL.UserInfo userInfoBLL = new Data.BLL.UserInfo();
        private readonly XCLCMS.Data.BLL.Product productBLL = new Data.BLL.Product();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 查询信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.View.v_KeyValueInfo> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.View.v_KeyValueInfo>();
            response.Body = vKeyValueInfoBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 根据code来查询信息实体
        /// </summary>
        public APIResponseEntity<Data.Model.KeyValueInfo> DetailByCode(APIRequestEntity<string> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.KeyValueInfo>();
            response.Body = KeyValueInfoBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 查询信息分页列表
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_KeyValueInfo>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            var pager = request.Body.PagerInfoSimple.ToPagerInfo();
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_KeyValueInfo>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_KeyValueInfo>();
            response.Body.ResultList = vKeyValueInfoBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
            {
                OrderBy = "[KeyValueInfoID] desc",
                Where = request.Body.Where
            });
            response.Body.PagerInfo = pager;
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 检查code是否已存在
        /// </summary>
        public APIResponseEntity<bool> IsExistCode(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.IsExistCodeEntity> request)
        {
            #region 初始化

            var response = new APIResponseEntity<bool>()
            {
                IsSuccess = true,
                Message = "该唯一标识可以使用！"
            };
            request.Body.Code = (request.Body.Code ?? "").Trim();
            XCLCMS.Data.Model.KeyValueInfo model = null;

            #endregion 初始化

            #region 数据校验

            if (string.IsNullOrEmpty(request.Body.Code))
            {
                response.Message = "请指定Code参数！";
                response.IsSuccess = false;
                return response;
            }

            #endregion 数据校验

            #region 构建response

            if (request.Body.KeyValueInfoID > 0)
            {
                model = KeyValueInfoBLL.GetModel(request.Body.KeyValueInfoID);
                if (null != model && string.Equals(request.Body.Code, model.Code, StringComparison.OrdinalIgnoreCase))
                {
                    return response;
                }
            }

            if (KeyValueInfoBLL.IsExistCode(request.Body.Code))
            {
                response.IsSuccess = false;
                response.Message = "该唯一标识已被占用！";
                return response;
            }
            return response;

            #endregion 构建response
        }

        /// <summary>
        /// 新增信息
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.AddOrUpdateEntity> request)
        {
            List<long> tempIdList;
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            request.Body.KeyValueInfo.FK_ProductID = request.Body.KeyValueInfo.FK_ProductID > 0 ? request.Body.KeyValueInfo.FK_ProductID : 0;
            request.Body.KeyValueInfo.FK_UserID = request.Body.KeyValueInfo.FK_UserID > 0 ? request.Body.KeyValueInfo.FK_UserID : 0;
            request.Body.KeyValueInfo.Code = (request.Body.KeyValueInfo.Code ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(request.Body.KeyValueInfo.Code))
            {
                request.Body.KeyValueInfo.Code = request.Body.KeyValueInfo.KeyValueInfoID.ToString();
            }

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.KeyValueInfo.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            if (this.KeyValueInfoBLL.IsExistCode(request.Body.KeyValueInfo.Code))
            {
                response.IsSuccess = false;
                response.Message = string.Format("唯一标识【{0}】已存在！", request.Body.KeyValueInfo.Code);
                return response;
            }

            //应用号与商户一致
            if (!this.merchantAppBLL.IsTheSameMerchantInfoID(request.Body.KeyValueInfo.FK_MerchantID, request.Body.KeyValueInfo.FK_MerchantAppID))
            {
                response.IsSuccess = false;
                response.Message = "商户号与应用号不匹配，请核对后再试！";
                return response;
            }

            //产品检测
            if (request.Body.KeyValueInfo.FK_ProductID > 0)
            {
                var productModel = this.productBLL.GetModel(request.Body.KeyValueInfo.FK_ProductID);
                if (null == productModel)
                {
                    response.IsSuccess = false;
                    response.Message = "请指定有效的产品信息！";
                    return response;
                }

                //产品与商户一致
                if (productModel.FK_MerchantID != request.Body.KeyValueInfo.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "产品信息所属商户应与该数据所属商户一致！";
                    return response;
                }
            }

            //所属用户校验
            if (request.Body.KeyValueInfo.FK_UserID > 0)
            {
                var uInfo = userInfoBLL.GetModel(request.Body.KeyValueInfo.FK_UserID);
                if (null == uInfo)
                {
                    response.IsSuccess = false;
                    response.Message = "必须指定有效的所属用户信息！";
                    return response;
                }
                request.Body.KeyValueInfo.UserName = uInfo.UserName;
            }
            else
            {
                request.Body.KeyValueInfo.FK_UserID = 0;
                request.Body.KeyValueInfo.UserName = string.Empty;
            }

            //过滤非法分类
            if (request.Body.KeyValueInfoTypeIDList.IsNotNullOrEmpty())
            {
                tempIdList = request.Body.KeyValueInfoTypeIDList.Where(k =>
                  {
                      var typeModel = this.sysDicBLL.GetModel(k);
                      return null != typeModel && typeModel.FK_MerchantID == request.Body.KeyValueInfo.FK_MerchantID;
                  }).ToList();
                if (request.Body.KeyValueInfoTypeIDList.Count != tempIdList.Count)
                {
                    response.IsSuccess = false;
                    response.Message = "不能包含无效的数据分类信息！";
                    return response;
                }
                request.Body.KeyValueInfoTypeIDList = tempIdList;
            }

            #endregion 数据校验

            var context = new Data.BLL.Strategy.KeyValueInfo.KeyValueInfoContext();
            context.ContextInfo = this.ContextInfo;
            context.KeyValueInfo = request.Body.KeyValueInfo;
            context.HandleType = Data.BLL.Strategy.StrategyLib.HandleType.ADD;
            context.KeyValueInfoTypeIDList = request.Body.KeyValueInfoTypeIDList;

            var strategy = new Data.BLL.Strategy.ExecuteStrategy(new List<Data.BLL.Strategy.BaseStrategy>() {
                    new XCLCMS.Data.BLL.Strategy.KeyValueInfo.KeyValueInfo(),
                    new XCLCMS.Data.BLL.Strategy.KeyValueInfo.KeyValueInfoType()
                });
            strategy.Execute(context);

            if (strategy.Result != Data.BLL.Strategy.StrategyLib.ResultEnum.FAIL)
            {
                response.Message = "数据信息添加成功！";
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
        /// 修改信息
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.AddOrUpdateEntity> request)
        {
            List<long> tempIdList;
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            var model = KeyValueInfoBLL.GetModel(request.Body.KeyValueInfo.KeyValueInfoID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的数据信息！";
                return response;
            }

            request.Body.KeyValueInfo.FK_ProductID = request.Body.KeyValueInfo.FK_ProductID > 0 ? request.Body.KeyValueInfo.FK_ProductID : 0;
            request.Body.KeyValueInfo.FK_UserID = request.Body.KeyValueInfo.FK_UserID > 0 ? request.Body.KeyValueInfo.FK_UserID : 0;
            request.Body.KeyValueInfo.Code = (request.Body.KeyValueInfo.Code ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(request.Body.KeyValueInfo.Code))
            {
                request.Body.KeyValueInfo.Code = request.Body.KeyValueInfo.KeyValueInfoID.ToString();
            }

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.KeyValueInfo.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            //code是否被占用
            if (!string.IsNullOrEmpty(request.Body.KeyValueInfo.Code) && !string.Equals(model.Code, request.Body.KeyValueInfo.Code, StringComparison.OrdinalIgnoreCase) && this.KeyValueInfoBLL.IsExistCode(request.Body.KeyValueInfo.Code))
            {
                response.IsSuccess = false;
                response.Message = "标识Code被占用，请重新指定！";
                return response;
            }

            //应用号与商户一致
            if (!this.merchantAppBLL.IsTheSameMerchantInfoID(request.Body.KeyValueInfo.FK_MerchantID, request.Body.KeyValueInfo.FK_MerchantAppID))
            {
                response.IsSuccess = false;
                response.Message = "商户号与应用号不匹配，请核对后再试！";
                return response;
            }

            //产品检测
            if (request.Body.KeyValueInfo.FK_ProductID > 0)
            {
                var productModel = this.productBLL.GetModel(request.Body.KeyValueInfo.FK_ProductID);
                if (null == productModel)
                {
                    response.IsSuccess = false;
                    response.Message = "请指定有效的产品信息！";
                    return response;
                }

                //产品与商户一致
                if (productModel.FK_MerchantID != request.Body.KeyValueInfo.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "产品信息所属商户应与该数据所属商户一致！";
                    return response;
                }
            }

            //所属用户校验
            if (request.Body.KeyValueInfo.FK_UserID > 0)
            {
                var uInfo = userInfoBLL.GetModel(request.Body.KeyValueInfo.FK_UserID);
                if (null == uInfo)
                {
                    response.IsSuccess = false;
                    response.Message = "必须指定有效的所属用户信息！";
                    return response;
                }
                request.Body.KeyValueInfo.UserName = uInfo.UserName;
            }
            else
            {
                request.Body.KeyValueInfo.FK_UserID = 0;
                request.Body.KeyValueInfo.UserName = string.Empty;
            }

            //过滤非法分类
            if (request.Body.KeyValueInfoTypeIDList.IsNotNullOrEmpty())
            {
                tempIdList = request.Body.KeyValueInfoTypeIDList.Where(k =>
                  {
                      var typeModel = this.sysDicBLL.GetModel(k);
                      return null != typeModel && typeModel.FK_MerchantID == request.Body.KeyValueInfo.FK_MerchantID;
                  }).ToList();
                if (request.Body.KeyValueInfoTypeIDList.Count != tempIdList.Count)
                {
                    response.IsSuccess = false;
                    response.Message = "不能包含无效的数据分类信息！";
                    return response;
                }
                request.Body.KeyValueInfoTypeIDList = tempIdList;
            }

            #endregion 数据校验

            model.Code = request.Body.KeyValueInfo.Code;
            model.Remark = request.Body.KeyValueInfo.Remark;
            model.FK_MerchantID = request.Body.KeyValueInfo.FK_MerchantID;
            model.FK_MerchantAppID = request.Body.KeyValueInfo.FK_MerchantAppID;
            model.RecordState = request.Body.KeyValueInfo.RecordState;
            model.Contents = request.Body.KeyValueInfo.Contents;

            var context = new Data.BLL.Strategy.KeyValueInfo.KeyValueInfoContext();
            context.ContextInfo = this.ContextInfo;
            context.KeyValueInfo = model;
            context.HandleType = Data.BLL.Strategy.StrategyLib.HandleType.UPDATE;
            context.KeyValueInfoTypeIDList = request.Body.KeyValueInfoTypeIDList;

            var strategy = new Data.BLL.Strategy.ExecuteStrategy(new List<Data.BLL.Strategy.BaseStrategy>() {
                    new XCLCMS.Data.BLL.Strategy.KeyValueInfo.KeyValueInfo(),
                    new XCLCMS.Data.BLL.Strategy.KeyValueInfo.KeyValueInfoType()
                });
            strategy.Execute(context);

            if (strategy.Result != Data.BLL.Strategy.StrategyLib.ResultEnum.FAIL)
            {
                response.Message = "数据信息修改成功！";
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
        /// 删除信息
        /// </summary>
        public APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            var response = new APIResponseEntity<bool>();

            if (request.Body.IsNotNullOrEmpty())
            {
                request.Body = request.Body.Where(k => k > 0).Distinct().ToList();
            }

            if (request.Body.IsNullOrEmpty())
            {
                response.IsSuccess = false;
                response.Message = "请指定要删除的ID！";
                return response;
            }

            foreach (var k in request.Body)
            {
                var model = this.KeyValueInfoBLL.GetModel(k);
                if (null == model)
                {
                    continue;
                }

                model.UpdaterID = this.ContextInfo.UserInfoID;
                model.UpdaterName = this.ContextInfo.UserName;
                model.UpdateTime = DateTime.Now;
                model.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.R.ToString();
                if (!this.KeyValueInfoBLL.Update(model))
                {
                    response.IsSuccess = false;
                    response.Message = "数据信息删除失败！";
                    return response;
                }
            }

            response.IsSuccess = true;
            response.Message = "已成功删除数据信息！";
            response.IsRefresh = true;

            return response;
        }
    }
}