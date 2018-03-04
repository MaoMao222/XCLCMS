using System;
using System.Collections.Generic;
using System.Linq;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.Orders;
using XCLCMS.IService.WebAPI;
using XCLNetTools.Generic;

namespace XCLCMS.Service.WebAPI
{
    public class OrdersService : IOrdersService
    {
        private readonly XCLCMS.Data.BLL.Orders bll = new XCLCMS.Data.BLL.Orders();
        private readonly XCLCMS.Data.BLL.View.v_Orders vBLL = new Data.BLL.View.v_Orders();
        private readonly XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();
        private readonly XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();
        private readonly XCLCMS.Data.BLL.Product productBLL = new Data.BLL.Product();
        private readonly XCLCMS.Data.BLL.UserInfo userInfoBLL = new Data.BLL.UserInfo();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 查询订单信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.View.v_Orders> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.View.v_Orders>();
            response.Body = vBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 获取指定用户已购买成功过指定产品的订单信息
        /// </summary>
        public APIResponseEntity<Data.Model.View.v_Orders> GetUserProductPayedOrder(APIRequestEntity<UserProductOrderQueryEntity> request)
        {
            var response = new APIResponseEntity<Data.Model.View.v_Orders>();

            if (request.Body.ProductID <= 0)
            {
                response.IsSuccess = false;
                response.Message = "请指定产品ID！";
                return response;
            }

            if (request.Body.UserID <= 0 && string.IsNullOrWhiteSpace(request.Body.UserName))
            {
                response.IsSuccess = false;
                response.Message = "请指定用户信息！";
                return response;
            }

            if (request.Body.UserID > 0)
            {
                var uInfo = this.userInfoBLL.GetModel(request.Body.UserID);
                if (null == uInfo)
                {
                    response.IsSuccess = false;
                    response.Message = "请指定有效的用户信息！";
                    return response;
                }
                request.Body.UserName = uInfo.UserName;
            }

            var lst = vBLL.GetUserProductOrderModelList(new Order_UserProductCondition()
            {
                PayStatus = XCLCMS.Data.CommonHelper.EnumType.PayStatusEnum.DON.ToString(),
                ProductID = request.Body.ProductID,
                Top = 1,
                UserID = request.Body.UserID,
                UserName = request.Body.UserName,
                RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString()
            });
            response.Body = lst?.FirstOrDefault();
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 查询订单信息分页列表
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Orders>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            var pager = request.Body.PagerInfoSimple.ToPagerInfo();
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Orders>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_Orders>();
            response.Body.ResultList = vBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
            {
                OrderBy = "[OrderID] desc",
                Where = request.Body.Where
            });
            response.Body.PagerInfo = pager;
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 新增订单信息
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.Orders> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            //应用号与商户一致
            if (!this.merchantAppBLL.IsTheSameMerchantInfoID(request.Body.FK_MerchantID, request.Body.FK_MerchantAppID))
            {
                response.IsSuccess = false;
                response.Message = "商户号与应用号不匹配，请核对后再试！";
                return response;
            }

            //产品必须存在
            var productModel = this.productBLL.GetModel(request.Body.FK_ProductID);
            if (null == productModel)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的产品信息！";
                return response;
            }

            //产品与商户一致
            if (productModel.FK_MerchantID != request.Body.FK_MerchantID)
            {
                response.IsSuccess = false;
                response.Message = "当前订单中的产品信息所属商户应与该订单所属商户一致！";
                return response;
            }

            //买家校验
            if (request.Body.FK_UserID > 0)
            {
                var buyerInfo = userInfoBLL.GetModel(request.Body.FK_UserID);
                if (null == buyerInfo)
                {
                    response.IsSuccess = false;
                    response.Message = "必须指定有效的买家信息！";
                    return response;
                }
                request.Body.UserName = buyerInfo.UserName;
            }
            else
            {
                request.Body.FK_UserID = 0;
            }

            #endregion 数据校验

            request.Body.DealDoneTime = null;
            request.Body.FlowStatus = 0;
            request.Body.PayStatus = XCLCMS.Data.CommonHelper.EnumType.PayStatusEnum.WAT.ToString();
            request.Body.TransactionNO = Guid.NewGuid().ToString("N").ToUpper();
            request.Body.CreaterID = this.ContextInfo.UserInfoID;
            request.Body.CreaterName = this.ContextInfo.UserName;
            request.Body.CreateTime = DateTime.Now;
            request.Body.UpdaterID = request.Body.CreaterID;
            request.Body.UpdaterName = request.Body.CreaterName;
            request.Body.UpdateTime = request.Body.CreateTime;
            response.IsSuccess = this.bll.Add(request.Body);

