using System.Collections.Generic;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity.Orders;

namespace XCLCMS.Lib.WebAPI
{
    /// <summary>
    /// 订单管理 API
    /// </summary>
    public static class OrdersAPI
    {
        /// <summary>
        /// 查询订单信息实体
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.Model.View.v_Orders> Detail(APIRequestEntity<long> request)
        {
            return Library.Request<long, XCLCMS.Data.Model.View.v_Orders>(request, "Orders/Detail");
        }

        /// <summary>
        /// 查询订单信息分页列表
        /// </summary>
        public static APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Orders>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            return Library.Request<PageListConditionEntity, XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Orders>>(request, "Orders/PageList");
        }

        /// <summary>
        /// 新增订单信息
        /// </summary>
        public static APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.Orders> request)
        {
            return Library.Request<XCLCMS.Data.Model.Orders, bool>(request, "Orders/Add", false);
        }

        /// <summary>
        /// 修改订单信息
        /// </summary>
        public static APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.Orders> request)
        {
            return Library.Request<XCLCMS.Data.Model.Orders, bool>(request, "Orders/Update", false);
        }

        /// <summary>
        /// 修改订单支付状态
        /// </summary>
        public static APIResponseEntity<bool> UpdatePayStatus(APIRequestEntity<UpdatePayStatusEntity> request)
        {
            return Library.Request<UpdatePayStatusEntity, bool>(request, "Orders/UpdatePayStatus", false);
        }

        /// <summary>
        /// 删除订单信息
        /// </summary>
        public static APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            return Library.Request<List<long>, bool>(request, "Orders/Delete", false);
        }
    }
}