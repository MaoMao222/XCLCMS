using System.Collections.Generic;

namespace XCLCMS.Data.BLL
{
    /// <summary>
    /// 商户表
    /// </summary>
    public partial class Merchant
    {
        private readonly XCLCMS.Data.DAL.Merchant dal = new XCLCMS.Data.DAL.Merchant();

        /// <summary>
        /// 增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.Merchant model)
        {
            return dal.Add(model);
        }

        /// <summary>
        /// 更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.Merchant model)
        {
            return dal.Update(model);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.Merchant GetModel(long MerchantID)
        {
            return dal.GetModel(MerchantID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.Merchant> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 获取商户类型
        /// </summary>
        public Dictionary<string, long> GetMerchantTypeDic()
        {
            return new XCLCMS.Data.BLL.SysDic().GetDictionaryByCodeWithID(XCLCMS.Data.CommonHelper.SysDicConst.SysDicCodeEnum.MerchantType.ToString());
        }

        /// <summary>
        /// 判断指定MerchantName是否存在
        /// </summary>
        public bool IsExistMerchantName(string merchantName)
        {
            return dal.IsExistMerchantName(merchantName);
        }

        /// <summary>
        /// 批量删除商户数据
        /// </summary>
        public bool Delete(List<long> idLst, XCLCMS.Data.Model.Custom.ContextModel context)
        {
            return dal.Delete(idLst, context);
        }
    }
}