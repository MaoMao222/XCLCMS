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
    public class ProductService : IProductService
    {
        private readonly XCLCMS.Data.BLL.Product bll = new XCLCMS.Data.BLL.Product();
        private readonly XCLCMS.Data.BLL.View.v_Product vBLL = new Data.BLL.View.v_Product();
        private readonly XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();
        private readonly XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();
        private readonly XCLCMS.Data.BLL.ObjectProduct objectProductBLL = new Data.BLL.ObjectProduct();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 查询产品信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.View.v_Product> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.View.v_Product>();
            response.Body = vBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 根据产品关系信息查询产品列表
        /// </summary>
        public APIResponseEntity<List<Data.Model.Product>> GetObjectProductList(APIRequestEntity<Product_ObjectProductCondition> request)
        {
            var response = new APIResponseEntity<List<XCLCMS.Data.Model.Product>>();
            response.Body = this.bll.GetModelListByObject(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 查询产品信息分页列表
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Product>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            var pager = request.Body.PagerInfoSimple.ToPagerInfo();
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Product>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_Product>();
            response.Body.ResultList = vBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
            {
                OrderBy = "[ProductID] desc",
                Where = request.Body.Where
            });
            response.Body.PagerInfo = pager;
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 新增产品信息
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.Product> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            request.Body.ProductName = (request.Body.ProductName ?? "").Trim();
            request.Body.Description = (request.Body.Description ?? string.Empty).Trim();

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            if (string.IsNullOrWhiteSpace(request.Body.ProductName))
            {
                response.IsSuccess = false;
                response.Message = "请提供产品名称！";
                return response;
            }

            //应用号与商户一致
            if (!this.merchantAppBLL.IsTheSameMerchantInfoID(request.Body.FK_MerchantID, request.Body.FK_MerchantAppID))
            {
                response.IsSuccess = false;
                response.Message = "商户号与应用号不匹配，请核对后再试！";
                return response;
            }

            #endregion 数据校验

            request.Body.CreaterID = this.ContextInfo.UserInfoID;
            request.Body.CreaterName = this.ContextInfo.UserName;
            request.Body.CreateTime = DateTime.Now;
            request.Body.UpdaterID = request.Body.CreaterID;
            request.Body.UpdaterName = request.Body.CreaterName;
            request.Body.UpdateTime = request.Body.CreateTime;
            response.IsSuccess = this.bll.Add(request.Body);

            if (response.IsSuccess)
            {
                response.Message = "产品信息添加成功！";
            }
            else
            {
                response.Message = "产品信息添加失败！";
            }

            return response;
        }

        /// <summary>
        /// 修改产品信息
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.Product> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            var model = bll.GetModel(request.Body.ProductID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的产品信息！";
                return response;
            }

            request.Body.ProductName = (request.Body.ProductName ?? "").Trim();
            request.Body.Description = (request.Body.Description ?? string.Empty).Trim();

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            if (string.IsNullOrWhiteSpace(request.Body.ProductName))
            {
                response.IsSuccess = false;
                response.Message = "请提供产品名称！";
                return response;
            }

            //应用号与商户一致
            if (!this.merchantAppBLL.IsTheSameMerchantInfoID(request.Body.FK_MerchantID, request.Body.FK_MerchantAppID))
            {
                response.IsSuccess = false;
                response.Message = "商户号与应用号不匹配，请核对后再试！";
                return response;
            }

            #endregion 数据校验

            model.ProductName = request.Body.ProductName;
            model.Description = request.Body.Description;
            model.Price = request.Body.Price;
            model.PayedActionType = request.Body.PayedActionType;
            model.PayedRemark = request.Body.PayedRemark;
            model.SaleTitle = request.Body.SaleTitle;
            model.SaleType = request.Body.SaleType;
            model.Remark = request.Body.Remark;
            model.FK_MerchantID = request.Body.FK_MerchantID;
            model.FK_MerchantAppID = request.Body.FK_MerchantAppID;
            model.RecordState = request.Body.RecordState;
            model.UpdaterID = this.ContextInfo.UserInfoID;
            model.UpdaterName = this.ContextInfo.UserName;
            model.UpdateTime = DateTime.Now;

            response.IsSuccess = this.bll.Update(model);
            if (response.IsSuccess)
            {
                response.Message = "产品信息修改成功！";
            }
            else
            {
                response.Message = "产品信息修改失败！";
            }
            return response;
        }

        /// <summary>
        /// 删除产品信息
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
                response.Message = "请指定要删除的产品ID！";
                return response;
            }

            foreach (var k in request.Body)
            {
                var model = this.bll.GetModel(k);
                if (null == model)
                {
                    continue;
                }

                model.UpdaterID = this.ContextInfo.UserInfoID;
                model.UpdaterName = this.ContextInfo.UserName;
                model.UpdateTime = DateTime.Now;
                model.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.R.ToString();
                if (!this.bll.Update(model))
                {
                    response.IsSuccess = false;
                    response.Message = "产品删除失败！";
                    return response;
                }
            }

            response.IsSuccess = true;
            response.Message = "已成功删除产品！";
            response.IsRefresh = true;

            return response;
        }
    }
}