            if (response.IsSuccess)
            {
                response.Message = "订单信息添加成功！";
            }
            else
            {
                response.Message = "订单信息添加失败！";
            }

            return response;
        }

        /// <summary>
        /// 修改订单信息
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.Orders> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            var model = bll.GetModel(request.Body.OrderID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的订单信息！";
                return response;
            }

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            //应用号与商户一致
            if (!this.merchantAppBLL.IsTheSameMerchantInfoID(request.Body.FK_MerchantID, request.Body.FK_MerchantAppID))
            {
                response.IsSuccess = false;
                response.Message = "商户号与应用号不匹配，请核对后再试！";
                return response;
            }

            //产品必须存在
            var productModel = this.productBLL.GetModel(model.FK_ProductID);
            if (null == productModel)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的产品信息！";
                return response;
            }

            //产品与商户一致
            if (productModel.FK_MerchantID != request.Body.FK_MerchantID)
            {
                response.IsSuccess = false;
                response.Message = "当前订单中的产品信息所属商户应与该订单所属商户一致！";
                return response;
            }

            //买家校验
            if (request.Body.FK_UserID > 0)
            {
                var buyerInfo = userInfoBLL.GetModel(request.Body.FK_UserID);
                if (null == buyerInfo)
                {
                    response.IsSuccess = false;
                    response.Message = "必须指定有效的买家信息！";
                    return response;
                }
                request.Body.UserName = buyerInfo.UserName;
            }
            else
            {
                request.Body.FK_UserID = 0;
            }

            #endregion 数据校验

            model.FK_UserID = request.Body.FK_UserID;
            model.UserName = request.Body.UserName;
            model.Price = request.Body.Price;
            model.PayType = request.Body.PayType;
            model.Remark = request.Body.Remark;
            model.FK_MerchantID = request.Body.FK_MerchantID;
            model.FK_MerchantAppID = request.Body.FK_MerchantAppID;
            model.RecordState = request.Body.RecordState;
            model.UpdaterID = this.ContextInfo.UserInfoID;
            model.UpdaterName = this.ContextInfo.UserName;
            model.UpdateTime = DateTime.Now;
            model.Version = request.Body.Version;
            model.ContactName = request.Body.ContactName;
            model.Email = request.Body.Email;
            model.Mobile = request.Body.Mobile;
            model.OtherContact = request.Body.OtherContact;

            response.IsSuccess = this.bll.Update(model);
            if (response.IsSuccess)
            {
                response.Message = "订单信息修改成功！";
            }
            else
            {
                response.Message = "订单信息修改失败！";
            }
            return response;
        }

        /// <summary>
        /// 修改订单支付状态
        /// </summary>
        public APIResponseEntity<bool> UpdatePayStatus(APIRequestEntity<UpdatePayStatusEntity> request)
        {
            var response = new APIResponseEntity<bool>();
            var dtNow = DateTime.Now;

            #region 数据校验

            var model = bll.GetModel(request.Body.OrderID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的订单信息！";
                return response;
            }

            if (model.PayStatus == request.Body.PayStatus)
            {
                response.IsSuccess = false;
                response.Message = "订单支付状态与当前系统数据一致，无需更新！";
                return response;
            }

            #endregion 数据校验

            model.UpdaterID = this.ContextInfo.UserInfoID;
            model.UpdaterName = this.ContextInfo.UserName;
            model.UpdateTime = dtNow;
            model.Version = request.Body.Version;
            model.PayStatus = request.Body.PayStatus;

            if (model.PayStatus == XCLCMS.Data.CommonHelper.EnumType.PayStatusEnum.DON.ToString())
            {
                model.DealDoneTime = dtNow;
            }
            else
            {
                model.DealDoneTime = null;
            }

            response.IsSuccess = this.bll.Update(model);
            if (response.IsSuccess)
            {
                response.Message = "支付状态修改成功！";
            }
            else
            {
                response.Message = "支付状态修改失败！";
            }
            return response;
        }

        /// <summary>
        /// 删除订单信息
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
                response.Message = "请指定要删除的订单ID！";
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
                    response.Message = "订单删除失败！";
                    return response;
                }
            }

            response.IsSuccess = true;
            response.Message = "已成功删除订单！";
            response.IsRefresh = true;

            return response;
        }
    }
}