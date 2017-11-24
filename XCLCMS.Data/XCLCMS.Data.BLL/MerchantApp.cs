using System.Collections.Generic;

namespace XCLCMS.Data.BLL
{
    /// <summary>
    /// 商户应用表
    /// </summary>
    public partial class MerchantApp
    {
        private readonly XCLCMS.Data.DAL.MerchantApp dal = new XCLCMS.Data.DAL.MerchantApp();

        public MerchantApp()
        { }

        #region BasicMethod

        /// <summary>
        /// 增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.MerchantApp model)
        {
            return dal.Add(model);
        }

        /// <summary>
        /// 更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.MerchantApp model)
        {
            return dal.Update(model);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.MerchantApp GetModel(long MerchantAppID)
        {
            return dal.GetModel(MerchantAppID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.MerchantApp> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        #endregion BasicMethod

        #region Extend Method

        /// <summary>
        /// 获取指定商户的所有应用
        /// </summary>
        public List<XCLCMS.Data.Model.MerchantApp> GetModelList(long merchantID)
        {
            return dal.GetModelList(merchantID);
        }

        /// <summary>
        /// 判断指定MerchantAppName是否存在
        /// </summary>
        public bool IsExistMerchantAppName(string merchantAppName)
        {
            return dal.IsExistMerchantAppName(merchantAppName);
        }

        /// <summary>
        /// 检查指定的应用号是否属于指定的商户
        /// </summary>
        public bool IsTheSameMerchantInfoID(long merchantID, long merchantAppID)
        {
            if (merchantAppID == 0)
            {
                return true;
            }
            var appModel = this.GetModel(merchantAppID);
            if (null == appModel)
            {
                return false;
            }
            return appModel.FK_MerchantID == merchantID;
        }

        /// <summary>
        /// 根据appkey查询实体
        /// </summary>
        public XCLCMS.Data.Model.MerchantApp GetModel(string appKey)
        {
            return dal.GetModel(appKey);
        }

        #endregion Extend Method
    }
}